from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from src.config import Config, EnvConfig
from src.logging import logger

app = Flask(__name__)
CORS(app, supports_credentials=True)

config = Config().getDevConfig()
env_config = EnvConfig()

app.config["SQLALCHEMY_DATABASE_URI"] = env_config.SQLALCHEMY_DATABASE_URI

db = SQLAlchemy(app)

migrate = Migrate(app, db)

app.env = config.ENV
app.secret_key = env_config.SECRET_KEY

bcrypt = Bcrypt(app)

logger.info("Application started")

from src.models import *
from src.routes import api
from src.utils import _response

app.register_blueprint(api, url_prefix="/api")


@app.errorhandler(500)
def internal_server_error(e):
    return _response(500, "Internal Server Error")


@app.errorhandler(404)
def page_not_found(e):
    return _response(404, "Page Not Found")
