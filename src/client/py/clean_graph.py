"""
Clean up graph to the minimal number of hallway nodes
"""
from .graph_utility import *
from sys import argv


def find_removable_edge(graph: Graph, id_table: IDTable) -> Union[None, str]:
    """
    Return id of an edge in graph which has a hallway node at both source and
    target.
    Return None if no such edge exists in graph.
    """
    for x in graph:
        # Skip non-edge objects, obviously
        if x["group"] == "edges":
            source_id, target_id = x["data"]["source"], x["data"]["target"]
            source = None if source_id not in id_table else graph[id_table[source_id]]
            target = None if target_id not in id_table else graph[id_table[target_id]]
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


def redirect_edges(graph: Graph, old_source_id: str, new_source_id: str, weight_change: float = 0) -> Graph:
    """
    Return a transformed graph such that any edge with an end
    at old_source_id has that end changed to new_source_id
    """
    for i in range(len(graph)):
        if graph[i]["group"] == "edges":
            if graph[i]["data"]["source"] == old_source_id:
                graph[i]["data"]["source"] = new_source_id
                graph[i]["data"]["weight"] += weight_change
            elif graph[i]["data"]["target"] == old_source_id:
                graph[i]["data"]["target"] = new_source_id
                graph[i]["data"]["weight"] += weight_change
    return graph


def clean_graph(graph: Graph) -> Graph:
    """
    Given graph, return a form of graph with minimal hallway nodes while still
    preserving connectivity and total edge weight between any two room nodes.
    """
    id_table = hash_graph(graph)
    cur_edge = find_removable_edge(graph, id_table)
    while cur_edge is not None:
        edge_index = id_table[cur_edge]
        weight = graph[edge_index]["data"]["weight"]
        source = graph[edge_index]["data"]["source"]
        target = graph[edge_index]["data"]["target"]
        # For each node x such that x <-> source <-> target, make x <-> target
        redirect_edges(graph, source, target, weight)
        # Removing edge between target to source, as well as source
        if id_table[source] < id_table[cur_edge]:
            graph.pop(id_table[cur_edge])
            graph.pop(id_table[source])
        else:
            graph.pop(id_table[source])
            graph.pop(id_table[cur_edge])
        # Updating values
        id_table = hash_graph(graph)
        cur_edge = find_removable_edge(graph, id_table)
    return graph


if __name__ == '__main__':
    if len(argv) < 2:
        print("usage: python {} <json graph dump>".format(argv[0]))
        exit(1)
    graph = get_graph(argv[1])
    if graph is not None:
        clean_graph(graph)
    print(json.dumps(graph))
    exit(0)
