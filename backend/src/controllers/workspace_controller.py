from flask import Blueprint, request
from src.services import workspace_service
from src.utils import _response
from src.middlewares import token_required, request_pagination

workspace = Blueprint("workspace", __name__)


@workspace.route("/", methods=["GET"])
@token_required
@request_pagination
def show_workspace():
    keyword = request.args.get(key="keyword",
                               default="")
    return workspace_service.show_workspace(keyword)


@workspace.route("/", methods=["POST"])
@token_required
def create_workspace():
    title = request.form.get("title",
                             default="").strip()
    logo = request.form.get("logo",
                            default="").strip()
    description = request.form.get("description",
                                   default="").strip()
    is_private = request.form.get("is_private",
                                  default="false").strip()
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
    return workspace_service.create_workspace(title,
                                              logo,
                                              description,
                                              is_private)


@workspace.route("/<string:permalink>", methods=["GET"])
@token_required
def access_workspace(permalink):
    return workspace_service.access_workspace(permalink)


@workspace.route("/<string:permalink>", methods=["PUT"])
@token_required
def edit_workspace(permalink):
    title = request.form.get("title", "").strip()
    logo = request.form.get("logo", "").strip()
    description = request.form.get("description", "").strip()
    new_permalink = request.form.get("permalink", "").strip()
    is_private = request.form.get("is_private", "").strip()
    return workspace_service.edit_workspace(
        permalink, title, logo, description,
        new_permalink,
        is_private
    )


@workspace.route("/<string:permalink>/members", methods=["GET"])
@token_required
@request_pagination
def show_workspace_members(permalink):
    member_keyword = request.args.get(key="member_kw", default="")
    role_workspace = request.args.get(key="role", default="")
    return workspace_service.show_workspace_members(member_keyword,
                                                    role_workspace,
                                                    permalink)


@workspace.route("/<string:permalink>/members", methods=["POST"])
@token_required
@request_pagination
def add_members_to_workspace(permalink):
    list_id_members = request.form.get("user_ids", default="").strip()
    if list_id_members != "":
        try:
            list_id_members = eval(list_id_members)
        except Exception:
            return _response(400,
                            message="Danh sách thành viên không hợp lệ")
    else:
        list_id_members = []
    return workspace_service.add_members_to_workspace(permalink,
                                                      list_id_members)


@workspace.route("/<string:permalink>/members", methods=["DELETE"])
@token_required
def delete_member_from_workspace(permalink):
    user_id = request.args.get("user_id", default="")
    return workspace_service.delete_member_from_workspace(permalink,
                                                          user_id)


@workspace.route("/<string:permalink>/members", methods=["PUT"])
@token_required
@request_pagination
def edit_role_members_in_workspace(permalink):
    edit_user_id = request.form.get("user_id", default="")
    new_role = request.form.get("role", default="")
    return workspace_service.edit_role_members_in_workspace(permalink,
                                                            edit_user_id,
                                                            new_role)


@workspace.route("/<string:permalink>/labels", methods=["GET"])
@token_required
def show_labels_in_workspace(permalink):
    return workspace_service.show_labels_in_workspace(
            permalink)
