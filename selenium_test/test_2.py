import unittest
from selenium import webdriver
import time
from selenium.webdriver.common.action_chains import ActionChains




class seleniumtest(unittest.TestCase):
    # global driver
    # driver = webdriver.Chrome(executable_path="./drivers/chromedriver")
    # driver.get("https://floating-shore-56001.herokuapp.com/")



    def test_create_node(self):
        self.driver = webdriver.Chrome(executable_path=os.environ["CHROMEWEBDRIVER"])
        self.driver.get("https://floating-shore-56001.herokuapp.com/")
        self.driver.maximize_window()
        inputElement = self.driver.find_element_by_xpath("/html/body/div[4]/div[2]/div/input[2]")
        inputElement.send_keys("test")
        time.sleep(1)
        button_1 = self.driver.find_element_by_id('edit_floor')
        button_1.click()
        time.sleep(1)
        
        button_2 = self.driver.find_element_by_id('create_floor')
        button_2.click()
        top_left_button = self.driver.find_element_by_id("matron")

        action = ActionChains(self.driver)
        action.move_to_element_with_offset(top_left_button, 150, 500).click().perform()
        time.sleep(1)

        self.driver.close()
        
    def test_create_triangle(self):
        self.driver = webdriver.Chrome(executable_path=os.environ["CHROMEWEBDRIVER"])
        self.driver.get("https://floating-shore-56001.herokuapp.com/")
        self.driver.maximize_window()
        inputElement = self.driver.find_element_by_xpath("/html/body/div[4]/div[2]/div/input[2]")
        inputElement.send_keys("test")
        time.sleep(1)
        button_1 = self.driver.find_element_by_id('edit_floor')
        button_1.click()
        time.sleep(1)
        
        button_2 = self.driver.find_element_by_id('create_floor')
        button_2.click()
        top_left_button = self.driver.find_element_by_id("matron")
        
        action = ActionChains(self.driver)
        action.move_to_element_with_offset(top_left_button, 150, 500).context_click().perform()
        action.move_to_element_with_offset(top_left_button, 350, 500).context_click().perform()
        action.move_to_element_with_offset(top_left_button, 250, 250).context_click().perform()
        action.move_to_element_with_offset(top_left_button, 150, 500).context_click().perform()
        time.sleep(3)
        
        self.driver.close()




if __name__ == '__main__':
    unittest.main()

