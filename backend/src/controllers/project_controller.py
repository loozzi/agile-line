from flask import Blueprint, request
from src.services import project_service
from src.utils import _response
from src.middlewares import token_required, request_pagination
from src.controllers import workspace
from src.enums import ProjectStatus
from datetime import datetime, timezone, timedelta

project = Blueprint("project", __name__)


@workspace("/<string:permalink>/project", methods=["GET"])
@token_required
@request_pagination
def show_project_in_workspace(permalink):
    issue_kw = request.form.get("issue_kw", "").strip()
    leader_kw = request.form.get("leader_kw", "").strip()
    member_kw = request.form.get("member_kw", "").strip()
    status = request.form.get("status", ProjectStatus.INPROGRESS).strip()
    return project_service.show_project_in_workspace(
        permalink, issue_kw, leader_kw, member_kw, status
    )


@project("/<string:permalink>", methods=["GET"])
@token_required
def show_project(permalink):
    return project_service.show_project(permalink)


@project("/", methods=["POST"])
@token_required
def create_project():
    try:
        workspace_id = int(request.form.get("workspace_id", type=int))
    except Exception as e:
        return _response(400, message=str(e))
    name = request.form.get("name", "").strip()
    description = request.form.get("description", "").strip()
    icon = request.form.get("icon", "").strip()
    status = request.form.get("status", ProjectStatus.INPROGRESS).strip()
    start_date = request.form.get("start_date", datetime.date(timezone.utc()))
    end_date = request.form.get(
        "end_date", datetime.date(timezone.utc) + timedelta(days=30)
    )
    return project_service.create_project(
        workspace_id, name, description, icon, status, start_date, end_date
    )
