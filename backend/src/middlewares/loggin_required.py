from flask import request 
import jwt
from src.utils import _response
from functools import wraps
from src.models import User
import os
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        if not token:
            return _response(401, "Authentication Token is missing!", None, "Unauthorized")
        try:
            request.cm = token
            data = jwt.decode(token, key = os.environ.get("SECRET_KEY"), algorithms=["HS256"])
            cur_user = User().query.filter_by(id = data['user'].id).first()
            if cur_user is None:
                return _response(401, "Invalid Authentication Token!", None, "Unauthorized")
            request.user = cur_user
        except jwt.ExpiredSignatureError:
            return _response(401, "Authentication Token has expired", None, "Unauthorized")
        except Exception as e:
            return _response(500, "Something went wrong", None, str(e))
        return f( *args, **kwargs)
    return decorated