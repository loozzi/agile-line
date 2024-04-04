from flask import Blueprint
from src.controllers import auth, workspace, user

api = Blueprint("api", __name__)

api.register_blueprint(auth, url_prefix="/auth")
api.register_blueprint(workspace, url_prefix="/workspace")
api.register_blueprint(user, url_prefix="/user")
