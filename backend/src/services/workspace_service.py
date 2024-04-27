from datetime import datetime, timezone

from src import db
from src.models import Workspace, WorkspaceUser, User, Project, Label
from src.models import UserRole, Role, OtpVerification
from src.utils import _response, to_dict, gen_permalink
from src.utils import make_data_to_response_page, is_workspace_user
from src.enums import WorkspaceRole
from sqlalchemy import update
from flask import request


def make_data_return_project(user_id, workspace_id):
    list_user_role = UserRole.query.filter_by(user_id=user_id).all()
    list_project = []
    for user_role in list_user_role:
        role_project = Role.query.filter_by(id=user_role.role_id).first()
        if role_project is None:
            continue
        project_user = (
            Project.query.filter_by(id=role_project.project_id)
            .filter_by(workspace_id=workspace_id)
            .first()
        )
        if project_user is None:
            continue
        project_user = to_dict(project_user)
        del project_user["workspace_id"]
        del project_user["description"]
        del project_user["start_date"]
        del project_user["end_date"]
        del project_user["is_removed"]
        del project_user["remove_date"]
        del project_user["created_at"]
        del project_user["updated_at"]
        del project_user["permalink"]
        project_user["roles"] = role_project.name
        list_project.append(project_user)
    return list_project


def make_data_to_response_project(dict_user, role_workspace, workspaceId):
    del dict_user["password"]
    del dict_user["created_at"]
    del dict_user["updated_at"]
    del dict_user["description"]
    del dict_user["phone_number"]
    del dict_user["email"]
    dict_user["role"] = role_workspace
    dict_user["project"] = []
    list_project = make_data_return_project(dict_user["id"], workspaceId)
    dict_user["project"] = list_project
    return dict_user


def show_workspace(keyword):
    current_user = request.user
    workspace_list = (
        Workspace.query.join(WorkspaceUser,
                             Workspace.id == WorkspaceUser.workspace_id)
        .filter(WorkspaceUser.user_id == current_user.id)
        .filter(Workspace.title.like(f"%{keyword}%") if keyword else True)
        .all()
    )
    workspace_list_dict = [to_dict(row) for row in workspace_list]
    workspace_list_pagination = make_data_to_response_page(workspace_list_dict)
    return _response(200, message="Tìm kiếm thành công",
                     data=workspace_list_pagination)


