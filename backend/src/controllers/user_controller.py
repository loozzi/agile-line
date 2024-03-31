from flask import Blueprint, request
from src.middlewares import token_required
from src.services import user_service


user = Blueprint("user", __name__)


@user.route("/email", methods=["PUT"])
@token_required
def update_email():
    email = request.form.get("email").strip()
    password = request.form.get("password").strip()

    return user_service.update_email(email, password)


@user.route("/password", methods=["PUT"])
@token_required
def update_password():
    password = request.form.get("password").strip()
    new_password = request.form.get("new_password").strip()

    return user_service.update_password(password, new_password)


@user.route('/', methods=["PUT"])
@token_required
def edit_info():
    username = request.form.get("username").strip()
    phone_number = request.form.get("phone_number").strip()
    first_name = request.form.get("first_name").strip()
    last_name = request.form.get("last_name").strip()
    avatar = request.form.get("avatar").strip()
    description = request.form.get("description").strip()
    password = request.form.get("password").strip()

    return user_service.edit_info(
        username, phone_number, first_name, last_name, avatar, description, password
    )


@user.route('/', methods=["GET"])
@token_required
def get_info():
    return user_service.make_data_to_respone(request.user)
