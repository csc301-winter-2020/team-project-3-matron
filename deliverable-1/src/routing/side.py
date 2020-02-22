from flask import Flask

side = Flask(__name__)

@side.route('/side')
def side():
    return '<h1>SIDEHOE!</h1>'

if __name__ == '__main__':
    print("We've gone too far Valkyrie")