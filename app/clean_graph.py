"""
For routing usage, use function clean_and_dump.

Clean up graph to the minimal number of hallway nodes.
"""

from utility import *


def find_removable_edge(graph: Graph) -> Union[None, str]:
    """
    Return id of an edge in graph which has a hallway node at both
    source and target. Return None if no such edge exists in graph.
    """
    for edge in graph.edges:
        source = graph.get_node(edge.get_source())
        target = graph.get_node(edge.get_target())
        if source.get_type() == target.get_type() == "hallway":
            return edge.get_id()
    return None


def redirect_edges(graph: Graph, old_source_id: str, new_source_id: str, weight_change: float = 0) -> None:
    """
    Return a transformed graph such that any edge with an end
    at old_source_id has that end changed to new_source_id
    """
    for i, edge in enumerate(graph.edges):
        if graph.edges[i].get_source() == old_source_id:
            graph.edges[i].set_source(new_source_id)
            graph.edges[i].set_weight(edge.get_weight() + weight_change)
        elif graph.edges[i].get_target() == old_source_id:
            graph.edges[i].set_target(new_source_id)
            graph.edges[i].set_weight(edge.get_weight() + weight_change)


def remove_edge(graph: Graph, edge_id: str) -> None:
    """
    Remove edge with id edge_id from graph, preserving connectedness and
    total weight between any node and the target of the removed edge.
    """
    edge = graph.get_edge(edge_id)
    source = edge.get_source()
    target = edge.get_target()
    weight = edge.get_weight()
    redirect_edges(graph, source, target, weight)
    graph.nodes.remove(graph.get_node(source))
    graph.edges.remove(edge)
    # So the graph.get_node and graph.get_target functions work properly
    graph.update_internal_maps()


def clean_graph(graph: Graph) -> None:
    """
    Given graph, return a form of graph with minimal hallway nodes while still
    preserving connectivity and total edge weight between any two room nodes.
    """
    cur_edge = find_removable_edge(graph)
    while cur_edge is not None:
        remove_edge(graph, cur_edge)
        cur_edge = find_removable_edge(graph)


def clean_and_dump(json_graph: List[Dict]) -> List[Dict]:
    """
    Calls clean_graph on graph and returns a json dump of the
    newly-cleaned graph.
    """
    graph = Graph(json_graph)
    clean_graph(graph)
    return graph.json_dump()


if __name__ == '__main__':
    args = get_sys_args()
    if len(args) < 2:
        print("usage: python {} <json dump representation of graph>".format(args[0]))
        exit(1)
    try:
        json_graph = json.loads(args[1])
        try:
            graph = Graph(json_graph)
            clean_graph(graph)
            print(graph.json_dump())
        except ValueError:
            print("Error: argument must be valid graph representation")
            exit(1)
    except json.JSONDecodeError:
        print("Error: argument must be valid json dump")
        exit(1)
