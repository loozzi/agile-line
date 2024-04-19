from flask import Blueprint
from src.controllers import auth, workspace, user, label, issue
from src.controllers import auth, fileRoute, user, workspace

api = Blueprint("api", __name__)

api.register_blueprint(auth, url_prefix="/auth")
api.register_blueprint(workspace, url_prefix="/workspace")
api.register_blueprint(user, url_prefix="/user")
api.register_blueprint(label, url_prefix="/label")
api.register_blueprint(issue, url_prefix="/issue")
api.register_blueprint(fileRoute, url_prefix="/file")
