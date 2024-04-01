from flask import Blueprint, request
from src.middlewares import token_required
from src.services import user_service
from src.utils import _response

user = Blueprint("user", __name__)


@user.route("/email", methods=["PUT"])
@token_required
def update_email():
    email = request.form.get("email", "").strip()
    password = request.form.get("password", "").strip()

    if not email or not password:
        return _response(400, "Vui lòng nhập đủ thông tin")
    
    return user_service.update_email(email, password)


@user.route("/password", methods=["PUT"])
@token_required
def update_password():
    password = request.form.get("password", "").strip()
    new_password = request.form.get("new_password", "").strip()

    if not password or not password:
        return _response(400, "Vui lòng nhập đủ thông tin")

    return user_service.update_password(password, new_password)


@user.route('/', methods=["PUT"])
@token_required
def edit_info():
    username = request.form.get("username", "").strip()
    phone_number = request.form.get("phone_number", "").strip()
    first_name = request.form.get("first_name", "").strip()
    last_name = request.form.get("last_name", "").strip()
    avatar = request.form.get("avatar", "").strip()
    description = request.form.get("description", "").strip()
    password = request.form.get("password", "").strip()

    # Password không được để trống
    if not password:
        return _response(400, "Vui lòng nhập đủ thông tin")

    # Tạo một dictionary để lưu thông tin cập nhật
    update_info = {}

    # Kiểm tra từng trường và thêm vào dictionary nếu không rỗng
    if username is not None and username:
        update_info['username'] = username
    if phone_number is not None and phone_number:
        update_info['phone_number'] = phone_number
    if first_name is not None and first_name:
        update_info['first_name'] = first_name
    if last_name is not None and last_name:
        update_info['last_name'] = last_name
    if avatar is not None and avatar:
        update_info['avatar'] = avatar
    if description is not None and description:
        update_info['description'] = description

    return user_service.edit_info(update_info, password)


@user.route('/', methods=["GET"])
@token_required
def get_info():
    return user_service.make_data_to_respone(request.user)
