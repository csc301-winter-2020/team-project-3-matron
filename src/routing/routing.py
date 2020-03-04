from flask import Flask, request
from flask_pymongo import PyMongo
import datetime
from time import gmtime, strftime, mktime
import dao
import os

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://matron:<password>@matron-db-pxltz.azure.mongodb.net/test?retryWrites=true&w=majority"
mongo = PyMongo(app)

dao = None

@app.route('/')
def index():
    return '<h1>Hello!</h1>'

# used to acquire the appropriate blue_print for a
# specific wing of a specific floor
@app.route('/blueprint/<string:name>', methods=['GET', 'POST'])
def blueprint(name):
    # TODO
    if request.method == 'POST':
        blueprint = request.get_json()
    elif request.method == 'GET':

    else:
        print("Invalid request type!")
    raise NotImplementedError


@app.route('/graph/<string:name>', methods=['GET', 'POST'])
def graph(name):
    if request.method == 'POST':
        g = request.get_json()
        time = mktime(gmtime(0))
        graph = { "time" : time, "graph" : g}
        dao.save_graph(name, graph)
    elif request.method == 'GET':
        dao.get_latest(name)
    else:
        print("Invalid request type!")  


@app.route('/graph/<string:name>/requestAll')
def get_all_versions(name):
    times = []

    graphs = dao.get_all_versions(name)
    for(graph in graphs):
        times.append(strftime("%d %m %Y %H: %M: %S", gmtime(graph["time"])))
    return times


@app.route('/graph/<string:name>/<date>')
def get_version(name, date):
    utc_time = datetime.strptime(date, "%d %m %Y %H: %M: %S")
    epoch = timegm(utc_time)
    return dao.get_version(name, epoch)
    

if __name__ == '__main__':
    dao = MongoDAO("matron", "<password>")
