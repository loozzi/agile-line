from flask import Blueprint, request
from src.middlewares.login_required import token_required
from src.utils import _response

activity = Blueprint("activity", __name__)
