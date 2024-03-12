import os

from dotenv import load_dotenv
from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from src.config import Config
from src.routes import api

load_dotenv()

app = Flask(__name__)

config = Config().getDevConfig()

app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("SQLALCHEMY_DATABASE_URI")

db = SQLAlchemy(app)

migrate = Migrate(app, db)

app.env = config.ENV

from src.models import *

app.register_blueprint(api, url_prefix="/api")