def create_workspace(new_title, logo, description, is_private):
    user = request.user
    new_workspace = Workspace(
        title=new_title,
        logo=logo,
        description=description,
        permalink=gen_permalink(),
        is_private=is_private,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.session.add(new_workspace)
    db.session.flush()
    return_workspace = to_dict(new_workspace)
    new_workspace_user = WorkspaceUser(
        user_id=user.id,
        workspace_id=new_workspace.id,
        role=WorkspaceRole.ADMIN,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.session.add(new_workspace_user)
    db.session.commit()
    return _response(200, "Tạo thành công", data=return_workspace)


def access_workspace(permalink):
    if Workspace.query.filter_by(permalink=permalink).first():
        curr_workspace = Workspace.query.filter_by(permalink=permalink).first()
    else:
        return _response(404, "Không tìm thấy dữ liệu")
    user = request.user
    if (
        curr_workspace.is_private is True
        and is_workspace_user(user, curr_workspace) is True
    ) or curr_workspace.is_private is False:
        return_workspace = Workspace.query.filter_by(
                            id=curr_workspace.id).first()
        return _response(200, "Truy cập thành công",
                         data=to_dict(return_workspace))
    else:
        return _response(403,
                         "Workspace private")


def edit_workspace(permalink, title, logo,
                   description, new_permalink, is_private):
    curr_workspace = Workspace.query.filter_by(
                        permalink=permalink).first()
    if curr_workspace is None:
        return _response(404, "Không tìm thấy dữ liệu")
    user = request.user
    if is_workspace_user(user, curr_workspace) is False:
        return _response(403, "Workspace private")
    if not title:
        title = curr_workspace.title
    if not logo:
        logo = curr_workspace.logo
    if not description:
        description = curr_workspace.description
    if not new_permalink:
        new_permalink = curr_workspace.permalink
    if is_private == "true":
        is_private = True
    else:
        is_private = False
    new_permalink = new_permalink.replace(" ", "-")
    try:
        db.session.execute(
            update(Workspace)
            .where(Workspace.permalink == permalink)
            .values(
                title=title,
                logo=logo,
                description=description,
                permalink=new_permalink,
                is_private=is_private,
                updated_at=datetime.now(timezone.utc),
            )
        )
        db.session.flush()
        updated_workspace = db.session.merge(curr_workspace)
        db.session.commit()
    except Exception as e:
        return _response(500, "Server Error:" + str(e))
    return _response(
        200,
        message="Chỉnh sửa thông tin thành công",
        data=to_dict(updated_workspace),
    )


def show_workspace_members(member_keyword, role_workspace, permalink):
    workspace_to_find_user = Workspace.query.filter_by(
                                permalink=permalink).first()
    if workspace_to_find_user is None:
        return _response(404, "Không tìm thấy dữ liệu")
    user_join_workspaceUser_tuple = []
    if role_workspace == "":
        user_join_workspaceUser_tuple = (
            db.session.query(User, WorkspaceUser)
            .join(WorkspaceUser, User.id == WorkspaceUser.user_id)
            .filter(WorkspaceUser.workspace_id == workspace_to_find_user.id)
            .filter(User.username.like(f"%{member_keyword}%"))
            .all()
        )
    else:
        user_join_workspaceUser_tuple = (
            db.session.query(User, WorkspaceUser)
            .join(WorkspaceUser, User.id == WorkspaceUser.user_id)
            .filter(WorkspaceUser.workspace_id == workspace_to_find_user.id)
            .filter(User.username.like(f"%{member_keyword}%"))
            .filter(WorkspaceUser.role == role_workspace)
            .all()
        )
    list_res = []
    for idex in range(len(user_join_workspaceUser_tuple)):
        usersp = to_dict(user_join_workspaceUser_tuple[idex][0])
        role = user_join_workspaceUser_tuple[idex][1].role.value
        list_res.append((usersp, role))
    list_response = []
    for i in list_res:
        data_user = i[0]
        data_user = make_data_to_response_project(
            data_user, i[1], workspace_to_find_user.id
        )
        list_response.append(data_user)
    user_list_pagination = make_data_to_response_page(list_response)
    return _response(200, message="Tìm kiếm thành công",
                     data=user_list_pagination)


def add_members_to_workspace(permalink, list_id_members):
    current_user = request.user
    current_workspace = Workspace.query.filter_by(permalink=permalink).first()
    current_user_workspace = (
        WorkspaceUser.query.filter_by(workspace_id=current_workspace.id)
        .filter_by(user_id=current_user.id)
        .first()
    )
    if current_user_workspace is None:
        return _response(404, "Không tìm thấy dữ liệu")
    if current_user_workspace.role != WorkspaceRole.ADMIN:
        return _response(403, "Không có quyền truy cập")
    list_new_mems = []
    for id_user in list_id_members:
        user = User.query.filter_by(id=id_user).first()
        if user is None:
            return _response(400,
                             message="Một số thành viên không tồn tại")
        check_user_verify = OtpVerification.query.filter_by(
                                user_id=id_user).first()
        if check_user_verify.verified is False:
            return _response(400, message="Một số thành viên chưa xác thực")
        worksp_user = WorkspaceUser.query.filter_by(
                        user_id=id_user).first()
        if worksp_user:
            continue
        new_user = WorkspaceUser(
            user_id=id_user,
            workspace_id=current_workspace.id,
            role=WorkspaceRole.MEMBER,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.session.add(new_user)
        db.session.commit()
        list_new_mems.append(
            make_data_to_response_project(to_dict(user),
                                          "MEMBER", current_workspace.id)
        )
    user_list_pagination = make_data_to_response_page(list_new_mems)
    return _response(
        200, message="Thêm thành viên thành công",
        data=user_list_pagination
    )


def delete_member_from_workspace(permalink, user_id):
    current_user = request.user
    current_workspace = Workspace.query.filter_by(permalink=permalink).first()
    if current_workspace is None:
        return _response(404, "Không tìm thấy dữ liệu")
    current_user_workspace = (
        WorkspaceUser.query.filter_by(user_id=current_user.id)
        .filter_by(workspace_id=current_workspace.id)
        .first()
    )
    if current_user_workspace is None:
        return _response(404, "Không tìm thấy dữ liệu")
    user_workspace_to_delete = (
        WorkspaceUser.query.filter_by(user_id=user_id)
        .filter_by(workspace_id=current_workspace.id)
        .first()
    )
    if user_workspace_to_delete is None:
        return _response(404, "Không tìm thấy dữ liệu")
    if current_user_workspace.role != WorkspaceRole.ADMIN:
        return _response(403, "Không có quyền truy cập")
    db.session.delete(user_workspace_to_delete)
    db.session.commit()
    return _response(200, "Xóa thành viên thành công")


def edit_role_members_in_workspace(permalink, edit_user_id, new_role):
    current_workspace = Workspace.query.filter_by(permalink=permalink).first()
    if current_workspace is None:
        return _response(404, message="Không tìm thấy dữ liệu")
    user_workspace_to_edit = WorkspaceUser.query.filter_by(
        user_id=edit_user_id, workspace_id=current_workspace.id
    ).first()
    if user_workspace_to_edit is None:
        return _response(404, message="Không tìm thấy dữ liệu")
    user_makes_edit = request.user
    user_makes_edit_workspace = WorkspaceUser.query.filter_by(
        user_id=user_makes_edit.id, workspace_id=current_workspace.id
    ).first()
    if user_makes_edit_workspace is None:
        return _response(404, message="Không tìm thấy dữ liệu")
    if user_makes_edit_workspace.role != WorkspaceRole.ADMIN:
        return _response(403, message="Không có quyền truy cập")
    user_workspace_to_edit.role = new_role
    db.session.commit()
    user_has_changed = User.query.filter_by(id=edit_user_id).first()
    data_return = make_data_to_response_project(
        to_dict(user_has_changed), new_role, current_workspace.id
    )
    return _response(200, message="Chỉnh sửa thành công", data=data_return)


def show_labels_in_workspace(permalink):
    current_user = request.user
    current_workspace = Workspace.query.filter_by(
                            permalink=permalink).first()
    if current_workspace is None:
        return _response(404, "Không tìm thấy workspace")
    if current_workspace.is_private is True:
        if is_workspace_user(current_user, current_workspace) is False:
            return _response(400, "Workspace private")
    list_label = Label.query.filter_by(
                    workspace_id=current_workspace.id).all()
    list_label_dict = []
    data_response = list_label_dict
    if len(list_label) > 0:
        for i in list_label:
            label_dict = to_dict(i)
            del label_dict["workspace_id"]
            list_label_dict.append(label_dict)
        data_response = make_data_to_response_page(
                            list_label_dict)
    return _response(200, "Tìm kiếm thành công",
                     data=data_response)
