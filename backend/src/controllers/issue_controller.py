from flask import Blueprint, request
from src.services import issue_service
from src.utils import _response
from src.middlewares import token_required, request_pagination
from src.enums import IssueStatus

issue = Blueprint("issue", __name__)


@issue.route("/", methods=["POST"])
@token_required
def create_issue():
    project_id = request.form.get("project_id", "").strip()
    if project_id == "":
        return _response(400, "Vui lòng chọn dự án")
    name = request.form.get("name", "").strip()
    if name == "":
        return _response(400, "Vui lòng nhập tên issue")
    description = request.form.get("description", "").strip()
    status = request.form.get("status", "").strip()
    if status == "":
        return _response(400, "Vui lòng chọn trạng thái issue")
    label = request.form.get("label", "").strip()
    if label == "":
        return _response(400, "Vui lòng chọn nhãn issue")
    priority = request.form.get("priority", "").strip()
    if priority == "":
        return _response(400, "Vui lòng chọn mức độ ưu tiên")
    assignee_id = request.form.get("assignee_id", "").strip()
    assignor_id = request.form.get("assignor_id", "").strip()
    testor = request.form.get("testor", "").strip()
    milestone_id = request.form.get("milestone_id", "").strip()
    list_resource = request.form.get("resources", "").strip()
    if list_resource != "":
        try:
            list_resource = eval(list_resource)
        except Exception:
            return _response(400, message="Resources không hợp lệ")
    else:
        list_resource = []
    return issue_service.create_issue(project_id, name, description, status,
                                      label, priority, assignee_id,
                                      assignor_id,
                                      testor, milestone_id, list_resource)


@issue.route("/", methods=["GET"])
@request_pagination
def get_user_issue():
    user_name_in_project = request.args.get("username",
                                            default="").strip()
    project_id = request.args.get("project_id", default="").strip()
    keyword = request.args.get("keyword", default="").strip()
    status = request.args.get("status", default="").strip()
    label = request.args.get("label", default="").strip()
    if label != "":
        try:
            label = eval(label)
        except Exception:
            return _response(400, message="Danh sách label không hợp lệ")
    else:
        label = []
    return issue_service.get_issue_user(user_name_in_project,
                                        project_id, keyword, status, label)


@issue.route("/<string:permalink>", methods=["GET"])
def get_detail_issue(permalink):
    return issue_service.get_detail_issue(permalink)


@issue.route("/", methods=["PUT"])
@token_required
def edit_issue():
    issue_id = request.form.get("id", "").strip()
    if issue_id == "":
        return _response(400, "Vui lòng chọn issue")
    name = request.form.get("name", "").strip()
    status = request.form.get("status", "").strip()
    label = request.form.get("label", "").strip()
    if label != "":
        try:
            label = eval(label)
        except Exception:
            return _response(400, message="Danh sách label không hợp lệ")
    else:
        label = []
    priority = request.form.get("priority", "").strip()
    assignee_id = request.form.get("assignee_id", "").strip()
    assignor_id = request.form.get("assignor_id", "").strip()
    testor_id = request.form.get("testor_id", "").strip()
    milestone_id = request.form.get("milestone_id", "").strip()
    return issue_service.edit_issue(issue_id, name, status, label, priority,
                                    assignee_id, assignor_id, testor_id,
                                    milestone_id)


@issue.route("/<string:permalink>", methods=["PUT"])
@token_required
def edit_status_issue(permalink):
    status = request.form.get("status", default="")
    list_status = [IssueStatus.INPROGRESS.value, IssueStatus.BACKLOG.value,
                   IssueStatus.CANCELLED.value, IssueStatus.DONE.value,
                   IssueStatus.DUPLICATE.value, IssueStatus.TODO.value]
    if status not in list_status:
        return _response(status=400, message="status không hợp lệ")
    return issue_service.edit_status_issue(status, permalink)


@issue.route("/", methods=["DELETE"])
@token_required
def delete_issue():
    id = request.args.get("id","")
    if id == "":
        return _response(status=400, message="Vui lòng chọn issue cần xóa")
    return issue_service.delete_issue(id)