from datetime import datetime, timezone

from src import bcrypt, db
from src.models import User
from src.utils import _response, jwt_generate


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
