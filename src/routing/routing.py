from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    return '<h1>Hello!</h1>'

if __name__ == '__main__':
    print("We've gone too far Valkyrie")
