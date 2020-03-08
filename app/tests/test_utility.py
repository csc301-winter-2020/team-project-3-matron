import unittest
import utility as u
from tests.test_objs import basic_single, two_rooms_one_hallway_node_json
from copy import deepcopy

#John's import lines 
# import utility as u
# import sys
# sys.path.insert(0, './app/')
# import utility as u
# from clean_graph import *
# from test_objs import *

class GraphObjectTest(unittest.TestCase):

    def setUp(self):
        self.go = u.GraphObject(deepcopy(basic_single[0]))

    def test_get_attribute(self):
        self.assertEqual(self.go.get_attribute("id"), "0", "Could not get id attribute")
        self.assertEqual(self.go.get_attribute("type"), "room", "Could not get type attribute")

    def test_set_attribute(self):
        self.go.set_attribute("id", 999)
        self.assertEqual(self.go.get_attribute("id"), 999, "Could not get a numerically set id")
        self.go.set_attribute("whatever", "string")
        self.assertEqual(self.go.get_attribute("whatever"), "string", "Could not get a string set arbitrary key")

    def test_get_id(self):
        self.assertEqual(self.go.get_id(), "0", "Could not get initial id")

    @unittest.skip("Awaiting example label -- none of the test objects have a label")
    def test_get_label(self):
        # !! TODO !!
        #self.go.get_label()
        pass

    def test_get_group(self):
        self.assertEqual(self.go.get_group(), "nodes", "Could not get group")

class NodeTest(unittest.TestCase):
    def test_get_type(self):
        self.go = u.Node(basic_single[0])
        self.assertEqual(self.go.get_type(), "room", "Could not get type")
    def test_value_error(self):
        with self.assertRaises(ValueError):
            self.n = u.Node(two_rooms_one_hallway_node_json[3])

class EdgeTest(unittest.TestCase):
    def setUp(self):
        self.e = u.Edge(deepcopy(two_rooms_one_hallway_node_json[3]))

    def test_value_error(self):
        with self.assertRaises(ValueError):
            _ = u.Edge(basic_single[0])

    def test_get_source(self):
        self.assertEqual(self.e.get_source(), "0", "Could not get source")

    def test_get_target(self):
        self.assertEqual(self.e.get_target(), "2", "Could not get target")

    def test_get_weight(self):
        self.assertEqual(self.e.get_weight(), 1.0, "Could not get weight")

    def test_set_target(self):
        self.e.set_target("cbt")
        self.assertEqual(self.e.get_target(), "cbt", "Could not set target")

    def test_set_source(self):
        self.e.set_source("yoda")
        self.assertEqual(self.e.get_source(), "yoda", "Could not set source")

    def test_set_weight(self):
        self.e.set_weight(4.2)
        self.assertEqual(self.e.get_weight(), 4.2, "Could not set weight")


class GraphTest(unittest.TestCase):

    def setUp(self):
        self.g = u.Graph(deepcopy(two_rooms_one_hallway_node_json))

    def test_eq_self(self):
        self.assertEqual(self.g, self.g, "Graph not equal to itself")

    def test_get_node(self):
        self.assertEqual(str(self.g.get_node("0")), str(u.Node(two_rooms_one_hallway_node_json[0])), "Graph node not equal to raw node")

    def test_get_edge(self):
        self.assertEqual(str(self.g.get_edge("3")), str(u.Edge(two_rooms_one_hallway_node_json[3])), "Graph edge not equal to raw edge")
        
    def test_json_dump(self):
        self.maxDiff = None
        self.assertCountEqual(self.g.json_dump(), two_rooms_one_hallway_node_json, "Json dump not equal to original json")

    def test_adj_map(self):
        expected_map = {"0" : [(1.0, '2')], 
                        "2" : [(1.0, '0'), (1.0, '1')], 
                        "1" : [(1.0, '2')]}
        self.assertDictEqual(self.g.compute_adjacency_map(), expected_map, "Adjacency map does not match expected map")

if __name__ == '__main__':
    unittest.main()
