from math import ceil
from src import db
import json
from datetime import datetime, timedelta, timezone

from jwt import JWT
from jwt.utils import get_int_from_datetime

import os
from dotenv import load_dotenv

from models import RefreshToken

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.mysql import insert

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

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
    load_dotenv()
    instance = JWT()

    access_token = instance.encode({
        'user': user,
        'iat': get_int_from_datetime(datetime.now(timezone.utc)),
        'exp': get_int_from_datetime(
        datetime.now(timezone.utc) + timedelta(days=1))
    }, key=os.getenv('SECRET_KEY'), alg='HS256')

    refresh_token = access_token = instance.encode({
        'user': user,
        'iat': datetime.now(timezone.utc).timestamp(),
        'exp': datetime.now(timezone.utc).timestamp() + timedelta(days=7)
    }, key=os.getenv('SECRET_KEY'), alg='HS256')

    engine = create_engine(os.getenv('SQLALCHEMY_DATABASE_URI'))
    with Session(engine) as session:
        session.execute(insert(RefreshToken).values(
            user_id = user.id,
            token = refresh_token,
            create_at = datetime.now(timezone.utc).timestamp(),
            update_at = datetime.now(timezone.utc).timestamp(),
            expiry_time = get_int_from_datetime(
                datetime.now(timezone.utc) + timedelta(days=7))
            ).on_duplicate_key_update([
                ('token', refresh_token),
                ('expiry_time', datetime.now(timezone.utc).timestamp() + timedelta(days=7))
                ('update_at'), datetime.now(timezone.utc).timestamp()    
                ]
            )
        )
        session.commit()
    output = {'accessToken': access_token , 'refreshToken': refresh_token}
    return json.dumps(output)