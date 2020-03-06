import side, routing
from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    return '<h1>MAINHOE!!</h1>'

@app.route('/route')
def route():
    return '<h1>routing!</h1>'

if __name__ == '__main__':
    print("We've gone too far Valkyrie")