import uuid
from datetime import datetime, timedelta, timezone
from math import ceil

import jwt
from flask import request
from sqlalchemy import and_, select
from sqlalchemy.dialects.mysql import insert
from src import db, env_config
from src.models import RefreshToken, WorkspaceUser


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
    data_rf = data.copy()
    del data_rf["username"]
    del data_rf["email"]
    del data_rf["phone_number"]
    del data_rf["first_name"]
    del data_rf["last_name"]
    del data_rf["avatar"]
    del data_rf["description"]

    data_rf["is_refresh_token"] = True
    refresh_token = jwt.encode(
        data_rf,
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


def jwt_decode(token):
    data_decode = jwt.decode(token, key=env_config.SECRET_KEY, algorithms=["HS256"])
    return data_decode


def make_data_to_response_page(list_data):
    limit_page = request.pagination["limit"]
    page_cur = request.pagination["page"]
    start_index = (page_cur - 1) * limit_page
    end_index = min(start_index + limit_page, len(list_data))
    current_page_item = list_data[start_index:end_index]
    data_pagination = _pagination(
        current_page=page_cur,
        total_item=len(list_data),
        items=current_page_item,
        limit=limit_page,
    )
    return data_pagination


def is_workspace_user(user, workspace):
    result = db.session.execute(
        select(WorkspaceUser).where(
            and_(
                WorkspaceUser.workspace_id == workspace.id,
                WorkspaceUser.user_id == user.id,
            )
        )
    )
    if result.fetchone():
        return True
    else:
        return False
