"""
    Authentication Module 
"""
import bson
from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)
from passlib.apps import custom_app_context as pwd_context
from flask import jsonify, g, current_app
from flask_httpauth import HTTPBasicAuth
dao = None
BasicAuth = HTTPBasicAuth()

class Auth:
    """
        Authentication class
        provides authentication methods for http requests 
    """

    @staticmethod
    def hash_password(password):
        return pwd_context.encrypt(password)
    

    @staticmethod
    def verify_password(password, hash):
        return  pwd_context.verify(password, hash)

    @staticmethod
    def generate_auth_token(userid, expiration =  8640):
        s = Serializer(current_app.config['SECRET_KEY'], expires_in=expiration)
        return s.dumps({ 'id':  userid })

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None # valid token, but expired
        except BadSignature:
            return None  # invalid token
        id = bson.objectid.ObjectId(data.get('id', ''))
        user = dao.get_user_by_id(id)
        return user


@BasicAuth.verify_password
def verify_password(username_or_token, password):
    # first try to authenticate by token
    user = Auth.verify_auth_token(username_or_token)
    if not user:
        # try to authenticate with username/password
        user = dao.get_user(username_or_token)
        if not user or not Auth.verify_password(password, user.get("password", "")):
            return False
    g.user = user
    return True

@BasicAuth.error_handler
def unauthorized():
    response = jsonify({'status': 401, 'error': 'unauthorized',
                        'message': 'please authenticate'})
    response.status_code = 401
    return response
