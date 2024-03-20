from flask import Blueprint, request
from src.models import User
from src.services import auth_service
from src.utils import _response

auth = Blueprint("auth", __name__)


@auth.route("/register", methods=["POST"])
def register():
    email = request.form.get("email").strip()
    username = request.form.get("username").strip()
    password = request.form.get("password").strip()

    if not email or not username or not password:
        return _response(400, "Vui lòng nhập đủ thông tin")

    if User.query.filter_by(email=email).first():
        return _response(400, "Email đã được sử dụng")

    if User.query.filter_by(username=username).first():
        return _response(400, "Username đã được sử dụng")

    return auth_service.register(email, username, password)


@auth.route("/login", methods=["POST"])
def login():
    return _response(200, "Login successfully.")
