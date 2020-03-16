import unittest
from selenium import webdriver
import time
from selenium.webdriver.common.action_chains import ActionChains

class seleniumtest(unittest.TestCase):
    
    def test_Heroku(self):
        self.driver = webdriver.Chrome(executable_path='./drivers/chromedriver')
        self.driver.maximize_window()
        self.driver.get("https://floating-shore-56001.herokuapp.com/")
        time.sleep(1)
        print("\nTitle of the page is: " + self.driver.title)
        self.driver.close()
        
    def test_Bing(self):
        self.driver = webdriver.Chrome(executable_path='./drivers/chromedriver')
        self.driver.get("https://floating-shore-56001.herokuapp.com/")
        
        titleOfWebPage = self.driver.title
        self.driver.close()
        
    def test_get_element(self):
        self.driver = webdriver.Chrome(executable_path="./drivers/chromedriver")
        self.driver.get("https://floating-shore-56001.herokuapp.com/")
        button = self.driver.find_element_by_id('edit_floor')
        button.click()
        time.sleep(3)
        self.driver.close()
        
if __name__ == '__main__':
    unittest.main()

