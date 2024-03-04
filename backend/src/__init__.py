from dotenv import load_dotenv
from flask import Flask
from src.config import Config

load_dotenv()

app = Flask(__name__)

config = Config().getDevConfig()

app.env = config.ENV
