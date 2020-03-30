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

        self.assertEqual(dijkstra(test_go1, 'r1', 'r2', test_go1.compute_adjacency_map()), (465.20720723947005, ['r1', 'h1', 'h2', 'h3', 'h4', 'r2']), "Obtained a wrong value")
        self.assertEqual(dijkstra(test_go2,'A','C', test_go2.compute_adjacency_map()),(362.02462714231825, ['A', 'B', 'C']), "Obtained wrong value")

    def test_dist_from_start(self):
        test_go1 = Graph(two_rooms_many_hallway_nodes_json)
        test_go2 = Graph(three_rooms_many_hall_ways_nodes_json)

        output_1 = {'room': [(0, ['r1']), (465.20720723947005, ['r1', 'h1', 'h2', 'h3', 'h4', 'r2'])], 'hallway': [(159.38004893963358, ['r1', 'h1']), (236.9042387128908, ['r1', 'h1', 'h2']), (311.9642147320716, ['r1', 'h1', 'h2', 'h3']), (396.1782278177808, ['r1', 'h1', 'h2', 'h3', 'h4'])]}
        output_2 = {'room': [(0, ['A']), (239.0083680543424, ['A', 'B']), (362.02462714231825, ['A', 'B', 'C'])], 'hallway': [(137.71347065556077, ['A', 'hn1']), (153.07514494521962, ['A', 'hn2'])]}

        self.assertEqual(find_dist_from_start(two_rooms_many_hallway_nodes_json, 'r1'), output_1, "Invalid output")
        self.assertEqual(find_dist_from_start(three_rooms_many_hall_ways_nodes_json, 'A'), output_2, "Invalid output")


    def test_find_dist_from_start(self):
        test_go1 = Graph(two_rooms_many_hallway_nodes_json)
        output_1 = {'r1': {'room': [(0, ['r1']), (465.20720723947005, ['r1', 'h1', 'h2', 'h3', 'h4', 'r2'])], 'hallway': [(159.38004893963358, ['r1', 'h1']), (236.9042387128908, ['r1', 'h1', 'h2']), (311.9642147320716, ['r1', 'h1', 'h2', 'h3']), (396.1782278177808, ['r1', 'h1', 'h2', 'h3', 'h4'])]}, 'h1': {'room': [(159.38004893963358, ['h1', 'r1']), (305.8271582998365, ['h1', 'h2', 'h3', 'h4', 'r2'])], 'hallway': [(0, ['h1']), (77.52418977325722, ['h1', 'h2']), (152.58416579243806, ['h1', 'h2', 'h3']), (236.79817887814727, ['h1', 'h2', 'h3', 'h4'])]}, 'r2': {'room': [(0, ['r2']), (465.2072072394701, ['r2', 'h4', 'h3', 'h2', 'h1', 'r1'])], 'hallway': [(69.02897942168927, ['r2', 'h4']), (153.24299250739847, ['r2', 'h4', 'h3']), (228.3029685265793, ['r2', 'h4', 'h3', 'h2']), (305.8271582998365, ['r2', 'h4', 'h3', 'h2', 'h1'])]}, 'h2': {'room': [(228.30296852657926, ['h2', 'h3', 'h4', 'r2']), (236.9042387128908, ['h2', 'h1', 'r1'])], 'hallway': [(0, ['h2']), (75.05997601918082, ['h2', 'h3']), (77.52418977325722, ['h2', 'h1']), (159.27398910489, ['h2', 'h3', 'h4'])]}, 'h3': {'room': [(153.24299250739847, ['h3', 'h4', 'r2']), (311.96421473207164, ['h3', 'h2', 'h1', 'r1'])], 'hallway': [(0, ['h3']), (75.05997601918082, ['h3', 'h2']), (84.2140130857092, ['h3', 'h4']), (152.58416579243806, ['h3', 'h2', 'h1'])]}, 'h4': {'room': [(69.02897942168927, ['h4', 'r2']), (396.1782278177808, ['h4', 'h3', 'h2', 'h1', 'r1'])], 'hallway': [(0, ['h4']), (84.2140130857092, ['h4', 'h3']), (159.27398910489, ['h4', 'h3', 'h2']), (236.7981788781472, ['h4', 'h3', 'h2', 'h1'])]}}
        output_2 = {'A': {'room': [(0, ['A']), (239.0083680543424, ['A', 'B']), (362.02462714231825, ['A', 'B', 'C'])], 'hallway': [(137.71347065556077, ['A', 'hn1']), (153.07514494521962, ['A', 'hn2'])]}, 'B': {'room': [(0, ['B']), (123.01625908797584, ['B', 'C']), (239.0083680543424, ['B', 'A'])], 'hallway': [(141.315250415516, ['B', 'hn1']), (392.083512999562, ['B', 'A', 'hn2'])]}, 'C': {'room': [(0, ['C']), (123.01625908797584, ['C', 'B']), (362.02462714231825, ['C', 'B', 'A'])], 'hallway': [(264.3315095034918, ['C', 'B', 'hn1']), (515.0997720875379, ['C', 'B', 'A', 'hn2'])]}, 'hn1': {'room': [(137.71347065556077, ['hn1', 'A']), (141.315250415516, ['hn1', 'B']), (264.3315095034918, ['hn1', 'B', 'C'])], 'hallway': [(0, ['hn1']), (290.7886156007804, ['hn1', 'A', 'hn2'])]}, 'hn2': {'room': [(153.07514494521962, ['hn2', 'A']), (392.083512999562, ['hn2', 'A', 'B']), (515.0997720875379, ['hn2', 'A', 'B', 'C'])], 'hallway': [(0, ['hn2']), (290.7886156007804, ['hn2', 'A', 'hn1'])]}}

        test_go1 = Graph(two_rooms_many_hallway_nodes_json)
        test_go2 = Graph(three_rooms_many_hall_ways_nodes_json)

        self.assertEqual(find_all_room_distances(two_rooms_many_hallway_nodes_json), output_1, "Invalid output")
        self.assertEqual(find_all_room_distances(three_rooms_many_hall_ways_nodes_json), output_2, "Invalid output")

    def test_distance(self):

        self.assertEqual(distance(two_rooms_many_hallway_nodes_json, 'r1', 'r2'), 465.20720723947005, "Invalid output")

        self.assertEqual(distance(three_rooms_many_hall_ways_nodes_json, 'A', 'C'), 362.02462714231825, "Invalid output")


    def test_find_and_dump(self):
        test_go1 = Graph(two_rooms_many_hallway_nodes_json)
        test_go2 = Graph(three_rooms_many_hall_ways_nodes_json)

        self.assertEqual(find_dist_and_dump(two_rooms_many_hallway_nodes_json, 'r1'), dumps(find_dist_from_start(two_rooms_many_hallway_nodes_json, 'r1')), "Invalid output")
        self.assertEqual(find_dist_and_dump(three_rooms_many_hall_ways_nodes_json, 'A'), dumps(find_dist_from_start(three_rooms_many_hall_ways_nodes_json, 'A')), "Invalid output")


    def find_all_dist_and_dump(self):
        test_go1 = Graph(two_rooms_many_hallway_nodes_json)
        test_go2 = Graph(three_rooms_many_hall_ways_nodes_json)

        self.assertEqual(find_all_dist_and_dump(two_rooms_many_hallway_nodes_json), dumps(find_all_room_distances(two_rooms_many_hallway_nodes_json)))
        self.assertEqual(find_all_dist_and_dump(three_rooms_many_hall_ways_nodes_json), dumps(find_all_room_distances(three_rooms_many_hall_ways_nodes_json)))


if __name__ == "__main__":
    unittest.main()
