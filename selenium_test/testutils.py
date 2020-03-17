import unittest, os
from selenium import webdriver

class EasyDriver(unittest.TestCase):

    def setUp(self):
        br = os.getenv("SELENIUM_TEST_BROWSER")
        tar = os.getenv("HOST_SYS")
        if tar == "WIN":
            if br == "IE":
                iepath = os.path.join(os.environ["IEWebDriver"], "IEDriverServer.exe")
                self.driver = webdriver.Ie(executable_path=iepath)
            elif br == "FIREFOX":
                fpath = os.path.join(os.environ["GeckoWebDriver"], "geckodriver.exe")
                self.driver = webdriver.Firefox(executable_path=fpath)
            elif br == "CHROME":
                cpath = os.path.join(os.environ["ChromeWebDriver"], "chromedriver.exe")
                self.driver = webdriver.Chrome(executable_path=cpath)
            elif br == "EDGE":
                epath = os.path.join(os.environ["EdgeWebDriver"], "msedgedriver.exe")
                self.driver = webdriver.Edge(executable_path=epath)
            else:
                raise KeyError(f"{br} is not a recognised browser to target on windows")
        elif tar == "UBUNTU":
            if br == "FIREFOX":
                fpath = os.path.join(os.environ["GECKOWEBDRIVER"], "geckodriver")
                self.driver = webdriver.Firefox(executable_path=fpath)
            elif br == "CHROME":
                cpath = os.path.join(os.environ["CHROMEWEBDRIVER"], "chromedriver")
                self.driver = webdriver.Chrome(executable_path=cpath)
            else:
                raise KeyError(f"{br} is not a recognised browser to target on ubuntu")
        else: 
            self.driver = webdriver.Chrome("../driver/chromedriver")

