import json
import sys
from typing import *


class GraphObject:

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

    def __init__(self, json_obj: Dict):
        if json_obj["group"] != "nodes":
            raise ValueError
        GraphObject.__init__(self, json_obj)

    def get_type(self):
        return self.get_attribute("type")


class Edge(GraphObject):

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

    edges: List[Edge]
    nodes: List[Node]

    def __init__(self, json_data: List[Dict]):
        self.nodes = []
        self.edges = []
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

    def get_node(self, id: str) -> Node:
        return self.nodes[self._node_id_map[id]]

    def get_edge(self, id: str) -> Edge:
        return self.edges[self._edge_id_map[id]]

    def update_internal_maps(self) -> None:
        node_index, edge_index = 0, 0
        self._node_id_map = {}
        self._edge_id_map = {}
        for i, node in enumerate(self.nodes):
            self._node_id_map[node.get_id()] = i
        for i, edge in enumerate(self.edges):
            self._edge_id_map[edge.get_id()] = i

    def json_dump(self):
        objs = []
        for node in self.nodes:
            objs.append(node.json_data)
        for edge in self.edges:
            objs.append(edge.json_data)
        return json.dumps(objs)


def get_sys_args() -> List[str]:
    """
    Return command line arguments.
    """
    return sys.argv