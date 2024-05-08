from datetime import datetime, timezone

from flask import request
from src import db
from src.models import Activity, Issue
from src.services.issue_service import data_user_response
from src.utils import _response


def create(issue_id, description, action):
    issue = Issue.query.get(issue_id)
    if not issue:
        return _response(404, "Công việc không tồn tại")
    current_user = request.user
    activity = Activity(
        issue_id=issue_id,
        description=description,
        action=action,
        user_id=current_user.id,
        is_edited=False,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )

    db.session.add(activity)
    db.session.commit()
    response = {
        "id": activity.id,
        "description": activity.description,
        "action": activity.action,
        "user": data_user_response(current_user),
        "created_at": activity.created_at,
        "updated_at": activity.updated_at,
        "is_edited": activity.is_edited,
    }
    return _response(200, "Bình luận thành công", response)
