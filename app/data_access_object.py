import pymongo
import json
import gridfs


class MongoDAO:
    """
   The MongoDAO object, used to interface with a given MongoDB database

   Attributes:

   client : MongoClient
      used to connect to the database server
   graphdb : Database
      used to manipulate graph database entries
   blueprintdb : Database
      used to manipulate blueprint database entries
   blueprint_fs : GridFS
      used to save and retrieve blueprints
   meta_collect : Collection
      used to view metadata for stored blueprints

   Methods:

   save_graph : bool
      saves latest version of a graph in the database
      returns true if successful, false otherwise
   delete_version : bool
      deletes a version of a graph from the database
      returns true if successful, false otherwise
   delete_graph : bool
      deletes all records of a graph from the database
      returns true if successful, false otherwise
   get_latest : json
      returns the latest version of the specified graph
   get_version : json
      returns a specified version of the specified graph
   get_all_versions : [int]
      returns a list of past versions for the requested graph
   get_all_names : [String]
      returns a list of graph names
   save_blueprint : None
      saves the blueprint image of a graph
   get_blueprint : File-like object
      returns the blueprint of a graph
   """

    def __init__(self, connection, password):
        """Constructor for the mongodb data access object"""
        self.client = pymongo.MongoClient(connection.replace("<password>", password))

        # use self.graphdb to reference the database of graphs
        self.graphdb = self.client.graphs

        # use self.blueprintdb to reference the database of blueprints
        self.blueprintdb = self.client.blueprints
        self.blueprint_fs = gridfs.GridFS(self.blueprintdb)
        self.meta_collect = self.blueprintdb.fs.files

    def save_graph(self, graphname, graph):
        """
      Saves the newest version of a graph under its corresponding collection
      If there are 10 versions already stored the oldest version is discarded
      """
        collection = self.graphdb[graphname]
        delete = True

        if collection.estimated_document_count() >= 10:
            dates = collection.find({}, {'_id': 0, 'date': 1})
            stripped = [date['date'] for date in dates]
            del_result = collection.delete_one({'date': stripped[0]})
            delete = del_result.deleted_count == 1
        ins_result = collection.insert_one(graph)
        return ins_result.acknowledged and delete

    def save_blueprint(self, graphname, blueprint):
        existing = self.meta_collect.find_one({"filename": graphname})
        if existing is not None:
            self.blueprint_fs.delete(existing['_id'])
        self.blueprint_fs.put(blueprint, filename=graphname)

    def delete_version(self, graphname, date):
        """deletes version of specified graph corresponding to the given date"""
        collection = self.graphdb[graphname]
        result = collection.delete_one({'date': date})
        return result.deleted_count == 1

    def delete_graph(self, graphname):
        """deletes the collection corresponding to the graph labelled by graphname from the database"""
        existing = self.meta_collect.find_one({"filename": graphname})
        if existing is not None:
            self.blueprint_fs.delete(existing['_id'])

        collection = self.graphdb[graphname]
        return collection.drop()

    def get_latest(self, graphname):
        """returns a json object for the latest version of the specified graph"""
        collection = self.graphdb[graphname]
        dates = collection.find({}, {'_id': 0, 'date': 1})
        stripped = [date['date'] for date in dates]
        document = collection.find_one({'date': stripped[-1]}, {'_id': 0})
        return document

    def get_version(self, graphname, date):
        """returns a json object for the given version of the specified graph"""
        collection = self.graphdb[graphname]
        document = collection.find_one({'date': date}, {'_id': 0})
        return document

    def get_all_versions(self, graphname):
        """returns all stored versions of the specified graph, in a list dates for those objects"""
        collection = self.graphdb[graphname]
        dates = collection.find({}, {'_id': 0, 'date': 1})
        return [date['date'] for date in dates]

    def get_all_names(self):
        """returns a list of names of all graphs in the database"""
        return self.graphdb.list_collection_names()

    def get_blueprint(self, graphname):
        """returns the blueprint for the given graph"""
        return self.blueprint_fs.find_one({"filename": graphname}).read()
