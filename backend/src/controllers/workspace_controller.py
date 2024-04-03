from flask import Blueprint, request
from src.models import Workspace
from src.services import workspace_service
from src.utils import _response
from markupsafe import escape

workspace = Blueprint("workspace", __name__)


@workspace.route("/", methods=["GET"])
def show_workspace():
    limit = {escape(request.args.get(key="limit", default=10))}
    page = request.args.get(key="page", default=1)
    keyword = request.args.get(key="keyword", default="")
    return workspace_service.show_workspace(limit, page, keyword)


@workspace.route("/", methods=["POST"])
def create_workspace():
    title = request.form.get("title").strip()
    logo = request.form.get("logo").strip()
    description = request.form.get("description").strip()
    is_private = request.form.get("is_private").strip()
    if not logo:
        logo = ""
    if not description:
        description = ""
    if not is_private:
        is_private = False
    if not title:
        return _response(400, "Vui lòng nhập đủ thông tin")

    return workspace_service.create_workspace(title, logo, description, is_private)


@workspace.route("/<string:permalink>", methods=["GET"])
def access_workspace(permalink):
    if Workspace.query.filter_by(permalink=permalink).first():
        curr_workspace = Workspace.query.filter_by(permalink=permalink)
        return workspace_service.access_workspace(curr_workspace)
    else:
        return _response(404, "Không tìm thấy dữ liệu")


@workspace.route("/<string:permalink", methods=["PUT"])
def edit_workspace(permalink):
    if Workspace.query.filter_by(permalink=permalink).first():
        curr_workspace = Workspace.query.filter_by(permalink=permalink)
        return workspace_service.edit_workspace(curr_workspace)
    else:
        return _response(404, "Không tìm thấy dữ liệu")
