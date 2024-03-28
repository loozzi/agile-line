from functools import wraps

import jwt
from flask import request
from src import env_config
from src.models import User
from src.utils import _response


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        if not token:
            return _response(
                401, "Authentication Token is missing!", None, "Unauthorized"
            )
        try:
            data = jwt.decode(token, key=env_config.SECRET_KEY, algorithms=["HS256"])
            if "is_refresh_token" in data.keys():
                return _response(
                    401, "Invalid Authentication Token!", None, "Unauthorized"
                )
            cur_user = User().query.get(data["id"])
            if cur_user is None:
                return _response(
                    401, "Invalid Authentication Token!", None, "Unauthorized"
                )
            request.user = cur_user
        except jwt.ExpiredSignatureError:
            return _response(
                401, "Authentication Token has expired", None, "Unauthorized"
            )
        except Exception as e:
            return _response(500, "Something went wrong", None, str(e))
        return f(*args, **kwargs)

    return decorated