import unittest
from selenium import webdriver
import time
from selenium.webdriver.common.action_chains import ActionChains




class seleniumtest(unittest.TestCase):

    # def test_Heroku(self):
        # self.driver = webdriver.Chrome(executable_path="./drivers/chromedriver") 
        # self.driver.maximize_window()
        # self.driver.get("https://floating-shore-56001.herokuapp.com/")
        # time.sleep(1)
        # print("Title of the page is :" + self.driver.title)
        # self.driver.close()

    # def test_Bing(self):
        # self.driver = webdriver.Chrome(executable_path="./drivers/chromedriver")
        # self.driver.get("https://floating-shore-56001.herokuapp.com/")

        # titleOfWebPage = self.driver.title
        # self.assertTrue(titleOfWebPage == "Matron Maps")
        # self.driver.close()

    # def test_get_element(self):
        # self.driver = webdriver.Chrome(executable_path="./drivers/chromedriver")
        # self.driver.get("https://floating-shore-56001.herokuapp.com/")
        # button = self.driver.find_element_by_id('edit_floor')
        # button.click()
        # time.sleep(3)
        # self.driver.close()


    def test_input_and_click(self):
        self.driver = webdriver.Chrome(executable_path="./drivers/chromedriver")
        
        self.driver.get("https://floating-shore-56001.herokuapp.com/")
        inputElement = self.driver.find_element_by_xpath("/html/body/div[4]/div[2]/div/input[2]")
        inputElement.send_keys("tests")
        # button = self.driver.find_element_by_xpath("/html/body/div[4]/div[2]/div/i")
        # button.click()
        time.sleep(10)


        # button = self.driver.find_element_by_id('edit_floor')
        # button.click()
        # time.sleep(3)
        self.driver.close()

    def test_left_mouse_click(self):

        self.driver = webdriver.Chrome(executable_path="./drivers/chromedriver")
        self.driver.get("https://floating-shore-56001.herokuapp.com/")
        button = self.driver.find_element_by_id('edit_floor')
        button.click()
        time.sleep(4)
        action = webdriver.common.action_chains.ActionChains(self.driver)
        action.move_to_element_with_offset(button, 10, 10).click().perform()
        time.sleep(4)




if __name__ == '__main__':
    unittest.main()

