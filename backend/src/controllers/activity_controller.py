from flask import Blueprint, request
from src.middlewares.login_required import token_required
from src.services import activity_service
from src.utils import _response

activity = Blueprint("activity", __name__)


@activity.route("", methods=["GET"])
@token_required
def get():
    issue_id = request.args.get("issue_id", "")
    if not issue_id:
        return _response(400, "Vui lòng chọn issue")

    return activity_service.get(issue_id)


@activity.route("/new", methods=["GET"])
@token_required
def get_new():
    return activity_service.get_new()


@activity.route("", methods=["POST"])
@token_required
def create():
    issue_id = request.form.get("issue_id", "")
    description = request.form.get("description", "")

    if not issue_id:
        return _response(400, "Vui lòng chọn issue")

    return activity_service.create(issue_id, description, "comment")


@activity.route("", methods=["PUT"])
@token_required
def edit():
    activity_id = request.form.get("activity_id", "")
    description = request.form.get("description", "")

    if not activity_id:
        return _response(400, "Vui lòng chọn activity")

    return activity_service.edit(activity_id, description)


@activity.route("", methods=["DELETE"])
@token_required
def delete():
    activity_id = request.args.get("activity_id", "")

    if not activity_id:
        return _response(400, "Vui lòng chọn activity")

    return activity_service.delete(activity_id)
