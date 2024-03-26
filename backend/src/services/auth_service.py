from datetime import datetime, timezone

from sqlalchemy import or_
from src import bcrypt, db
from src.models import User, OtpVerification
from src.utils import _response, jwt_generate, to_dict
from src.email_service import send_otp_email
from src.middlewares.login_required import token_required
from flask import request
import random


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


@token_required
def verify(otp):
    try:
        current_user = request.user
        otp_verify = OtpVerification.query.filter_by(
            user_id=to_dict(current_user)["id"]
        ).first()
        if otp_verify != None:
            otp_verify = to_dict(otp_verify)
            # make_data_respone
            token_respone = jwt_generate(current_user)
            access_token = token_respone["access_token"]
            refresh_token = token_respone["refresh_token"]
            user_respone = to_dict(current_user)
            del user_respone["created_at"]
            del user_respone["description"]
            del user_respone["email"]
            del user_respone["password"]
            del user_respone["phone_number"]
            del user_respone["updated_at"]
            data_respone = {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "user": user_respone,
            }
            #
            if otp_verify["verified"]:
                return _response(status=200, message="Đã xác minh", data=data_respone)
            if otp == otp_verify["otp_code"]:
                if (
                    otp_verify["expiry_date"].timestamp()
                    > datetime.now(timezone.utc).timestamp()
                ):
                    return _response(
                        status=200, message="OTP hợp lệ", data=data_respone
                    )
                return _response(
                    status=400, message="OTP đã hết hạn", error="Expired OTP"
                )
        return _response(status=400, message="OTP không chính xác", error="Invalid OTP")
    except Exception as e:
        return _response(status=500, message="Something went wrong!", error=str(e))
