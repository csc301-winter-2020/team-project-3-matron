from datetime import datetime
import os
from time import gmtime, strftime, time

from data_access_object import MongoDAO
from clean_graph import clean_and_dump
from distance import find_dist_and_dump, find_all_dist_and_dump
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
    if request.method == 'POST':
        img = request.files['image']
        dao.save_blueprint(name, img)
        return jsonify(success)
    elif request.method == 'GET':
        byte_array = dao.get_blueprint(name)
        with open(name + ".png", "wb") as write_file:
            write_file.write(byte_array)

        try:
            return send_file(name + ".png", attachment_filename=name + ".png")
        except Exception as e:
            return str(e)
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
        time = int(time.time())
        graph = {"date": time, "graph": g}
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


@app.route('/graph/<string:name>/requestAll')
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


@app.route('/graph/<string:name>/<date>', methods=['GET', 'DELETE'])
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


@app.route('/graph/<string:graph_name>/<string:room>')
def distances_from_room(graph_name, room):
    """
    retrieves all distances of a specific room to the rest
    of the hospital wing

    graph_name: the name of the graph
    room:       the name of the room
    """
    graph = request.get_json(force=True)
    try: 
        res = {'distances': find_dist_and_dump(graph, room), 'status': 200}
        return jsonify(res)
    except ValueError:
        return jsonify({'status': 400, 'info': "non-connected graph!"})


@app.route('/graph/<string:graph_name>/distances')
def all_distances(graph_name):
    """
    retrieves every single distance from every room
    from all rooms for a given hospital wing

    graph_name: name of the graph to be inspected
    """
    graph = request.get_json(force=True)
    try:
        res = {'distances': find_all_dist_and_dump(graph), 'status': 200}
        return jsonify(res)
    except ValueError:
        return jsonify({'status': 400, 'info': "non-connected graph!"})


@app.route('/graph/clean')
def clean_graph():
    """cleans the graph"""
    graph = request.get_json(force=True)
    return jsonify({'graph': clean_and_dump(graph), 'status': 200})


if __name__ == '__main__':
    dao = MongoDAO(url, password)
    app.run(host='0.0.0.0', debug=True, port=os.environ.get('PORT', 80))
