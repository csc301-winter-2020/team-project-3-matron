import pymongo
import gridfs


class MongoDAO:
    """
    The MongoDAO object, used to interface with a given MongoDB database
    Attributes
    ----------
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
    bucket : GridFSBucket
        alternate object for blueprint_fs, used for renaming
    Methods
    -------
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
    rename_graph : int
        renames a graph in the database
        returns 0 if successful, -1 if not given a String and -2 if
        given an invalid string
    get_latest : Dict, String
        returns the latest version of a graph and its blueprint 
    get_version : Dict, String
        returns a specified version of a graph and its blueprint 
    get_all_versions : [int]
        returns a list of past versions for the requested graph
    get_all_names : [String]
        returns the names of all graphs in the database
    get_blueprint : String
        returns the blueprint for a version of a graph
    delete_blueprint : None
        deletes the blueprint for a version of a graph
    """

    def __init__(self, connection, password):
        """
        Constructor for the mongodb data access object
        Parameters
        ----------
        connection : String
            the mongodb+srv:// URI used to connect to the database
            see https://docs.mongodb.com/manual/reference/connection-string/ for more details
        password : String
            the password for the mongodb database
        
        """
        self.client = pymongo.MongoClient(connection.replace("<password>", password))

        # use self.graphdb to reference the database of graphs
        self.graphdb = self.client.graphs

        # use self.blueprintdb to reference the database of blueprints
        self.blueprintdb = self.client.blueprints
        self.blueprint_fs = gridfs.GridFS(self.blueprintdb)
        self.meta_collect = self.blueprintdb.fs.files
        self.bucket = gridfs.GridFSBucket(self.blueprintdb)

    def save_graph(self, graphname, graph):
        """
        Saves the newest version of a graph, along with its blueprint
        
        Parameters
        ----------
        graphname : string
            name of the graph
        graph : Dict
            dictionary representation of the current version
        Returns
        -------
        Bool
            True if successful, False otherwise
        """
        collection = self.graphdb[graphname]
        delete_success = True

        if collection.estimated_document_count() >= 10:
            # find oldest version saved and delete it
            versions = self.get_all_versions(graphname)
            if len(versions) > 0:
                delete_success = self.delete_version(graphname, versions[0])

        ins_result = collection.insert_one(graph)

        return ins_result.acknowledged and delete_success
    
    def save_graph_and_print(self, graphname, graph, blueprint):
        """
        Saves the newest version of a graph, along with its blueprint
        
        Parameters
        ----------
        graphname : string
            name of the graph
        graph : Dict
            dictionary representation of the current version
        blueprint : String
            base64 string representation of the current version's blueprint
        Returns
        -------
        Bool
            True if successful, False otherwise
        """
        collection = self.graphdb[graphname]
        delete_success = True
        new_date = graph['date']

        if collection.estimated_document_count() >= 10:
            # find oldest version saved and delete it
            versions = self.get_all_versions(graphname)
            if len(versions) > 0:
                delete_success = self.delete_version(graphname, versions[0])

        # save new graph
        ins_result = collection.insert_one(graph)

        # save new blueprint
        image = bytes(blueprint, encoding="ascii")
        self.blueprint_fs.put(image, filename=graphname, name=new_date)

        return ins_result.acknowledged and delete_success

    def delete_version(self, graphname, date):
        """
        Deletes specified version of the graph
        Parameters
        ----------
        graphname : string
            name of the graph
        date : int
            version number of the graph
        Returns
        -------
        Bool
            True if successful, False otherwise
        """
        # delete version of graph
        collection = self.graphdb[graphname]
        result = collection.delete_one({'date': date})

        # delete associated blueprint if it exists
        self.delete_blueprint(graphname, date)

        return result.deleted_count == 1

    def delete_graph(self, graphname):
        """
        Deletes all records of the given graph from the database
        
        Parameters
        ----------
        graphname : string
            name of the graph
        Returns
        -------
        Bool
            True if successful, False otherwise
        """
        # delete all associated blueprints
        blueprints = self.meta_collect.find({"filename": graphname})
        for blueprint in blueprints:
            self.blueprint_fs.delete(blueprint['_id'])

        collection = self.graphdb[graphname]

        return collection.drop()

    def rename_graph(self, oldname, newname):
        """
        Renames a graph and all associated blueprints in the database
        Parameters
        ----------
        oldname : string
            old name of the graph
        newname : string
            new name of te graph
        Returns
        -------
        int
             0 if successful
            -1 if newname is not a string
            -2 if newname is not a valid name
        """
        # rename the graph objects in the database
        try:
            collection = self.graphdb[oldname]
            collection.rename(newname)
        except TypeError:
            return -1
        except pymongo.errors.InvalidName:
            return -2

        # rename the associated blueprints
        blueprints = self.meta_collect.find({"filename": oldname})
        for blueprint in blueprints:
            self.bucket.rename(blueprint['_id'], newname)

        return 0


    def get_latest(self, graphname):
        """Returns the latest version of the given graph
        """
        # get all versions by date
        versions = self.get_all_versions(graphname)

        if len(versions) > 0:
            return self.get_version(graphname, versions[-1])
        else:
            return None
        

    def get_version(self, graphname, date):
        """
        Returns the requested version of the given graph
        
        Parameters
        ----------
        graphname : string
            name of the graph 
        date: int
            date specifying the version whose blueprint is to be fetched
        
        Returns
        -------
        graph: dict or None
            dictonary representation of the graph, or None if not found
        blueprint: String or None
            string representation of the blueprint in base64, or None if not found
        """
        collection = self.graphdb[graphname]
        graph = collection.find_one({'date': date}, {'_id': 0})
        blueprint = self.get_blueprint(graphname, date)
        return graph, blueprint

    def get_all_versions(self, graphname):
        """
        Returns all stored versions of the specified graph, 
        
        Parameters
        ----------
        graphname : string
            name of the graph 
        
        Returns
        -------
        [int]
            list of versions for the specified graph (ints)
            sorted in ascendending order
        """
        collection = self.graphdb[graphname]
        dates = collection.find({}, {'_id': 0, 'date': 1})
        stripped = [date['date'] for date in dates]
        stripped.sort()
        return stripped

    def get_all_names(self):
        """Returns a list of the names of all graphs in the database
        
        """
        return self.graphdb.list_collection_names()

    def get_blueprint(self, graphname, date):
        """
        Fetches a given version of a blueprint from the database
        Parameters
        ----------
        graphname : string
            name of the graph 
        date: int
            date specifying the version whose blueprint is to be fetched
        
        Returns
        -------
        String or None
            string representation of the image data in base64, or None if image not found
        """
        blueprint = self.blueprint_fs.find_one({"filename": graphname, "name": date})
        if blueprint is not None:
            return blueprint.read().decode("ascii")
        else:
            return None

    def delete_blueprint(self, graphname, date):
        """
        Deletes a given version of a blueprint from the database
        Parameters
        ----------
        graphname : string
            name of the graph 
        date: int
            date specifying the version whose blueprint is to be deleted
        """
        blueprint = self.meta_collect.find_one({"filename": graphname, "name": date})
        if blueprint is not None:
            self.blueprint_fs.delete(blueprint['_id'])