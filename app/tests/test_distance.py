import unittest
from json import dumps
import utility as u
from test_objs import two_rooms_many_hallway_nodes_json, three_rooms_many_hall_ways_nodes_json
from copy import deepcopy
from distance import *


def standardize_labels(json_graph: dict) -> dict:
    """
    Sets the label of each node in json_graph to be identical to its id.
    """
    for i, node in enumerate(json_graph["nodes"]):
        json_graph["nodes"][i]["data"]["label"] = json_graph["nodes"][i]["data"]["id"]
    return json_graph


class DistanceFunctionTest(unittest.TestCase):

    def test_dijkstra(self):
        test_go1 = Graph(two_rooms_many_hallway_nodes_json)
        test_go2 = Graph(three_rooms_many_hall_ways_nodes_json)

        self.assertEqual(dijkstra(test_go1, 'r1', 'r2', test_go1.compute_adjacency_map()),
                         (465.20720723947005, ['r1', 'h1', 'h2', 'h3', 'h4', 'r2']), "Obtained a wrong value")
        self.assertEqual(dijkstra(test_go2, 'A', 'C', test_go2.compute_adjacency_map()),
                         (362.02462714231825, ['A', 'B', 'C']), "Obtained wrong value")

    def test_dist_from_start(self):
        test_go1 = Graph(two_rooms_many_hallway_nodes_json)
        test_go2 = Graph(three_rooms_many_hall_ways_nodes_json)

        output_1 = {'room': [(0, ['r1']), (465.20720723947005, ['r1', 'h1', 'h2', 'h3', 'h4', 'r2'])]}
        output_2 = {'room': [(0, ['A']), (239.0083680543424, ['A', 'B']), (362.02462714231825, ['A', 'B', 'C'])]}

        self.assertEqual(find_dist_from_start(two_rooms_many_hallway_nodes_json, 'r1'), output_1, "Invalid output")
        self.assertEqual(find_dist_from_start(three_rooms_many_hall_ways_nodes_json, 'A'), output_2, "Invalid output")

    def test_find_dist_from_start(self):
        output_1 = {'r1': {'room': [(0, ['r1']), (465.20720723947005, ['r1', 'h1', 'h2', 'h3', 'h4', 'r2'])]},
                    'r2': {'room': [(0, ['r2']), (465.2072072394701, ['r2', 'h4', 'h3', 'h2', 'h1', 'r1'])]}}
        output_2 = {'A': {'room': [(0, ['A']), (239.0083680543424, ['A', 'B']), (362.02462714231825, ['A', 'B', 'C'])]},
                    'B': {'room': [(0, ['B']), (123.01625908797584, ['B', 'C']), (239.0083680543424, ['B', 'A'])]},
                    'C': {'room': [(0, ['C']), (123.01625908797584, ['C', 'B']), (362.02462714231825, ['C', 'B', 'A'])]}}

        self.assertEqual(find_all_room_distances(two_rooms_many_hallway_nodes_json), output_1, "Invalid output")
        self.assertEqual(find_all_room_distances(three_rooms_many_hall_ways_nodes_json), output_2, "Invalid output")

    def test_distance(self):
        self.assertEqual(distance(two_rooms_many_hallway_nodes_json, 'r1', 'r2'), 465.20720723947005, "Invalid output")

        self.assertEqual(distance(three_rooms_many_hall_ways_nodes_json, 'A', 'C'), 362.02462714231825,
                         "Invalid output")

    def test_find_and_dump(self):
        test_go1 = Graph(two_rooms_many_hallway_nodes_json)
        test_go2 = Graph(three_rooms_many_hall_ways_nodes_json)

        self.assertEqual(find_dist_and_dump(two_rooms_many_hallway_nodes_json, 'r1'),
                         dumps(find_dist_from_start(two_rooms_many_hallway_nodes_json, 'r1')), "Invalid output")
        self.assertEqual(find_dist_and_dump(three_rooms_many_hall_ways_nodes_json, 'A'),
                         dumps(find_dist_from_start(three_rooms_many_hall_ways_nodes_json, 'A')), "Invalid output")

    def find_all_dist_and_dump(self):
        test_go1 = Graph(two_rooms_many_hallway_nodes_json)
        test_go2 = Graph(three_rooms_many_hall_ways_nodes_json)

        self.assertEqual(find_all_dist_and_dump(two_rooms_many_hallway_nodes_json),
                         dumps(find_all_room_distances(two_rooms_many_hallway_nodes_json)))
        self.assertEqual(find_all_dist_and_dump(three_rooms_many_hall_ways_nodes_json),
                         dumps(find_all_room_distances(three_rooms_many_hall_ways_nodes_json)))


if __name__ == "__main__":
    unittest.main()
