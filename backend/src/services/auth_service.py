from datetime import datetime, timezone

from sqlalchemy import or_
from src import bcrypt, db
from src.models import User
from src.utils import _response, jwt_generate, to_dict


def register(email, username, password):
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    user_new = User(
        email=email,
        username=username,
        password=hashed_password,
        updated_at=datetime.now(timezone.utc),
    )

    db.session.add(user_new)
    db.session.commit()

    user = User.query.filter_by(email=email).first()

    tokens = jwt_generate(user)

    return _response(200, "Đăng ký thành công", tokens)


def login(username, password):
    user = User.query.filter(
        or_(User.email == username, User.username == username)
    ).first()

    if user and bcrypt.check_password_hash(user.password, password):
        tokens = jwt_generate(user)

        user = to_dict(user)
        del user["description"]
        del user["phone_number"]
        del user["password"]
        del user["created_at"]
        del user["updated_at"]

        data = {
            "user": user,
            "access_token": tokens["access_token"],
            "refresh_token": tokens["refresh_token"],
        }

        return _response(200, "Đăng nhập thành công", data)

    return _response(401, "Sai tài khoản hoặc mật khẩu")
