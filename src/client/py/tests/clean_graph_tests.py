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
singleton = Graph(basic_single)


class GraphManipulationTest(unittest.TestCase):

    def test_find_removable_edge_singleton(self):
        self.assertIsNone(find_removable_edge(singleton))

    def test_clean_graph_singleton(self):
        singleton_copy = deepcopy(singleton)
        clean_graph(singleton_copy)
        self.assertEqual(singleton, singleton_copy)


if __name__ == '__main__':
    unittest.main()
