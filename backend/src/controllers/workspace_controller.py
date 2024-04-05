from flask import Blueprint, request
from src.services import workspace_service
from src.utils import _response
from src.middlewares import token_required, request_pagination

workspace = Blueprint("workspace", __name__)


@workspace.route("/", methods=["GET"])
@token_required
@request_pagination
def show_workspace():
    keyword = request.args.get(key="keyword", default="")
    return workspace_service.show_workspace(keyword)


@workspace.route("/", methods=["POST"])
def create_workspace():
    title = request.form.get("title", default="").strip()
    logo = request.form.get("logo", default="").strip()
    description = request.form.get("description", default="").strip()
    is_private = request.form.get("is_private", default="false").strip()
    if not logo:
        logo = ""
    if not description:
        description = ""
    if not is_private:
        is_private = False
    if not title:
        return _response(400, "Vui lòng nhập đủ thông tin")
    if is_private == "true":
        is_private = True
    else:
        is_private = False
    return workspace_service.create_workspace(title, logo, description, is_private)


@workspace.route("/<string:permalink>", methods=["GET"])
@token_required
def access_workspace(permalink):
    return workspace_service.access_workspace(permalink)


@workspace.route("/<string:permalink>", methods=["PUT"])
@token_required
def edit_workspace(permalink):
    id = int(request.form.get("id"))
    title = request.form.get("title").strip()
    logo = request.form.get("logo").strip()
    description = request.form.get("description").strip()
    new_permalink = request.form.get("permalink").strip()
    is_private = request.form.get("is_private").strip()
    workspace_service.edit_workspace(
        permalink, id, title, logo, description, new_permalink, is_private
    )
