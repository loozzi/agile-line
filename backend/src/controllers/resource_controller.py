from flask import Blueprint, request
from src.services import resource_service
from src.utils import _response
from src.middlewares import token_required

resource = Blueprint("resource", __name__)


@resource.route("/", methods=["PUT"])
@token_required
def edit_resource():
    _id = request.form.get("id", "").strip()
    link = request.form.get("link", "").strip()
    if _id == "":
        return _response(404, "Không tìm thấy resource")
    if link == "":
        return _response(400, "Vui lòng nhập link")
    return resource_service.edit_resource(_id, link)


@resource.route("/", methods=["POST"])
@token_required
def add_resources_to_issue():
    resources = request.form.get("resources", "").strip()
    if resources != "":
        try:
            resources = eval(resources)
        except Exception:
            return _response(status=400, message="Resources không hợp lệ")
    else:
        resources = []
    issue_id = request.form.get("issue_id", "")
    if issue_id == "":
        return _response(status=404, message="Không tìm thấy issue")
    return resource_service.add_resources_to_issue(resources, issue_id)


@resource.route("/", methods=["DELETE"])
@token_required
def delete_resource():
    id = request.args.get("id", "").strip()
    if id == "":
        return _response(status="400", message="Vui lòng chọn resource")
    return resource_service.delete_resource(id)
