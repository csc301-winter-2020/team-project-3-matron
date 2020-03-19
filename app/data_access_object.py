import pymongo
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
    save_graph_and_print : bool
        saves latest version of a graph in the database
        also saves the blueprint image for that version using GridFS
        returns true if successful, false otherwise
    delete_version : bool
        deletes a version of a graph from the database
        returns true if successful, false otherwise
    delete_graph : bool
        deletes all records of a graph from the database
        returns true if successful, false otherwise
    get_latest : Dict, String
        returns the latest version of the specified graph and its blueprint (or None)
    get_version : Dict, String
        returns a specified version of the specified graph and its blueprint (or None)
    get_all_versions : [int]
        returns a list of past versions for the requested graph
    get_all_names : [String]
        returns a list of all graph names
    get_blueprint : String
        returns the blueprint of a graph for the specified date in base64
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
            # find oldest version saved
            dates = collection.find({}, {'_id': 0, 'date': 1})
            stripped = [date['date'] for date in dates]
            stripped.sort()
            old_date = stripped[0]
            # delete oldest version
            del_result = collection.delete_one({'date': old_date})
            delete = del_result.deleted_count == 1
            # delete oldest version's blueprint (if exists)
            old_blue = self.meta_collect.find_one({"filename": graphname, "name": old_date})
            if old_blue is not None:
                self.blueprint_fs.delete(old_blue['_id'])

        ins_result = collection.insert_one(graph)
        return ins_result.acknowledged and delete
    
    def save_graph_and_print(self, graphname, graph, blueprint):
        """
        Saves the newest version of a graph under its corresponding collection
        If there are 10 versions already stored the oldest version is discarded
        """
        collection = self.graphdb[graphname]
        delete = True
        new_date = graph['date']

        if collection.estimated_document_count() >= 10:
            # find oldest version saved
            dates = collection.find({}, {'_id': 0, 'date': 1})
            stripped = [date['date'] for date in dates]
            stripped.sort()
            old_date = stripped[0]
            # delete oldest version
            del_result = collection.delete_one({'date': old_date})
            delete = del_result.deleted_count == 1
            # delete oldest version's blueprint (if exists)
            old_blue = self.meta_collect.find_one({"filename": graphname, "name": old_date})
            if old_blue is not None:
                self.blueprint_fs.delete(old_blue['_id'])

        # save new graph
        ins_result = collection.insert_one(graph)
        # save new blueprint
        image = bytes(blueprint, encoding="ascii")
        self.blueprint_fs.put(image, filename=graphname, name=new_date)
        return ins_result.acknowledged and delete

    def delete_version(self, graphname, date):
        """deletes version of specified graph corresponding to the given date"""
        collection = self.graphdb[graphname]
        result = collection.delete_one({'date': date})
        blueprint = self.meta_collect.find_one({"filename": graphname, "name": date})
        if blueprint is not None:
            self.blueprint_fs.delete(blueprint['_id'])
        return result.deleted_count == 1

    def delete_graph(self, graphname):
        """deletes the collection corresponding to the graph labelled by graphname from the database"""
        blueprints = self.meta_collect.find({"filename": graphname})
        for blueprint in blueprints:
            self.blueprint_fs.delete(blueprint['_id'])

        collection = self.graphdb[graphname]
        return collection.drop()

    def get_latest(self, graphname):
        """returns a dictionary for the latest version of the specified graph
           returns None if there are no versions saved for that graph
        """
        collection = self.graphdb[graphname]
        dates = collection.find({}, {'_id': 0, 'date': 1})
        stripped = [date['date'] for date in dates]
        if (len(stripped) > 0):
            date = stripped[-1]
            graph = collection.find_one({'date': date}, {'_id': 0})
            blueprint = self.blueprint_fs.find_one({"filename": graphname, "name": date}).read().decode("ascii")
            return graph, blueprint
        else:
            return None
        

    def get_version(self, graphname, date):
        """returns a dictionary for the given version of the specified graph
           returns None if the specified version does not exist
        """
        collection = self.graphdb[graphname]
        graph = collection.find_one({'date': date}, {'_id': 0})
        blueprint = self.blueprint_fs.find_one({"filename": graphname, "name": date}).read().decode("ascii")
        return graph, blueprint

    def get_all_versions(self, graphname):
        """returns all stored versions of the specified graph, in a list dates for those objects"""
        collection = self.graphdb[graphname]
        dates = collection.find({}, {'_id': 0, 'date': 1})
        return [date['date'] for date in dates]

    def get_all_names(self):
        """returns a list of names of all graphs in the database"""
        return self.graphdb.list_collection_names()

    def get_blueprint(self, graphname, date):
        """returns the blueprint for the given graph"""
        return self.blueprint_fs.find_one({"filename": graphname, "name": date}).read().decode("ascii")