from datetime import datetime
import os
import auth
from calendar import timegm
from time import gmtime, strftime, time

from data_access_object import MongoDAO
from clean_graph import clean_and_dump
from distance import find_dist_from_start, find_all_room_distances, distance
from flask import Flask, request, jsonify, send_file, render_template, g

app = Flask(__name__)
url = os.environ['DB_URL']
password = os.environ['DB_PASS']
dao = None

success = {'status': 200}
failure = {'status': 400}

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
@auth.BasicAuth.login_required
def index(path):
    return render_template("index.html")


@app.route('/auth/login', methods=['GET', 'POST'])
def login_user():
    """ """
    if request.method == "GET":
        return render_template("login.html")
    else:
         return jsonify({"status": 405, "error": "request method not supported"})
        
@app.route('/api/token', methods=['POST'])
@auth.BasicAuth.login_required
def get_auth_token():
    token = auth.Auth.generate_auth_token(str(g.user['_id']))
    return jsonify({ 'token': token.decode('ascii') })


@app.route('/auth/register', methods=['GET', 'POST'])
def register_user():
    """ """
    if request.method == "POST":
        data = request.get_json(force=True)
        if data.get("username", None) is None:
            return jsonify({"status": 400, "error": "username is required"})
        elif data.get("password", None) is None:
            return jsonify({"status": 400, "error": "password is required"})
        
        hash = auth.Auth.hash_password(data["password"])
        auth.dao.save_user(data["username"], hash)
        response = jsonify({'message': 'user resource successfully created', 'status': 201})
        response.status_code = 201
        return response
    elif request.method == "GET":
        return render_template("register.html")

@app.route('/graph/names')
@auth.BasicAuth.login_required
def get_graph_names():
    """acquires all graph names"""
    return jsonify({'graph': dao.get_all_names(), 'status': 200})


@app.route('/graph/<string:name>', methods=['GET', 'POST', 'DELETE'])
@auth.BasicAuth.login_required
def graph_functions(name):
    """
    fetches a saved graph or save a new graph into the database
    depending on the request type
    name: the name of the graph
    """
    print(name)
    if request.method == 'POST':
        data = request.get_json(force=True)
        g = data['graph']

        if 'new_name' in data:
            new_name = data['new_name']
        else:
            new_name = ''

        t = int(time())
        graph = {"date": t, "graph": g}

        # sets a new name for the graph if one is posted
        if new_name != "":
            check = dao.rename_graph(name, new_name)
            if(check == -1):
                return jsonify({"status": 400, "error": "new name is not a string"})
            elif (check == -2):
                return jsonify({"status": 400, "error": "not a valid new name"})
            name = new_name
        if dao.save_graph(name, graph):
            return jsonify(success)
        else:
            return jsonify(failure)
    elif request.method == 'GET':
        graph, blueprint = dao.get_latest(name)
        if graph is None:
            return jsonify({"status": 404})
        if blueprint is None:
            return jsonify({'graph': graph['graph'], 'status': 200})
        return jsonify({'graph': graph['graph'], 'blueprint': blueprint, 'status': 200})
    elif request.method == 'DELETE':
        if dao.delete_graph(name):
            return jsonify(success)
        else:
            return jsonify(failure)
    else:
        print("Invalid request type!")


@app.route('/both/<string:graph_name>', methods=['POST'])
@auth.BasicAuth.login_required
def graph_and_print(graph_name):
    """
    saves the graph and blueprint together
    graph_name: the name of the graph being saved
    """
    incoming_data = request.get_json(force=True)
    g = incoming_data['graph']
    blueprint = incoming_data['blueprint']
    if 'new_name' in incoming_data:
        new_name = incoming_data['new_name']
    else:
        new_name = ''

    # sets a new name for the graph if one is posted
    if new_name != "" and (graph_name != new_name):
        check = dao.rename_graph(graph_name, new_name)
        if(check == -1):
            return jsonify({"status": 400, "error": "new name is not a string"})
        elif (check == -2):
            return jsonify({"status": 400, "error": "not a valid new name"})
        graph_name = new_name

    t = int(time())
    graph = {"date": t, "graph": g}

    if(dao.save_graph_and_print(graph_name, graph, blueprint)):
        return jsonify(success)
    else:
        return jsonify(failure)


@app.route('/graph/requestAll/<string:name>')
@auth.BasicAuth.login_required
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
@auth.BasicAuth.login_required
def all_db_graphs():
    """ Returns a list of the names of all graphs in the db"""
    graphs = dao.get_all_names()
    if len(graphs) != 0:
        return jsonify({'graphs': graphs, 'status': 200})
    else:
        return jsonify({'status': 404})


@app.route('/graph/version/<string:name>/<date>', methods=['GET', 'DELETE'])
@auth.BasicAuth.login_required
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
        if graph is None:
            return jsonify({'status': 404})
        if blueprint is None:
            return jsonify({'graph': graph['graph'], 'status': 200})
        return jsonify({'graph': graph['graph'], 'blueprint': blueprint, 'status': 200})
    elif request.metohd == 'DELETE':
        if dao.delete_version(name, epoch):
            return jsonify(success)
        else:
            return jsonify(failure)
    else:
        print("Error retreiving graph version: ", name, " ", date)
        return jsonify(failure)


@app.route('/graph/distances_from_room/<string:graph_name>/<string:room>')
@auth.BasicAuth.login_required
def distances_from_room(graph_name, room):
    """
    retrieves all distances of a specific room to the rest
    of the hospital wing
    graph_name: the name of the graph
    room:       the name of the room
    """
    graph_data, print_data = dao.get_latest(graph_name)
    if graph_data is None:
        return jsonify({"status": 404})
    graph = graph_data['graph']['elements']
    try:
        res = {'distances': find_dist_from_start(graph, room), 'status': 200}
        return jsonify(res)
    except ValueError:
        return jsonify({'status': 400, 'info': "non-connected graph!"})


@app.route('/graph/all_distances/<string:graph_name>')
@auth.BasicAuth.login_required
def all_distances(graph_name):
    """
    retrieves every single distance from every room
    from all rooms for a given hospital wing
    graph_name: name of the to be inspected
    """

    graph_data, print_data = dao.get_latest(graph_name)
    if graph_data is None:
        return jsonify({"status": 404})
    graph = graph_data['graph']['elements']

    try:
        res = {'distances': find_all_room_distances(graph), 'status': 200}
        return jsonify(res)
    except ValueError:
        return jsonify({'status': 400, 'info': "non-connected graph!"})


@app.route('/graph/distance_two_rooms/<string:graph_name>/<string:room_name0>/<string:room_name1>')
@auth.BasicAuth.login_required
def distance_two_rooms(graph_name, room_name0, room_name1):
    """
    find the distance between 2 specific rooms on a floor
    graph_name: name of the graph to examine
    room_name0: name of the starting room
    room_name1: name of destination room
    """
    data, print_data = dao.get_latest(graph_name)
    if data is None:
        return jsonify({"status": 404})
    dist = distance(data['graph']['elements'], room_name0, room_name1)

    return jsonify(dist)

# From https://stackoverflow.com/questions/34066804/disabling-caching-in-flask
@app.after_request
def add_header(r):
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r

if __name__ == "__main__":
    dao = MongoDAO(url, password)
    auth.dao = dao
    if os.environ.get('FLASK_ENV') == 'development':
        app.config.from_pyfile('config/development.py')
    else:
        app.config.from_pyfile('config/production.py')
    app.run(host='0.0.0.0', debug=True, port=os.environ.get('PORT', 80))
