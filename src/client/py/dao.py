import pymongo
import json

class MongoDAO:
   """
   The MongoDAO object, used to interface with a given MongoDB database

   Attributes:

   client : MongoClient
      used to connect to the database server
   db : Database
      used to manipulate database entries

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
   """
   def __init__(self, connection, password):
      """Constructor for the mongodb data access object"""
      self.client = pymongo.MongoClient(connection.replace("<password>", password))

      # use self.db to reference the database
      self.db = self.client.graphs


   def save_graph(self, graphname, graph):
      """
      Saves the newest version of a graph under its corresponding collection
      If there are 10 versions already stored the oldest version is discarded
      """
      collection = self.db[graphname]
      delete = True

      if collection.estimated_document_count() >= 10:
         dates = collection.find({}, {'_id':0, 'date':1})
         stripped = [date['date'] for date in dates]
         del_result = collection.delete_one({'date': stripped[0]})
         delete = del_result.deleted_count == 1

      ins_result = collection.insert_one(json.loads(graph))
      return ins_result.acknowledged and delete


   def delete_version(self, graphname, date):
      """deletes version of specified graph corresponding to the given date"""
      collection = self.db[graphname]
      result = collection.delete_one({'date': date})
      return result.deleted_count == 1


   def delete_graph(self, graphname):
      """deletes the collection corresponding to the graph labelled by graphname from the database"""
      collection = self.db[graphname]
      return collection.drop()


   def get_latest(self, graphname):
      """returns a json object for the latest version of the specified graph"""
      collection = self.db[graphname]
      dates = collection.find({}, {'_id':0, 'date':1})
      stripped = [date['date'] for date in dates]
      document = collection.find_one({'date': stripped[-1]}, {'_id':0})
      return json.dumps(document)


   def get_version(self, graphname, date):
      """returns a json object for the given version of the specified graph"""
      collection = self.db[graphname]
      document = collection.find_one({'date': date}, {'_id':0})
      return json.dumps(document)


   def get_all_versions(self, graphname):
      """returns all stored versions of the specified graph, in a list dates for those objects"""
      collection = self.db[graphname]
      dates = collection.find({}, {'_id':0, 'date':1})
      return [date['date'] for date in dates]
