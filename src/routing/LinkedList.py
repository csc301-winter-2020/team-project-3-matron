'''
    Node object to store the jsonified graphs
    graph: the jsonified graph
    date:  the date the graph was created
    next:  the next element in the linked list
    prev:  the previous element in the linked list
'''
class Node:
    def __init__(self, graph, date):
        self.graph = graph
        self.date = date
        self.next = None
        self.prev = None

'''
    A linked list used to hold graphs of a given blue print
    Only keeps track of the 10 most recent graphs created

    blueprint: the blueprint associated with floor/wing
    head:      the head of the linked list, also the most recent graph
    tail:      the tail of the linked list, also the latest graph
    size:      the amount of elements in the linked list
'''
class LinkedList:
    def __init__(self, graph, date, blueprint=None):
        self.blueprint = blueprint
        self.head = Node(graph, date)
        self.tail = self.head
        self.size = 1

    '''
        removes last element in the linked list and
        adjusts the table accordingly
    '''
    def __adjust_table(self):
        node = self.tail.prev
        node.next = None
        self.tail = node

    '''
        inserts a new element into the linked list
        graph: the graph to be inserted into the linked list
        date:  the date in which said graph was created
    '''
    def insert(self, graph, date):
        node = Node(graph, date)
        node.next = self.head
        self.head.prev = node
        self.head = node

        if self.size == 10:
            self.__adjust_table()
        else:
            self.size += 1
    
    # returns the most recent graph created
    def get_recent(self):
        return self.head.graph

    # retrieves the blue print associated with this linked list
    def get_blueprint(self):
        return self.blueprint

    '''
        Searches and returns the graph created by the specified date
        date:   the desired date to look for
        return: the graph with the specified date if found otherwise
                None
    '''
    def get_by_date(self, date):
        if self.head.date == date:
            return self.head.graph
        elif self.tail.date == date:
            return self.tail.graph

        node = self.head
        while(node.next is not None):
            node = node.next
            if node.date == date:
                return node.graph

        return None 


