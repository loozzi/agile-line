from flask import Blueprint, request
from src.services import project_service
from src.utils import _response
from src.middlewares import token_required, request_pagination
from src.controllers import workspace
from src.enums import ProjectStatus
from datetime import datetime


project = Blueprint("project", __name__)


@workspace.route("/<string:permalink>/project", methods=["GET"])
@token_required
@request_pagination
def show_project_in_workspace(permalink):
    issue_kw = request.args.get("issue_kw", "").strip()
    leader_kw = request.args.get("leader_kw", "").strip()
    member_kw = request.args.get("member_kw", "").strip()
    status = request.args.get("status", "").strip()
    return project_service.show_project_in_workspace(
        permalink, issue_kw, leader_kw, member_kw, status
    )


@project.route("/<string:permalink>", methods=["GET"])
@token_required
def display_project(permalink):
    return project_service.display_project(permalink)


@project.route("/", methods=["POST"])
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
    if not name:
        return _response(400, "Vui lòng nhập đủ thông tin")
    if status not in [status.value for status in ProjectStatus]:
        return _response(
            400,
            "Trạng thái không hợp lệ. Vui lòng chọn một trong các trạng thái hợp lệ: backlog, cancelled, completed, inprogress, paused, planned",
        )
    try:
        start_day = int(request.form.get("start_day", ""))
        start_month = int(request.form.get("start_month", ""))
        start_year = int(request.form.get("start_year", ""))
        end_day = int(request.form.get("end_day", ""))
        end_month = int(request.form.get("end_month", ""))
        end_year = int(request.form.get("end_year", ""))
        leader_id = int(request.form.get("leader_id", ""))
    except TypeError:
        return _response(400, "Thông tin nhập vào không phải dạng số")
    date_format = "%d/%m/%Y"
    start_date = datetime.strptime(
        str(start_day) + "/" + str(start_month) + "/" + str(start_year), date_format
    )
    end_date = datetime.strptime(
        str(end_day) + "/" + str(end_month) + "/" + str(end_year), date_format
    )
    list_id_members = request.form.get("members_id").strip()
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


@project.route("/<string:permalink>/role", methods=["GET"])
@token_required
@request_pagination
def show_role_in_project(permalink):
    return project_service.show_role_in_project(permalink)


@project.route("/<string:permalink>/role", methods=["POST"])
@token_required
def create_role_in_project(permalink):
    name = request.form.get("name", "").strip()
    description = request.form.get("description", "").strip()
    if not name or not description:
        return _response(400, "Vui lòng điền đầy đủ thông tin")
    return project_service.create_role_in_project(permalink, name, description)


@project.route("/<string:permalink>/role", methods=["PUT"])
@token_required
def edit_role_in_project(permalink):
    try:
        id = int(request.form.get("id", "").strip())
    except TypeError:
        return _response(400, "id đưa vào không phải dạng int")
    name = request.form.get("name", "").strip()
    description = request.form.get("description", "").strip()
    return project_service.edit_role_in_project(permalink, id, name, description)
