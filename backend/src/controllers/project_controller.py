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
    status = request.form.get("status", "").strip()
    if not status:
        return _response(400, "Vui lòng cung cấp đủ thông tin")
    if status not in ProjectStatus:
        return _response(400, "Trạng thái không hợp lệ")
    return project_service.show_project_in_workspace(
        permalink, issue_kw, leader_kw, member_kw, status
    )


@project("/<string:permalink>", methods=["GET"])
@token_required
def display_project(permalink):
    return project_service.display_project(permalink)


@project("/", methods=["POST"])
@token_required
def create_project():
    try:
        workspace_id = int(request.form.get("workspace_id"))
    except TypeError:
        return _response(400, message="Data provided is not a number")
    name = request.form.get("name", "").strip()
    description = request.form.get("description", "").strip()
    icon = request.form.get("icon", "").strip()
    status = request.form.get("status", "").strip()
    if not name or not description or not icon or not status:
        return _response(400, "Vui lòng nhập đủ thông tin")
    if status not in ProjectStatus:
        return _response(400, "Trạng thái không hợp lệ")
    try:
        start_day = int(request.form.get("start_day", ""))
        start_month = int(request.form.get("start_month", ""))
        start_year = int(request.form.get("start_year", ""))
        end_day = int(request.form.get("end_day", ""))
        end_month = int(request.form.get("end_month", ""))
        end_year = int(request.form.get("end_year", ""))
        leader_id = int(request.form.get("leader", ""))
    except TypeError:
        return _response(400, "Thông tin nhập vào không phải dạng số")
    date_format = "%-d/%-m/%Y"
    start_date = datetime.strptime(
        start_day + "/" + start_month + "/" + start_year, date_format
    )
    end_date = datetime.strptime(
        end_day + "/" + end_month + "/" + end_year, date_format
    )
    list_id_members = request.form.getlist("members_id", type=int).strip()
    try:
        members_id = eval(list_id_members)
    except Exception:
        return _response(400, message="Danh sách thành viên không hợp lệ")
    return project_service.create_project(
        workspace_id,
        name,
        description,
        icon,
        status,
        start_date,
        end_date,
        leader_id,
        members_id,
    )