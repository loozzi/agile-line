from flask import Blueprint
from src.controllers import auth
from src.controllers import user

api = Blueprint("api", __name__)

api.register_blueprint(auth, url_prefix="/auth")
api.register_blueprint(user, url_prefix="/user")
