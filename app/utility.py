"""
Filled with useful definitons. Not to be directly used in routing, but feel free
to read for reference.
"""

import json
import sys
import heapq
from typing import *

# Key: room id
# Value: List of tuples (d, id) where id is the id of a room, and d is the distance to it
AdjacencyMap = Dict[str, List[Tuple[float, str]]]

# (d, vs) where d is the length of a path and vs is a list of room ids
Path = Tuple[float, List[str]]

# Key: room type
# Value: ascending-order tuples (d, id) similar to Adjacency map
RoomDistanceMap = Dict[str, List[Tuple[float, str]]]


def get_sys_args() -> List[str]:
    """
    Return command line arguments.
    """
    return sys.argv


class GraphObject:
    """
    General object within a graph (not to be used directly)
    """

    def __init__(self, json_obj: Dict):
        self.json_data = json_obj

    def __str__(self):
        return self.json_data.__str__()

    def get_attribute(self, attr: str):
        return self.json_data["data"][attr]

    def set_attribute(self, attr: str, new_val: Any):
        self.json_data["data"][attr] = new_val

    def get_id(self):
        return self.get_attribute("id")

    def get_label(self):
        return self.get_attribute("label")

    def get_group(self):
        return self.json_data["group"]


class Node(GraphObject):
    """
    A node to be found within a graph. Either represents a connective hallway
    node or some type of room.
    """

    def __init__(self, json_obj: Dict):
        if json_obj["group"] != "nodes":
            raise ValueError
        GraphObject.__init__(self, json_obj)

    def get_type(self):
        return self.get_attribute("type")

    def get_pos(self):
        return self.json_data["position"]["x"], self.json_data["position"]["y"]


class Edge(GraphObject):
    """
    An edge to connect two Node objects. Represents a stretch of hallway with a
    defined length (weight).
    """

    def __init__(self, json_obj: Dict):
        if json_obj["group"] != "edges":
            raise ValueError
        GraphObject.__init__(self, json_obj)

    def get_source(self):
        return self.get_attribute("source")

    def get_target(self):
        return self.get_attribute("target")

    def get_weight(self):
        return self.get_attribute("weight")

    def set_target(self, new_target: str):
        self.set_attribute("target", new_target)

    def set_source(self, new_source: str):
        self.set_attribute("source", new_source)

    def set_weight(self, new_weight: float):
        self.set_attribute("weight", new_weight)


class Graph:
    """
    A graph to represent a floor plan. Contains nodes and edges.
    """

    edges: List[Edge]
    nodes: List[Node]

    def __init__(self, json_data: Dict[List[Dict]]):

        self.nodes = [Node(json_obj) for json_obj in json_data["nodes"]]
        self.edges = [Edge(json_obj) for json_obj in json_data["edges"]]
        self._set_edge_weights()  # Since the edge objects dont natively have weights
        self._node_id_map = {}
        self._edge_id_map = {}
        self.update_internal_maps()

    def __str__(self) -> str:
        strs = []
        for node in self.nodes:
            strs.append(str(node))
        for edge in self.edges:
            strs.append(str(edge))
        return ', '.join(strs)

    def __eq__(self, other):
        if type(other) != type(self):
            return False
        return str(other) == str(self)

    def _set_edge_weights(self):
        """
        Assigns a weight to each edge in self.edges equal to the distance
        between their endpoints.
        """
        # Mapping node id's to their positions, so we don't have to search later
        id_to_pos_map = {}
        for node in self.nodes:
            id_to_pos_map[node.get_id()] = node.get_pos()
        for i, edge in enumerate(self.edges):
            xs, ys = id_to_pos_map[edge.get_source()]
            xt, yt = id_to_pos_map[edge.get_target()]
            dist = (((xs - xt) ** 2) + ((ys - yt) ** 2)) ** 0.5
            self.edges[i].set_attribute("weight", dist)

    def get_node(self, id: str) -> Node:
        return self.nodes[self._node_id_map[id]]

    def get_edge(self, id: str) -> Edge:
        return self.edges[self._edge_id_map[id]]

    def update_internal_maps(self) -> None:
        """
        Must be used anytime the nodes or edges lists are edited to ensure the
        get_node and get_edge functions work correctly.
        """
        node_index, edge_index = 0, 0
        self._node_id_map = {}
        self._edge_id_map = {}
        for i, node in enumerate(self.nodes):
            self._node_id_map[node.get_id()] = i
        for i, edge in enumerate(self.edges):
            self._edge_id_map[edge.get_id()] = i

    def json_dump(self) -> List[Dict]:
        """
        Return a json dump of this object.
        """
        objs = {"nodes": [node.json_data for node in self.nodes],
                "edges": [edge.json_data for edge in self.edges]}
        return json.dumps(objs)

    def compute_adjacency_map(self) -> AdjacencyMap:
        """
        Calculate and return an adjacency map. See the top of the file for the
        format of the map.
        """
        map = {}
        for edge in self.edges:
            source = edge.get_source()
            target = edge.get_target()
            if source not in map:
                map[source] = []
            map[source].append((edge.get_weight(), target))
            if target not in map:
                map[target] = []
            map[target].append((edge.get_weight(), source))
        return map
