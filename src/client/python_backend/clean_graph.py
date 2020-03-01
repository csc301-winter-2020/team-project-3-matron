"""
Clean up graph to the minimal number of hallway nodes
"""
import json
import sys
from typing import *


def get_graph() -> [None, List(Dict)]:
    """
    Return graph inputted in json form from command line args
    """
    if len(sys.argv) != 2:
        print("Error: get_graph failed, invalid argument count.")
        return None
    try:
        json_graph = sys.argv[1]
    except json.JSONDecodeError:
        print("Error: get_graph failed, invalid json argument.")
        return None
    graph = json.loads(json_graph)
    return graph


def find_removable_edge(graph: List(Dict)) -> [None, str]:
    """
    Return id of an edge in graph which has a hallway node at both source and
    target.
    Return None if no such edge exists in graph.
    """
    for x in graph:
        # Skip non-edge objects, obviously
        if x["group"] == "edges":
            source_id, target_id = x["data"]["source"], x["data"]["target"]
            source, target = None, None
            # Finding the objects at the ends of edge x
            for y in graph:
                if y["data"]["id"] == source_id:
                    source = y
                elif y["data"]["id"] == target_id:
                    target = y
            # Some error checking on the objects at the ends of x
            if source is None or target is None:
                print("Error: edge {} refers to node {}, which does not exist"
                      .format(x["data"]["id"], source_id if source is None else target_id))
                return None
            elif source["group"] != "nodes":
                print("Error: edge {} refers to source {}, which is not a node."
                      .format(x["data"]["id"], source_id))
                return None
            elif target["group"] != "nodes":
                print("Error: edge {} refers to target {}, which is not a node."
                      .format(x["data"]["id"], target_id))
                return
            # Return the id of edge x if it connects two hallway nodes
            if source["data"]["type"] == target["data"]["type"] == "hallway":
                return x["data"]["id"]
    return None


def clean_graph(graph: List(Dict)) -> List(Dict):
    """
    Given graph, return a form of graph with minimal hallway nodes while still
    preserving connectivity and total edge weight between any two room nodes.
    """
    cur_edge = find_removable_edge(graph)
    while cur_edge is not None:
        pass
