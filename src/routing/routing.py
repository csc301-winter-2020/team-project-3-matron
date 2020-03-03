from flask import Flask, request
from flask_pymongo import PyMongo
import LinkedList
import os

app = Flask(__name__)
app.config["MONGO_URI"] = "filler until I know datagbase url"
mongo = PyMongo(app)

# this will be a dictionary used to store the 
# pairs of graph and images of a given blueprint
blueprints = {}

@app.route('/')
def index():
    return '<h1>Hello!</h1>'

# used to acquire the appropriate blue_print for a
# specific wing of a specific floor
@app.route('/blueprint/<string:name>/<date>')
def get_blueprint(name, date):
    # TODO
    raise NotImplementedError
    return blueprints[zip(floor_number, wing_number)]

@app.route('/graph/<string:name>/<date>')
def get_graph(name, date):
    # TODO
    raise NotImplementedError    

# TODO add functions to store and save current blue prints
# to the MongoDB server
@app.route('/blueprint/<string:name>/<date>', methods=['POST'])
def saveBlueprint(floor_number, wing_number):
    raise NotImplementedError

# TODO add functions store and save graph to MongoDB server
@app.route('/graph/<string:name>/<date>', methods=['POST'])
def saveGraph(name, date):
    raise NotImplementedError

if __name__ == '__main__':
    # TODO make this part fetch all items from the server and parse them into 
