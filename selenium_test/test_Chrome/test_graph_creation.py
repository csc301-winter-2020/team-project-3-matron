import unittest, os
from time import sleep
from selenium import webdriver
from testutils import EasyDriver
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys


def initial_set_up_map(driver, map_name):
    driver.get("https://floating-shore-56001.herokuapp.com/")
    driver.maximize_window()
    
    floor_search = driver.find_element_by_id("floor_search")
    map_input = floor_search.find_element_by_class_name("search")
    map_input.send_keys(map_name)
    
    sleep(1)
    map_input.send_keys(Keys.ENTER)
    sleep(1)
    
    driver.find_element_by_id('create_floor').click()
    
    
def remove_saved_map(driver, map_name):
    driver.find_element_by_id("save_icon").click()
    driver.find_element_by_id("matron").click()
    
    # wait until page loads up.
    sleep(1)
    
    floor_search = driver.find_element_by_id("floor_search")
    floor_search.find_element_by_class_name("dropdown").click()
    
    # wait until page loads up.
    sleep(1)
    
    map_list = floor_search.find_element_by_class_name("menu")
    path = "./div[@data-value={}]".format("\'" + map_name + "\'")
    to_delete = map_list.find_element_by_xpath(path)
    to_delete.find_element_by_id("delete_map").click()


def create_node(driver, x, y, name, node_type):
    # matron button on the top left corner 
    matron_button = driver.find_element_by_id("matron") 

    ActionChains(driver).move_to_element_with_offset(matron_button, x, y).click().perform()
    
    sleep(1)
    driver.find_element_by_id("node_label_input").send_keys(name)
    type_select = driver.find_element_by_id("type_select")
    type_input = type_select.find_element_by_class_name("search")
    type_input.send_keys(node_type)
    type_input.send_keys(Keys.ENTER)

    #wait until UI updates
    sleep(1)
    driver.find_element_by_id("set_type").click()
    sleep(1)


