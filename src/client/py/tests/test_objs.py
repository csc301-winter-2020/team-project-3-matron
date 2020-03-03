"""
JSON objects for use in test files
"""

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
