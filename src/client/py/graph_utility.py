import json
import sys
import heapq
from typing import *


def get_sys_args() -> List[str]:
    """
    Return command line arguments.
    """
    return sys.argv


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

    def get_adjacency_map(self) -> Dict[str, List[Tuple[float, str]]]:
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


def dijkstra(graph: Graph, s_id: str, e_id: str) -> Tuple[float, List[str]]:
    """
    Return a 2-tuple, where the first element is the weight along
    the shortest path from start to end, as given by s_id and e_id,
    respectively. The second element is the list of id's of the
    nodes along this shortest path. Return (-1, []) if no path
    exists between start and end.
    """
    adjacency_map = graph.get_adjacency_map()
    open_paths = [(0, [s_id])]

    def get_succs(path: Tuple[float, List[str]]) -> List[Tuple[float, List[str]]]:
        succs = []
        cur_weight = path[0]
        path_nodes = path[1]
        adj_nodes = adjacency_map[path_nodes[-1]]
        for weight, node in adj_nodes:
            succ = (cur_weight + weight, path_nodes + [node])
            succs.append(succ)
        return succs

    while len(open_paths) > 0:
        cur_path = open_paths.pop(0)
        if cur_path[1][-1] == e_id:
            return cur_path
        else:
            cur_succs = get_succs(cur_path)
            for s in cur_succs:
                heapq.heappush(open_paths, s)
    return -1, []
