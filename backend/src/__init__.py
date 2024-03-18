from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from src.config import Config, EnvConfig
from src.routes import api

app = Flask(__name__)

config = Config().getDevConfig()
env_config = EnvConfig()

app.config["SQLALCHEMY_DATABASE_URI"] = env_config.SQLALCHEMY_DATABASE_URI

db = SQLAlchemy(app)

migrate = Migrate(app, db)

app.env = config.ENV

from src.models import *

app.register_blueprint(api, url_prefix="/api")
