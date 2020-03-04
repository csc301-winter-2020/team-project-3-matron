from flask import Flask, request
from flask_pymongo import PyMongo
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
@app.route('/blueprint/<string:name>/request')
def get_blueprint(name):
    # TODO
    raise NotImplementedError

@app.route('/graph/<string:name>/request')
def get_graph(name):
    # TODO
    raise NotImplementedError    

# TODO add functions to store and save current blue prints
# to the MongoDB server
@app.route('/blueprint/<string:name>/save')
def saveBlueprint(name):
    raise NotImplementedError

# TODO add functions store and save graph to MongoDB server
@app.route('/graph/<string:name>/save')
def saveGraph(name):
    raise NotImplementedError

# TODO retrieve a list of all versions of a specific graph
@app.route('/graph/<string:name>/requestAll')
def get_all_versions(name):
    raise NotImplementedError

if __name__ == '__main__':
    # TODO make this part fetch all items from the server and parse them into 
    dao = MangoDAO("matron", "<password>")
