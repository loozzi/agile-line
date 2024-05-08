from datetime import datetime, timezone

from flask import request
from src import db
from src.models import Activity, Issue
from src.services.issue_service import data_user_response
from src.utils import _response


def parse_activity(activity):
    current_user = request.user
    response = {
        "id": activity.id,
        "description": activity.description,
        "action": activity.action,
        "user": data_user_response(current_user),
        "created_at": activity.created_at,
        "updated_at": activity.updated_at,
        "is_edited": activity.is_edited,
    }
    return response


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
    response = parse_activity(activity)
    return _response(200, "Bình luận thành công", response)


def edit(activity_id, description):
    activity = Activity.query.get(activity_id)
    if not activity:
        return _response(404, "Hoạt động không tồn tại")

    current_user = request.user

    if activity.user_id != current_user.id:
        return _response(403, "Không có quyền sửa hoạt động của người khác")

    activity.description = description
    activity.is_edited = True
    activity.updated_at = datetime.now(timezone.utc)
    db.session.commit()

    response = parse_activity(activity)
    return _response(200, "Sửa hoạt động thành công", response)
