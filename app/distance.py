"""
For routing, use distance, find_dist_from_start, and find_all_room_distances. See documentation for details.

Find the distance between any two nodes in a given graph, with a list of node id pairs.
"""

from utility import *
import json


def dijkstra(graph: Graph, s_id: str, e_id: str, adjacency_map: AdjacencyMap = None) -> Path:
    """
    Return a 2-tuple, where the first element is the weight along
    the shortest path from start to end, as given by s_id and e_id,
    respectively. The second element is the list of id's of the
    nodes along this shortest path. Return (-1, []) if no path
    exists between start and end.

    Can raise a KeyError if edges refer to node id's that don't exist in graph.
    """
    if adjacency_map is None:
        adjacency_map = graph.compute_adjacency_map()
    open_paths = [(0, [s_id])]

    def get_succs(path: Path) -> List[Path]:
        """
        Return a list of all possible next-step Paths given path
        """
        succs = []
        cur_weight = path[0]
        path_nodes = path[1]
        adj_nodes = adjacency_map[path_nodes[-1]]
        for weight, node in adj_nodes:
            # Path checking
            if node in path_nodes:
                continue
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


def find_dist_from_start(graph: Graph, start_id: str) -> Union[None, RoomDistanceMap]:
    """
    Given graph and the id of a start node, return a json object containing distances
    from the start to all non-hallway nodes in graph. Format of output:
    Key:
        Room type (for example, "supply room")
    Value:
        A list of tuples (d, id) where id is the id of a room with the specified room type,
        and d is the distance (sum of edge weights) between it and the start room.
    """
    room_distances = {}
    for node in graph.nodes:
        if node.get_type() not in room_distances:
            room_distances[node.get_type()] = []
        shortest_path = dijkstra(graph, start_id, node.get_id())
        if shortest_path[0] == -1:
            # No path, graph isn't connected! That's bad
            raise ValueError(start_id, node.get_id())
        else:
            room_distances[node.get_type()] += [shortest_path]
    for type in room_distances.keys():
        room_distances[type] = sorted(room_distances[type])
    return room_distances


def find_all_room_distances(graph: Graph) -> Dict[str, RoomDistanceMap]:
    """
    Return a dictionary mapping all room id's in graph to an according RoomDistanceMap
    """
    maps = {}
    for node in graph.nodes:
        maps[node.get_id()] = find_dist_from_start(graph, node.get_id())
    return maps


def distance(json_graph: JSONGraph, room_id_a: str, room_id_b: str) -> float:
    """
    Return the distance (edge weight sum along shortest path) between rooms
    specified by their id's, and given the graph in which they exist.
    """
    g = Graph(json_graph)
    # dijkstra function returns a tuple. See documentation.
    return dijkstra(g, room_id_a, room_id_b)[0]


def find_dist_and_dump(json_graph: JSONGraph, start_id: str) -> RoomDistanceMap:
    """
    Return a json dump of all room distances from a given start room. Raises a
    ValueError if graph is not connected, where the arguments are the ids of the
    two unconnected rooms which caused the error.
    """
    return json.dumps(find_dist_from_start(Graph(json_graph), start_id))


def find_all_dist_and_dump(json_graph: JSONGraph) -> Dict[str, RoomDistanceMap]:
    """
    Return a json dump of a dict which maps all rooms to their corresponding
    RoomDistanceMaps.
    """
    return json.dumps(find_all_room_distances(Graph(json_graph)))
