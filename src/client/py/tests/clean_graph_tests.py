import unittest
from src.client.py.clean_graph import *
from copy import deepcopy

# Will add more tests later

basic_single = [
    {
        "data": {
            "id": "0",
            "type": "room"
        },
        "group": "nodes"
    }
]

two_rooms_disconnected_json = [
    {
        "data": {
            "id": "0",
            "type": "room"
        },
        "group": "nodes"
    },
    {
        "data": {
            "id": "1",
            "type": "room"
        },
        "group": "nodes"
    },
]

two_rooms_one_hallway_node_json = [
    {
        "data": {
            "id": "0",
            "type": "room"
        },
        "group": "nodes"
    },
    {
        "data": {
            "id": "1",
            "type": "room"
        },
        "group": "nodes"
    },
    {
        "data": {
            "id": "2",
            "type": "hallway"
        },
        "group": "nodes"
    },
    {
        "data": {
            "id": "3",
            "source": "0",
            "target": "2",
            "weight": 1.0
        },
        "group": "edges"
    },
    {
        "data": {
            "id": "4",
            "source": "2",
            "target": "1",
            "weight": 1.0
        },
        "group": "edges"
    },
]

two_rooms_many_hallway_nodes_json = [
    {
        "data": {
            "id": "0",
            "type": "room"
        },
        "group": "nodes"
    },
    {
        "data": {
            "id": "1",
            "type": "hallway"
        },
        "group": "nodes"
    },
    {
        "data": {
            "id": "2",
            "type": "hallway"
        },
        "group": "nodes"
    },
    {
        "data": {
            "id": "3",
            "type": "hallway"
        },
        "group": "nodes"
    },
    {
        "data": {
            "id": "4",
            "type": "hallway"
        },
        "group": "nodes"
    },
    {
        "data": {
            "id": "5",
            "type": "room"
        },
        "group": "nodes"
    },
    {
        "data": {
            "id": "6",
            "source": "0",
            "target": "1",
            "weight": 1.0
        },
        "group": "edges"
    },
    {
        "data": {
            "id": "7",
            "source": "1",
            "target": "2",
            "weight": 1.0
        },
        "group": "edges"
    },
    {
        "data": {
            "id": "8",
            "source": "2",
            "target": "3",
            "weight": 1.0
        },
        "group": "edges"
    },
    {
        "data": {
            "id": "9",
            "source": "3",
            "target": "4",
            "weight": 1.0
        },
        "group": "edges"
    },
    {
        "data": {
            "id": "10",
            "source": "4",
            "target": "5",
            "weight": 1.0
        },
        "group": "edges"
    },
]


class GraphManipulationTest(unittest.TestCase):

    def test_find_removable_edge_singleton(self):
        singleton = Graph(basic_single)
        self.assertIsNone(find_removable_edge(singleton))

    def test_clean_graph_singleton(self):
        singleton_a = Graph(basic_single)
        singleton_b = Graph(basic_single)
        clean_graph(singleton_b)
        self.assertEqual(singleton_a, singleton_b)

    def test_find_removable_edge_disconnected(self):
        disconnected = Graph(two_rooms_disconnected_json)
        self.assertIsNone(find_removable_edge(disconnected))

    def test_clean_graph_disconnected(self):
        disconnected_a = Graph(two_rooms_disconnected_json)
        disconnected_b = Graph(two_rooms_disconnected_json)
        clean_graph(disconnected_b)
        self.assertEqual(disconnected_a, disconnected_b)


if __name__ == '__main__':
    unittest.main()
