from datetime import datetime
import os
from calendar import timegm
from time import gmtime, strftime, time

from data_access_object import MongoDAO
from clean_graph import clean_and_dump
from distance import find_dist_and_dump, find_all_dist_and_dump, distance
from flask import Flask, request, jsonify, send_file, render_template

app = Flask(__name__)

url = os.environ['DB_URL']
password = os.environ['DB_PASS']
dao = None

success = {'status': 200}
failure = {'status': 400}


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/graph/names')
def get_graph_names():
    """acquires all graph names"""
    return jsonify({'graph': dao.get_all_names(), 'status': 200})


@app.route('/graph/<string:name>', methods=['GET', 'POST', 'DELETE'])
def graph(name):
    """
    fetches a saved graph or save a new graph into the database
    depending on the request type

    name: the name of the graph
    """
    if request.method == 'POST':
        g = request.get_json(force=True)
        t = int(time())
        graph = {"date": t, "graph": g}
        if dao.save_graph(name, graph):
            return jsonify(success)
        else:
            return jsonify(failure)
    elif request.method == 'GET':
        graph, blueprint = dao.get_latest(name)
        return jsonify({'graph': graph['graph'], 'blueprint': blueprint['blueprint'], 'status': 200})
    elif request.method == 'DELETE':
        if dao.delete_graph(name):
            return jsonify(success)
        else:
            return jsonify(failure)
    else:
        print("Invalid request type!")


@app.route('/both/<string:graph_name>', methods=['POST'])
def graph_and_print(graph_name):
    """
    saves the graph and blueprint together

    graph_name: the name of the graph being saved
    """
    incoming_data = request.get_json(force=True)
    graph = incoming_data['graph']
    blueprint = incoming_data['blueprint']

    if(dao.save_graph_and_print(graph_name, graph, blueprint)):
        return jsonify(success)
    else:
        return jsonify(failure)


@app.route('/graph/requestAll/<string:name>')
def get_all_versions(name):
    """
    acquires the 10 most recent dates of saves for a particular graph

    name: name of the graph to retrieve
    """
    times = []

    epochs = dao.get_all_versions(name)
    for epoch in epochs:
        times.append(strftime("%d %m %Y %H: %M: %S", gmtime(epoch)))
    return jsonify({'times': times, 'status': 200})


@app.route('/graph/requestAllGraphs/')
def all_db_graphs():
    """ Returns a list of the names of all graphs in the db"""
    graphs = dao.get_all_names()
    if len(graphs) == 0:
        return jsonify({'graphs': graphs, 'status': 200})
    else:
        return jsonify({'status': 404})


@app.route('/graph/version/<string:name>/<date>', methods=['GET', 'DELETE'])
def graph_version(name, date):
    """
    retrieves/deletes the specified version dates of a given graph

    name: name of the graph
    date: the version date wanted
    """
    utc_time = datetime.strptime(date, "%d %m %Y %H: %M: %S")
    epoch = timegm(utc_time.timetuple())
    if request.method == 'GET':
        graph, blueprint = dao.get_version(name, epoch)
        return jsonify({'graph': graph['graph'], 'blueprint': blueprint['blueprint'], 'status': 200})
    elif request.metohd == 'DELETE':
        if dao.delete_version(name, epoch):
            return jsonify(success)
        else:
            return jsonify(failure)
    else:
        print("Error retreiving graph version: ", name, " ", date)
        return jsonify(failure)


@app.route('/graph/distances_from_room/<string:graph_name>/<string:room>')
def distances_from_room(graph_name, room):
    """
    retrieves all distances of a specific room to the rest
    of the hospital wing

    graph_name: the name of the graph
    room:       the name of the room
    """
    graph_data, print_data = dao.get_latest(graph_name)
    graph = graph_data['graph']
    try: 
        res = {'distances': find_dist_and_dump(graph, room), 'status': 200}
        return jsonify(res)
    except ValueError:
        return jsonify({'status': 400, 'info': "non-connected graph!"})


@app.route('/graph/all_distances/<string:graph_name>')
def all_distances(graph_name):
    """
    retrieves every single distance from every room
    from all rooms for a given hospital wing

    graph_name: name of the to be inspected
    """

    graph_data, print_data = dao.get_latest(graph_name)
    graph = graph_data['graph']

    try:
        res = {'distances': find_all_dist_and_dump(graph), 'status': 200}
        return jsonify(res)
    except ValueError:
        return jsonify({'status': 400, 'info': "non-connected graph!"})


@app.route('/graph/distance_two_rooms/<string:graph_name>/<string:room_name0>/<string:room_name1>')
def distance_two_rooms(graph_name, room_name0, room_name1):
    """
    find the distance between 2 specific rooms on a floor

    graph_name: name of the graph to examine
    room_name0: name of the starting room
    room_name1: name of destination room
    """
    data, print_data = dao.get_latest(graph_name)
    dist = distance(data['graph']['cyGraph']['elements'], room_name0, room_name1)

    return jsonify(dist)


@app.route('/graph/clean')
def clean_graph():
    """cleans the graph"""
    graph = request.get_json(force=True)
    return jsonify({'graph': clean_and_dump(graph), 'status': 200})


dao = MongoDAO(url, password)
app.run(host='0.0.0.0', debug=True, port=os.environ.get('PORT', 80))
    