class seleniumtest(EasyDriver):
    def test_create_node(self):
        # set up for the test case
        initial_set_up_map(self.driver, "test_selenium")
        
        # matron button on the top left of the webpage
        matron_button = self.driver.find_element_by_id("matron")

        create_node(self.driver, 150, 500, "r1", "room")
        
        # remove map used for test case
        remove_saved_map(self.driver, "test_selenium")

        self.driver.close()
        
        
    def test_create_traingle(self):
        # set up for the test case
        initial_set_up_map(self.driver, "test_selenium")
        
        # matron button on the top left of the webpage
        matron_button = self.driver.find_element_by_id("matron")
        
        # creating triagle using hallway only
        create_triangle = ActionChains(self.driver)
        create_triangle.move_to_element_with_offset(matron_button, 150, 500).context_click()\
        .move_to_element_with_offset(matron_button, 350, 500).context_click()\
        .move_to_element_with_offset(matron_button, 250, 250).context_click()\
        .move_to_element_with_offset(matron_button, 150, 500).context_click()
        
        create_triangle.perform()
        sleep(1)
        
        
        # remove map used for test case
        remove_saved_map(self.driver, "test_selenium")
        
        self.driver.close()
        
        
    def test_navigate_outside_screen(self):
        # set up for the test case
        initial_set_up_map(self.driver, "test_selenium")

        # matron button on the top left of the webpage
        matron_button = self.driver.find_element_by_id("matron") 
        
        # action chain for creating a node 
        action_create_a_node = ActionChains(self.driver)
        action_create_a_node.move_to_element_with_offset(matron_button, 10, 70).click()
        
        # action chain for dragging to right
        action_move_view_to_right = ActionChains(self.driver)
        action_move_view_to_right\
                .move_to_element_with_offset(matron_button, 200, 200)\
                .click_and_hold()\
                .move_by_offset(60, 0)\
                .move_by_offset(60, 0)\
                .release()
        
        # action chain for dragging to left
        action_move_view_to_left = ActionChains(self.driver) 
        action_move_view_to_left\
                .move_to_element_with_offset(matron_button, 200, 200)\
                .click_and_hold()\
                .move_by_offset(-60, 0)\
                .move_by_offset(-60, 0)\
                .release()
        
        # action chain for creating edges between two nodes
        create_edge = ActionChains(self.driver)
        create_edge\
                .move_to_element_with_offset(matron_button, 10, 70)\
                .context_click()\
                .move_to_element_with_offset(matron_button, 130, 70)\
                .context_click()
        
        # perform the action chains and label nodes
        create_node(self.driver, 10, 70, "r1", "room")
        action_move_view_to_left.perform()
        create_node(self.driver, 10, 70, "r2", "room")
        action_move_view_to_right.perform()
        create_edge.perform()
        sleep(1)
        
        # remove map used for test case
        remove_saved_map(self.driver, "test_selenium")
        
        self.driver.close()
        

    def test_saving_delete(self):
        # set up for the test case
        initial_set_up_map(self.driver, "test_selenium")
        
        # matron button on the top left of the webpage
        matron_button = self.driver.find_element_by_id("matron") 
        
        # create a node to be saved.
        create_node(self.driver, 150, 500, "r1", "room")
        
        # save and refresh
        self.driver.find_element_by_id("save_icon").click()
        matron_button.click()
        sleep(1)
        
        # Open the saved map
        input_element = self.driver.find_element_by_xpath("/html/body/div[5]/div[2]/div/input[2]")
        input_element.send_keys("test_selenium")
        input_element.send_keys(Keys.ENTER)
        sleep(1)
        
        # reload
        self.driver.find_element_by_id('edit_floor').click()
        sleep(1)  

        # remove map used for test case
        remove_saved_map(self.driver, "test_selenium")
        
        self.driver.close()


    def test_delete_keydown(self):
        # set up for the test case
        initial_set_up_map(self.driver, "test_selenium")
        
        # matron button on the top left of the webpage
        matron_button = self.driver.find_element_by_id("matron") 

        create_first_room = ActionChains(self.driver)
        create_second_room = ActionChains(self.driver)
        connect_with_two_hallway = ActionChains(self.driver)

        create_node(self.driver, 150, 500, "r1", "room")
        create_node(self.driver, 450, 500, "r2", "room")

        connect_with_two_hallway.move_to_element_with_offset(matron_button, 150, 500).context_click()\
                .move_to_element_with_offset(matron_button, 250, 500).context_click()\
                .move_to_element_with_offset(matron_button, 350, 500).context_click()\
                .move_to_element_with_offset(matron_button, 450, 500).context_click() 
        sleep(1)

        connect_with_two_hallway.perform()

        delete_edge_1 = ActionChains(self.driver)
        delete_edge_2 = ActionChains(self.driver)
        delete_edge_3 = ActionChains(self.driver)

        delete_edge_1.move_to_element_with_offset(matron_button, 200, 500).click().send_keys('x')
        delete_edge_2.move_to_element_with_offset(matron_button, 300, 500).click().send_keys('x')
        delete_edge_3.move_to_element_with_offset(matron_button, 400, 500).click().send_keys('x')

        delete_edge_1.perform()
        delete_edge_2.perform()
        delete_edge_3.perform()

        delete_all_nodes = ActionChains(self.driver)
        delete_all_nodes.move_to_element_with_offset(matron_button, 150, 500).click().send_keys('x')\
                .move_to_element_with_offset(matron_button, 250, 500).click().send_keys('x')\
                .move_to_element_with_offset(matron_button, 350, 500).click().send_keys('x')\
                .move_to_element_with_offset(matron_button, 450, 500).click().send_keys('x')
        delete_all_nodes.perform()
        sleep(1)
    
        # remove map used for test case
        remove_saved_map(self.driver, "test_selenium")
        
        self.driver.close()

        
    def test_distance(self):
        # set up for the test case
        initial_set_up_map(self.driver, "test_selenium")
        
        # matron button on the top left of the webpage
        matron_button = self.driver.find_element_by_id("matron") 
        
        # list of action chains
        make_r1 = ActionChains(self.driver)
        make_r2 = ActionChains(self.driver)
        path_1 = ActionChains(self.driver)
        path_2 = ActionChains(self.driver)
        path_3 = ActionChains(self.driver)
        
        make_r1.move_to_element_with_offset(matron_button, 200, 250).click()
        make_r2.move_to_element_with_offset(matron_button, 400, 250).click()
        path_1.move_to_element_with_offset(matron_button, 200,250).context_click()\
                .move_to_element_with_offset(matron_button, 400, 250).context_click()
        path_2.move_to_element_with_offset(matron_button, 200, 250).context_click()\
                .move_to_element_with_offset(matron_button, 300, 350).context_click()\
                .move_to_element_with_offset(matron_button, 400, 250).context_click()
        path_3.move_to_element_with_offset(matron_button, 200, 250).context_click()\
                .move_to_element_with_offset(matron_button, 200, 150).context_click()\
                .move_to_element_with_offset(matron_button, 400, 150).context_click()\
                .move_to_element_with_offset(matron_button, 400, 250).context_click()

        # make nodes
        create_node(self.driver, 200, 250, "r1", "room")
        create_node(self.driver, 400, 250, "r2", "room")

        path_1.perform()
        path_2.perform()
        path_3.perform()

        self.driver.find_element_by_id("save_icon").click()
        self.driver.find_element_by_id("distance_icon").click()
        self.driver.find_element_by_id("node1").send_keys("r1")
        self.driver.find_element_by_id("node2").send_keys("r2")
        self.driver.find_element_by_id("distance_btn").click()

        sleep(1)
        distance = self.driver.find_element_by_id("dist_result").text.split(':')
        
        # ensure the value here
        assert int(distance[1]) == 200

        dist_pop_up = self.driver.find_element_by_id("distance_modal")
        dist_pop_up.find_element_by_class_name("close").click()

        # remove map used for test case
        remove_saved_map(self.driver, "test_selenium")
        
        self.driver.close()

    def test_rescale_graph(self):
        # set up for the test case
        initial_set_up_map(self.driver, "test_selenium")

        # matron button on the top left of the webpage
        matron_button = self.driver.find_element_by_id("matron") 
        
        # create three nodes with equal distance
        create_node(self.driver, 200, 200, "r1", "room")
        create_node(self.driver, 300, 200, "r2", "room")
        create_node(self.driver, 400, 200, "r3", "room")
        
        # create edges
        ActionChains(self.driver)\
                .move_to_element_with_offset(matron_button, 200, 200).context_click()\
                .move_to_element_with_offset(matron_button, 300, 200).context_click()\
                .move_to_element_with_offset(matron_button, 300, 200).context_click()\
                .move_to_element_with_offset(matron_button, 400, 200).context_click()\
                .perform()
        
        # rescale the graph
        self.driver.find_element_by_id("rescale_icon").click()
        sleep(1)
        self.driver.find_element_by_id("rescale_button").click()
        self.driver.find_element_by_id("rescale_input").send_keys("1")
        self.driver.find_element_by_id("rescale_button").click()
        self.driver.find_element_by_id("rescale_button").click()
        self.driver.find_element_by_id("rescale_input").send_keys("2")
        self.driver.find_element_by_id("rescale_button").click()
        
        # compare the distance
        # first from r1 to r2
        self.driver.find_element_by_id("save_icon").click()
        self.driver.find_element_by_id("distance_icon").click()
        self.driver.find_element_by_id("node1").send_keys("r1")
        self.driver.find_element_by_id("node2").send_keys("r2")
        self.driver.find_element_by_id("distance_btn").click()
        sleep(1)
        
        r1_to_r2 = self.driver.find_element_by_id("dist_result").text.split(':')
        dist_pop_up = self.driver.find_element_by_id("distance_modal")
        dist_pop_up.find_element_by_class_name("close").click()
        
        # second from r2 to r3
        self.driver.find_element_by_id("distance_icon").click()
        self.driver.find_element_by_id("node1").clear()
        self.driver.find_element_by_id("node2").clear()
        self.driver.find_element_by_id("node1").send_keys("r2")
        self.driver.find_element_by_id("node2").send_keys("r3")
        self.driver.find_element_by_id("distance_btn").click()
        sleep(1)
        
        r2_to_r3 = self.driver.find_element_by_id("dist_result").text.split(':')
        dist_pop_up = self.driver.find_element_by_id("distance_modal")
        dist_pop_up.find_element_by_class_name("close").click()
        
        assert r2_to_r3 > r1_to_r2
        
        # remove map used for test case
        remove_saved_map(self.driver, "test_selenium")
        
        self.driver.close()
        


if __name__ == '__main__':
    unittest.main()

