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


@project.route("/<string:permalink>/delete", methods=["PUT"])
@token_required
def delete_project(permalink):
    password = request.form.get("password", "").strip()
    if not password:
        return _response(400, "Vui lòng nhập mật khẩu")
    return project_service.delete_project(permalink)


@project.route("/<string:permalink>", methods=["PUT"])
@token_required
def edit_project(permalink):
    target = request.args.get("target", default="")
    if target == "all":
        name = request.form.get("name", "").strip()
        description = request.form.get("description", "").strip()
        icon = request.form.get("icon", "").strip()
        start_date = request.form.get("start_date", default=None)
        end_date = request.form.get("end_date", default=None)

        # Tạo một dictionary để lưu thông tin cập nhật
        update_info = {}

        # Kiểm tra từng trường và thêm vào dictionary nếu không rỗng
        if name is not None and name:
            update_info["name"] = name
        if description is not None and description:
            update_info["description"] = description
        if icon is not None and icon:
            update_info["icon"] = icon
        # Chuyển đổi start_date và end_date từ chuỗi sang datetime nếu không phải là None
        date_format = "%Y-%m-%d %H:%M:%S"  # Thay đổi theo định dạng ngày tháng
        if start_date:
            try:
                update_info["start_date"] = datetime.strptime(start_date, date_format)
            except ValueError:
                return _response(400, "Chuỗi ngày giờ không hợp lệ")

        if end_date:
            try:
                update_info["end_date"] = datetime.strptime(end_date, date_format)
            except ValueError:
                return _response(400, "Chuỗi ngày giờ không hợp lệ")

        return project_service.edit_project(update_info, permalink)
    elif target == "status":
        status = request.form.get("status", "").strip()
        if not status:
            return _response(400, "Vui lòng nhập đủ thông tin")
        if status not in [status.value for status in ProjectStatus]:
            return _response(400, "Trạng thái không hợp lệ")
        return project_service.edit_status(status, permalink)
    elif target == "leader":
        leader_id = request.form.get("leader_id")
        if not leader_id:
            return _response(400, "Vui lòng nhập đủ thông tin")
        try:
            leader_id = int(leader_id)
        except ValueError:
            return _response(400, "Id không hợp lệ")
        return project_service.edit_leader(leader_id, permalink)
    elif target == "members":
        members_id = request.form.get("members_id", default="").strip()
        if members_id != "":
            try:
                members_id = eval(members_id)
            except Exception:
                return _response(400, "Danh sách thành viên không hợp lệ")
        else:
            members_id = []
        return project_service.edit_members(members_id, permalink)
