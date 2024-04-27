from flask import Blueprint, request
from src.services import label_service
from src.utils import _response
from src.middlewares import token_required

label = Blueprint("label", __name__)


@label.route("/", methods=["POST"])
@token_required
def create_label():
    title = request.form.get("title", "").strip()
    color = request.form.get("color", "").strip()
    workspace_id = request.form.get("workspace_id", "").strip()
    description = request.form.get("description", "").strip()
    if workspace_id == "":
        return _response(400, "Không tìm thấy workspace")
    if title == "":
        return _response(400, "Vui lòng nhập tên nhãn")
    if color == "":
        return _response(400, "Vui lòng chọn màu nhãn")
    return label_service.create_label(title, color, workspace_id, description)


@label.route("/", methods=["PUT"])
@token_required
def edit_label():
    id = request.form.get("id", "").strip()
    if id == "":
        return _response(400, 
                         "Vui lòng nhập nhãn cần sửa")
    title = request.form.get("title", "").strip()
    color = request.form.get("color", "").strip()
    description = request.form.get("description", "").strip()
    return label_service.edit_label(id, title,
                                    color, description)


@label.route("/", methods=["DELETE"])
@token_required
def delete_label():
    id = request.args.get("id", "")
    if id == "":
        return _response(400, "Vui lòng chọn nhãn cần xóa")
    return label_service.delete_label(id)
