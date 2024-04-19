from flask import Blueprint, request
from src.services import issue_service
from src.utils import _response
from src.middlewares import token_required

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
    return issue_service.create_issue(project_id, name, description, status,
                                      label, priority, assignee_id,
                                      assignor_id,
                                      testor, milestone_id, list_resource)
