from datetime import datetime, timedelta, timezone
from math import ceil

import jwt
from sqlalchemy.dialects.mysql import insert
from src import db, env_config
from src.models import RefreshToken
import uuid


def gen_permalink():
    return str(uuid.uuid4())


def _response(status, message, data=None, error=None):
    return {"status": status, "message": message, "data": data, "error": error}


def _pagination(current_page, total_item, items, limit):
    return {
        "items": items,
        "pagination": {
            "current_page": current_page,
            "count": len(items),
            "total_item": total_item,
            "total_page": ceil(total_item / limit),
        },
    }


def to_dict(obj):
    return {c.key: getattr(obj, c.key) for c in obj.__table__.columns}


def jwt_generate(user):
    data = to_dict(user)
    del data["password"]
    del data["created_at"]
    del data["updated_at"]
    data["iat"] = int(datetime.now(timezone.utc).timestamp())
    data["exp"] = int((datetime.now(timezone.utc) + timedelta(days=1)).timestamp())
    access_token = jwt.encode(
        data,
        key=env_config.SECRET_KEY,
        algorithm="HS256",
    )

    data["exp"] = int((datetime.now(timezone.utc) + timedelta(days=7)).timestamp())
    data["is_refresh_token"] = True
    refresh_token = access_token = jwt.encode(
        data,
        key=env_config.SECRET_KEY,
        algorithm="HS256",
    )

    db.session.execute(
        insert(RefreshToken)
        .values(
            user_id=user.id,
            token=refresh_token,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
            expiry_time=datetime.now(timezone.utc) + timedelta(days=7),
        )
        .on_duplicate_key_update(
            [
                ("token", refresh_token),
                (
                    "expiry_time",
                    datetime.now(timezone.utc) + timedelta(days=7),
                ),
                ("updated_at", datetime.now(timezone.utc)),
            ]
        )
    )
    db.session.commit()
    return {"access_token": access_token, "refresh_token": refresh_token}
