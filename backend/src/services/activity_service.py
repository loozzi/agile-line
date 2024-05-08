from datetime import datetime, timezone

from flask import request
from src import db
from src.models import Activity, Issue, User
from src.utils import _response, to_dict


def data_user_response(user):
    user = to_dict(user)
    del user["password"]
    del user["phone_number"]
    del user["description"]
    del user["created_at"]
    del user["updated_at"]
    return user


def parse_activity(activity, user=None):
    if not user:
        user = User.query.get(activity.user_id)

    response = {
        "id": activity.id,
        "description": activity.description,
        "action": activity.action,
        "user": data_user_response(user),
        "created_at": activity.created_at,
        "updated_at": activity.updated_at,
        "is_edited": activity.is_edited,
    }
    return response


def get(issue_id):
    activities = Activity.query.filter_by(issue_id=issue_id).all()
    response = [parse_activity(activity) for activity in activities]
    return _response(200, "Lấy dữ liệu thành công", response)


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
    response = parse_activity(activity, current_user)
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

    response = parse_activity(activity, current_user)
    return _response(200, "Sửa hoạt động thành công", response)


def delete(activity_id):
    activity = Activity.query.get(activity_id)
    if not activity:
        return _response(404, "Hoạt động không tồn tại")

    current_user = request.user
    if activity.user_id != current_user.id:
        return _response(403, "Không có quyền xóa hoạt động của người khác")

    db.session.delete(activity)
    db.session.commit()
    return _response(200, "Xóa hoạt động thành công")
