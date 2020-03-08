# import unittest
# from clean_graph import *
# from tests.test_objs import *

#John's import lines 
import unittest
import sys
sys.path.insert(0, './app/')
from clean_graph import *
from test_objs import *

# Will add more tests later


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
