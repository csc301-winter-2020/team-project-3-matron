import json
from typing import *

Graph = List[Dict[str, Any]]
IDTable = Dict[str, int]
AdjacencyMap = Dict[str, List[Tuple[str, str, float]]]


def hash_graph(graph: Graph) -> IDTable:
    """
    Set id_table so that every id in graph maps to the corresponding
    index in graph
    """
    id_table = {}
    for i, obj in enumerate(graph):
        id_table[obj["data"]["id"]] = i
    return id_table


def get_graph(json_str: str) -> Union[None, Graph]:
    """
    Return graph inputted in json form from command line args
    """
    try:
        graph = json.loads(json_str)
    except json.JSONDecodeError:
        print("Error: get_graph failed, invalid json argument.")
        return None
    return graph


def get_adjacency_map(graph: Graph) -> AdjacencyMap:
    """
    Given graph, return an adjacency map in the form of a dictionary.
    Key: id of a node in graph
    Value: A list of tuples (v, w) such that w is the weight of the edge
    to the node with id v
    """
    adj_table = {}
    id_table = hash_graph(graph)
    for obj in graph:
        if obj["group"] == "edges":
            source_id, target_id = obj["data"]["source"], obj["data"]["target"]
            if source_id not in adj_table:
                adj_table[source_id] = []
            if target_id not in adj_table:
                adj_table[target_id] = []
            adj_table[source_id].append((target_id, obj["data"]["id"], obj["data"]["weight"]))
            adj_table[target_id].append((source_id, obj["data"]["id"],  obj["data"]["weight"]))
    return adj_table


def get_edge_weight(id_a: str, id_b: str, adj_map: AdjacencyMap) -> float:
    """
    Find the weight between two nodes adjacent in a graph given by adj_map.
    Return -1 if no edge exists between the nodes with the given id's.
    """
    if id_a not in adj_map:
        return -1
    adj_list = adj_map[id_a]
    for cur_id, cur_edge, cur_w in adj_list:
        if cur_id == id_b:
            return cur_w
    return -1