from flask import Blueprint, json, request
from src import bcrypt, db, env_config
from src.email_service import send_otp_email
from src.models import RefreshToken, User
from src.utils import _response, jwt_generate

auth = Blueprint("auth", __name__)


@auth.route("/register", methods=["POST"])
def register():
    return _response(200, "Register successfully.")


@auth.route("/login", methods=["POST"])
def login():
    return _response(200, "Login successfully.")
