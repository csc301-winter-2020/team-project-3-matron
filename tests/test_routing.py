import pytest
from flask import Flask 
import sys
sys.path.append('../routing')
from routing import app


def test_base_route():
    response = app.test_client().get('/')

    assert response.get_data() == b'<h1>Hello!</h1>'
    assert response.status_code == 200
    

