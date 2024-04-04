from flask import Blueprint, request
from src.models import User
from src.services import auth_service
from src.utils import _response
from src.middlewares.login_required import token_required

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
    username = request.form.get("username").strip()
    password = request.form.get("password").strip()

    if not username or not password:
        return _response(400, "Vui lòng nhập đủ thông tin")

    return auth_service.login(username, password)


@auth.route("/verify", methods=["POST"])
@token_required
def verify():
    otp = request.form.get("otp").strip()
    if not otp:
        return _response(status=400, message="OTP không chính xác")
    return auth_service.verify(otp)


@auth.route("/send-otp", methods=["GET"])
@token_required
def send_otp():
    return auth_service.send_otp()


@auth.route("/refresh-token", methods=["POST"])
@token_required
def refresh_Token():
    try:
        Refresh_token = request.form.get("refresh_token")
    except:
        return _response(status=400, message="RefreshToken không tồn tại", error="RefreshToken does not exist")
    return auth_service.refresh_token(Refresh_token)
