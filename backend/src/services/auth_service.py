from datetime import datetime, timezone, timedelta

from sqlalchemy import or_
from src import bcrypt, db
from src.models import User, OtpVerification, RefreshToken
from src.utils import _response, jwt_generate, to_dict, jwt_decode
from src.email_service import send_otp_email

from flask import request
import random


def make_data_to_respone(user_to_generate):
    tokens = jwt_generate(user_to_generate)
    user_to_generate = to_dict(user_to_generate)
    del user_to_generate["description"]
    del user_to_generate["phone_number"]
    del user_to_generate["password"]
    del user_to_generate["created_at"]
    del user_to_generate["updated_at"]
    data_respone = {
            "user": user_to_generate,
            "access_token": tokens["access_token"],
            "refresh_token": tokens["refresh_token"],
        }
    return data_respone


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
        data = make_data_to_respone(user)

        return _response(200, "Đăng nhập thành công", data)

    return _response(401, "Sai tài khoản hoặc mật khẩu")


def verify(otp):
    current_user = request.user
    otp_verify = OtpVerification.query.filter_by(
        user_id=to_dict(current_user)["id"]
    ).first()
    if otp_verify is not None:
        # make_data_respone
        data_respone = make_data_to_respone(current_user)
        #
        if otp_verify.verified:
            return _response(status=200,
                             message="Đã xác minh",
                             data=data_respone)
        if otp == otp_verify.otp_code:
            # khi nào làm xong cmp thì xóa timedelta(hours=7)
            if ((otp_verify.expiry_date + timedelta(hours=7))
                    .astimezone(timezone.utc).timestamp() >
                    datetime.now(timezone.utc).timestamp()):
                otp_verify.verified = True
                db.session.commit()
                return _response(status=200,
                                 message="OTP hợp lệ",
                                 data=data_respone)
            else:
                return _response(status=400,
                                 message="OTP đã hết hạn",
                                 error="Expired OTP")
    return _response(status=400,
                     message="OTP không chính xác",
                     error="Invalid OTP")


def send_otp():
    current_user = request.user
    send_to = current_user.email
    otp_user = OtpVerification.query.filter_by(user_id=current_user.id).first()
    if otp_user is not None:
        if otp_user.verified:
            return _response(status=200, message="Đã xác minh")
        # khi nào làm xong cmp thì xóa timedelta(hours=7)
        if ((otp_user.updated_at + timedelta(hours=7) + timedelta(seconds=60))
                .astimezone(timezone.utc).timestamp() >
                (datetime.now(timezone.utc)).timestamp()):
            return _response(status=400, message="Vui lòng chờ 60s")
        OTP_send = str(random.randint(100000, 999999))
        if send_otp_email(send_to, OTP_send):
            otp_user.updated_at = datetime.now(timezone.utc)
            otp_user.expiry_date = (
                datetime.now(timezone.utc) + timedelta(minutes=30)
            ).astimezone(timezone.utc)
            otp_user.otp_code = OTP_send
            db.session.commit()
            return _response(status=200, message="Đã gửi")
        else:
            return _response(status=400, message="Không thể gửi OTP")
    else:
        OTP_send = str(random.randint(100000, 999999))
        add_otp = OtpVerification(
            user_id=current_user.id,
            otp_code=OTP_send,
            expiry_date=(datetime.now(timezone.utc) + timedelta(minutes=30))
            .astimezone(timezone.utc),
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.session.add(add_otp)
        db.session.commit()
        if send_otp_email(send_to, OTP_send):
            return _response(status=200, message="Đã gửi")
        return _response(status=400, message="Không thể gửi OTP")


def refresh_token(refresh_token):
    token_decode = jwt_decode(refresh_token)
    if "is_refresh_token" not in token_decode.keys():
        return _response(status=400,
                         message="RefreshToken không hợp lệ",
                         error="Invalid RefreshToken")
    current_user = request.user
    user_otp_verification = OtpVerification.query.filter_by(
        user_id=current_user.id).first()
    if (user_otp_verification is not None and not
       user_otp_verification.verified):
        return _response(status=400,
                         message="Tài khoản chưa xác minh OTP",
                         error="OTP not verified")
    user_token = RefreshToken.query.filter_by(user_id=current_user.id).first()
    if user_token.token != refresh_token:
        return _response(status=400,
                         message="RefreshToken không chính xác",
                         error="Invalid RefreshToken")
    data_respone = make_data_to_respone(current_user)
    return _response(status=200,
                     message="RefreshToken đã được tạo mới",
                     data=data_respone)
