from datetime import datetime, timedelta, timezone
from math import ceil

from jwt import JWT
from jwt.utils import get_int_from_datetime
from sqlalchemy.dialects.mysql import insert
from src import db, env_config
from src.models import RefreshToken


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


def jwt_generate(user):
    instance = JWT()

    access_token = instance.encode(
        {
            "user": user,
            "iat": get_int_from_datetime(datetime.now(timezone.utc)),
            "exp": get_int_from_datetime(
                datetime.now(timezone.utc) + timedelta(days=1)
            ),
        },
        key=env_config.SECRET_KEY,
        alg="HS256",
    )

    refresh_token = access_token = instance.encode(
        {
            "user": user,
            "iat": datetime.now(timezone.utc).timestamp(),
            "exp": datetime.now(timezone.utc).timestamp() + timedelta(days=7),
        },
        key=env_config.SECRET_KEY,
        alg="HS256",
    )

    db.session.execute(
        insert(RefreshToken)
        .values(
            user_id=user.id,
            token=refresh_token,
            create_at=datetime.now(timezone.utc).timestamp(),
            update_at=datetime.now(timezone.utc).timestamp(),
            expiry_time=get_int_from_datetime(
                datetime.now(timezone.utc) + timedelta(days=7)
            ),
        )
        .on_duplicate_key_update(
            [
                ("token", refresh_token),
                (
                    "expiry_time",
                    datetime.now(timezone.utc).timestamp() + timedelta(days=7),
                )("update_at"),
                datetime.now(timezone.utc).timestamp(),
            ]
        )
    )
    db.session.commit()
    return {"access_token": access_token, "refresh_token": refresh_token}
