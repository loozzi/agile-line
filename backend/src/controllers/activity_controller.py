from flask import Blueprint, request
from src.middlewares.login_required import token_required
from src.services import activity_service
from src.utils import _response

activity = Blueprint("activity", __name__)


@activity.route("/create", methods=["POST"])
@token_required
def create():
    issue_id = request.form.get("issue_id", "")
    description = request.form.get("description", "")

    if not issue_id:
        return _response(400, "Vui lòng chọn issue")

    return activity_service.create(issue_id, description, "comment")


@activity.route("/edit", methods=["PUT"])
@token_required
def edit():
    activity_id = request.form.get("activity_id", "")
    description = request.form.get("description", "")

    if not activity_id:
        return _response(400, "Vui lòng chọn activity")

    return activity_service.edit(activity_id, description)
