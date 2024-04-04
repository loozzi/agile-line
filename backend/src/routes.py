from flask import Blueprint
from src.controllers import auth, workspace

api = Blueprint("api", __name__)

api.register_blueprint(auth, url_prefix="/auth")
api.register_blueprint(workspace, url_prefix="/workspace")
