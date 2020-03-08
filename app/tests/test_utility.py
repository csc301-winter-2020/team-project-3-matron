import unittest
from json import dumps
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
        self.go = u.GraphObject(deepcopy(basic_single["nodes"][0]))

    def test_get_attribute(self):
        self.assertEqual(self.go.get_attribute("id"), "r1", "Could not get id attribute")
        self.assertEqual(self.go.get_attribute("type"), "room", "Could not get type attribute")

    def test_set_attribute(self):
        self.go.set_attribute("id", 999)
        self.assertEqual(self.go.get_attribute("id"), 999, "Could not get a numerically set id")
        self.go.set_attribute("whatever", "string")
        self.assertEqual(self.go.get_attribute("whatever"), "string", "Could not get a string set arbitrary key")

    def test_get_id(self):
        self.assertEqual(self.go.get_id(), "r1", "Could not get initial id")

    def test_get_label(self):
        self.assertEqual(self.go.get_label(), "r1", "Could not get inital label")

    def test_get_group(self):
        self.assertEqual(self.go.get_group(), "nodes", "Could not get group")

class NodeTest(unittest.TestCase):
    def test_get_type(self):
        self.go = u.Node(basic_single["nodes"][0])
        self.assertEqual(self.go.get_type(), "room", "Could not get type")
    def test_value_error(self):
        with self.assertRaises(ValueError):
            self.n = u.Node(two_rooms_one_hallway_node_json["edges"][0])

class EdgeTest(unittest.TestCase):
    def setUp(self):
        self.e = u.Edge(deepcopy(two_rooms_one_hallway_node_json["edges"][0]))

    def test_value_error(self):
        with self.assertRaises(ValueError):
            _ = u.Edge(basic_single["nodes"][0])

    def test_get_source(self):
        self.assertEqual(self.e.get_source(), "r1", "Could not get source")

    def test_get_target(self):
        self.assertEqual(self.e.get_target(), "h1", "Could not get target")

    @unittest.skip("Edges have no starting weight now")
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
        self.orig_weighted = deepcopy(two_rooms_one_hallway_node_json)
        self.orig_weighted["edges"][0]["data"]["weight"] = 98.2496819333274
        self.orig_weighted["edges"][1]["data"]["weight"] = 126.43575443678897

    def test_eq_self(self):
        self.assertEqual(self.g, self.g, "Graph not equal to itself")

    def test_get_node(self):
        self.assertEqual(str(self.g.get_node("r1")), str(u.Node(two_rooms_one_hallway_node_json["nodes"][0])), "Graph node not equal to raw node")

    def test_get_edge(self):
        copyedge = u.Edge(deepcopy(two_rooms_one_hallway_node_json["edges"][0]))
        copyedge.set_weight(98.2496819333274)
        self.assertEqual(str(self.g.get_edge("e-r1-h1")), str(copyedge), "Graph edge not equal to raw edge")
        
    def test_json_dump(self):
        self.maxDiff = None
        self.assertEqual(self.g.json_dump(), dumps(self.orig_weighted), "Json dump not equal to original json")

    def test_adj_map(self):
        expected_map = {'h1': [(98.2496819333274, 'r1'), (126.43575443678897, 'r2')],
            'r1': [(98.2496819333274, 'h1')],
            'r2': [(126.43575443678897, 'h1')]
        }

        self.assertDictEqual(self.g.compute_adjacency_map(), expected_map, "Adjacency map does not match expected map")

if __name__ == '__main__':
    unittest.main()
