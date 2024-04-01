from datetime import datetime, timezone
from src import bcrypt, db
from src.models import User
from src.utils import _response, jwt_generate, to_dict

from flask import request


def make_data_to_respone(user):
    data = to_dict(user)
    del data["password"]
    return data


def update_email(email, password):
    current_user = request.user
    # Kiểm tra mật khẩu
    if not bcrypt.check_password_hash(current_user.password, password):
        return _response(400, "Sai mật khẩu")
    # Kiểm tra email mới có giống email hiện tại không
    if current_user.email == email:
        return _response(400, "Email phải khác email hiện tại")
    # Kiểm tra email mới đã được sử dụng bởi người dùng khác chưa
    if User.query.filter(User.email == email).first():
        return _response(400, "Email đã được sử dụng")
    # Cập nhật email
    current_user.email = email
    db.session.commit()
    # Tạo và trả về token mới cho người dùng
    tokens = jwt_generate(current_user)
    data = {
        "access_token": tokens["access_token"],
        "refresh_token": tokens["refresh_token"],
    }

    return _response(200, "Email được cập nhật thành công", data)


def update_password(password, new_password):
    hashed_password = bcrypt.generate_password_hash(new_password).decode("utf-8")

    current_user = request.user
    # Kiểm tra mật khẩu
    if not bcrypt.check_password_hash(current_user.password, password):
        return _response(401, "Sai mật khẩu")
    # Kiểm tra password mới có giống password hiện tại không
    if bcrypt.check_password_hash(current_user.password, new_password):
        return _response(400, "Mật khẩu phải khác mật khẩu cũ")
    # Cập nhật mật khẩu
    current_user.password = hashed_password
    db.session.commit()

    return _response(200, "Đổi mật khẩu thành công")


def edit_info(update_info, password):
    current_user = request.user
    # Kiểm tra mật khẩu
    if not bcrypt.check_password_hash(current_user.password, password):
        return _response(401, "Sai mật khẩu")
    # Kiểm tra xem username đã tồn tại chưa
    if (
        "username" in update_info
        and User.query.filter(User.username == update_info["username"]).first()
    ):
        return _response(400, "Username đã được sử dụng")

    # Cập nhật thông tin
    for key, value in update_info.items():
        setattr(current_user, key, value.strip()) if value else None

    # Đánh dấu thời gian cập nhật
    current_user.updated_at = (datetime.now(timezone.utc),)
    db.session.commit()

    data = make_data_to_respone(current_user)

    return _response(200, "Cập nhật thông tin thành công", data)
