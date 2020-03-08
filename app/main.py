from datetime import datetime
import os
from time import gmtime, strftime, time

from data_access_object import MongoDAO
from clean_graph import clean_and_dump
from distance import find_dist_and_dump, find_all_dist_and_dump, dijkstra
from flask import Flask, request, jsonify, send_file, render_template

app = Flask(__name__)

url = "mongodb+srv://matron:<password>@matron-db-pxltz.azure.mongodb.net/test?retryWrites=true&w=majority"
password = "zO0J376wJeEmR4xc"
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


# used to acquire the appropriate blue_print for a
# specific wing of a specific floor
@app.route('/blueprint/<string:name>', methods=['GET', 'POST'])
def blueprint(name):
    """
    fetches a saved blueprint, or saves a new blueprint into the
    database depending on the request type
    """
    print(request.data)

    if request.method == 'POST':
        dao.save_blueprint(name, request.data)
        return jsonify(success)
    elif request.method == 'GET':
        byte_array = dao.get_blueprint(name)
        return jsonify(byte_array)
    else:
        print("Invalid request type!")
        return jsonify(failure)


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
        data = dao.get_latest(name)
        graph = data['graph']
        return jsonify({'graph': graph, 'status': 200})
    elif request.method == 'DELETE':
        if dao.delete_graph(name):
            return jsonify(success)
        else:
            return jsonify(failure)
    else:
        print("Invalid request type!")


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


@app.route('/graph/version/<string:name>/<date>', methods=['GET', 'DELETE'])
def graph_version(name, date):
    """
    retrieves/deletes the specified version dates of a given graph

    name: name of the graph
    date: the version date wanted
    """
    utc_time = datetime.strptime(date, "%d %m %Y %H: %M: %S")
    epoch = timegm(utc_time)
    if request.method == 'GET':
        data = dao.get_version(name, epoch)
        graph = data['graph']
        return jsonify({'graph': graph, 'status': 200})
    elif request.metohd == 'DELETE':
        if dao.delete_version(name, epoch):
            return jsonify(success)
        else:
            return jsonify(failure)
    else:
        print("Error retreiving graph version: ", name, " ", date)
        return jsonify(failure)


@app.route('/graph/distance/<string:graph_name>/<string:room>')
def distances_from_room(graph_name, room):
    """
    retrieves all distances of a specific room to the rest
    of the hospital wing

    graph_name: the name of the graph
    room:       the name of the room
    """
    data = dao.get_latest(graph_name)
    graph = data['graph']
    try: 
        res = {'distances': find_dist_and_dump(graph, room), 'status': 200}
        return jsonify(res)
    except ValueError:
        return jsonify({'status': 400, 'info': "non-connected graph!"})


@app.route('/graph/distances/<string:graph_name>')
def all_distances(graph_name):
    """
    retrieves every single distance from every room
    from all rooms for a given hospital wing

    graph_name: name of the to be inspected
    """

    data = dao.get_latest(graph_name)
    graph = data['graph']

    try:
        res = {'distances': find_all_dist_and_dump(graph), 'status': 200}
        return jsonify(res)
    except ValueError:
        return jsonify({'status': 400, 'info': "non-connected graph!"})


@app.route('/graph/distance/rooms/<string:graph_name>/<string:room_name0>/<string:room_name1>')
def distance_two_rooms(graph_name, room_name0, room_name1):
    """
    find the distance between 2 specific rooms on a floor

    graph_name: name of the graph to examine
    room_name0: name of the starting room
    room_name1: name of destination room
    """
    data = dao.get_latest(graph_name)
    graph = data['graph']
    path = dijkstra(graph, room_name0, room_name1, None)
    if info[0] == -1:
        return jsonify({'status': 400, 'info': "path not found"})
    else:
        return jsonify({'status': 200, 'path': info})


@app.route('/graph/clean')
def clean_graph():
    """cleans the graph"""
    graph = request.get_json(force=True)
    return jsonify({'graph': clean_and_dump(graph), 'status': 200})


if __name__ == '__main__':
    dao = MongoDAO(url, password)
    app.run(host='0.0.0.0', debug=True, port=os.environ.get('PORT', 80))