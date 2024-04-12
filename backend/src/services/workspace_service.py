from datetime import datetime, timezone

from src import db
from src.models import Workspace, WorkspaceUser, User, Project
from src.models import UserRole, Role, OtpVerification
from src.utils import _response, _pagination, to_dict, gen_permalink
from src.enums import WorkspaceRole
from sqlalchemy import select, and_, update
from flask import request


def make_data_to_response_project(dict_user, role):
    del dict_user["password"]
    del dict_user["created_at"]
    del dict_user["updated_at"]
    del dict_user["description"]
    del dict_user["phone_number"]
    del dict_user["email"]
    dict_user["role"] = role
    dict_user["project"] = []
    list_user_role = UserRole.query.filter_by(user_id=dict_user["id"]).all()
    list_project = []
    for user_role in list_user_role:
        role = Role.query.filter_by(id=user_role.role_id).first()
        if role is None:
            continue
        project_user = Project.query.filter_by(
                                            id=role.project_id
                                            ).first()
        if project_user is None:
            continue
        project_user = to_dict(project_user)
        list_project.append(project_user)
    dict_user["project"] = list_project
    return dict_user


def make_data_to_response_page(list_data):
    limit_page = request.pagination["limit"]
    page_cur = request.pagination["page"]
    start_index = (page_cur - 1) * limit_page
    end_index = min(start_index + limit_page, len(list_data))
    current_page_item = list_data[start_index:end_index]
    data_pagination = _pagination(
        current_page=page_cur,
        total_item=len(list_data),
        items=current_page_item,
        limit=limit_page,
    )
    return data_pagination


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
    return _response(200, "Tạo thành công",
                     data=return_workspace)


def is_workspace_user(user, workspace):
    result = db.session.execute(
        select(WorkspaceUser).where(
            and_(
                WorkspaceUser.workspace_id == workspace.id,
                WorkspaceUser.user_id == user.id,
            )
        )
    )
    if result.fetchone():
        return True
    else:
        return False


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
            id=curr_workspace.id
            ).first()
        return _response(200, "Truy cập thành công",
                         data=to_dict(return_workspace))
    else:
        return _response(403, "Workspace private")


def edit_workspace(permalink, title, logo,
                   description, new_permalink, is_private):
    curr_workspace = Workspace.query.filter_by(
        permalink=permalink
        ).first()
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
        permalink=permalink
        ).first()
    if workspace_to_find_user is None:
        return _response(404, "Không tìm thấy dữ liệu")
    user_join_workspaceUser_tuple = []
    if role_workspace == "":
        user_join_workspaceUser_tuple = db.session.query(
            User, WorkspaceUser
            ).join(
                WorkspaceUser, User.id == WorkspaceUser.user_id
                ).filter(
                    WorkspaceUser.workspace_id == workspace_to_find_user.id
                    ).filter(
                        User.username.like(f"%{member_keyword}%")
                        ).all()
    else:
        user_join_workspaceUser_tuple = db.session.query(
            User, WorkspaceUser
            ).join(
                WorkspaceUser, User.id == WorkspaceUser.user_id
                ).filter(
                    WorkspaceUser.workspace_id == workspace_to_find_user.id
                    ).filter(
                        User.username.like(f"%{member_keyword}%")
                        ).filter(WorkspaceUser.role == role_workspace).all()
    list_res = []
    for idex in range(len(user_join_workspaceUser_tuple)):
        usersp = to_dict(user_join_workspaceUser_tuple[idex][0])
        role = user_join_workspaceUser_tuple[idex][1].role.value
        list_res.append((usersp, role))
    list_response = []
    for i in list_res:
        data_user = i[0]
        data_user = make_data_to_response_project(data_user, role)
        list_response.append(data_user)
    user_list_pagination = make_data_to_response_page(list_response)
    return _response(200,
                     message="Tìm kiếm thành công",
                     data=user_list_pagination)


def add_members_to_workspace(permalink, list_id_members):
    current_user = request.user
    current_workspace = Workspace.query.filter_by(permalink=permalink).first()
    current_user_workspace = WorkspaceUser.query.filter_by(
                                    workspace_id=current_workspace.id
                                    ).filter_by(
                                        user_id=current_user.id
                                        ).first()
    if current_user_workspace is None:
        return _response(404, "Không tìm thấy dữ liệu")
    if current_user_workspace.role != WorkspaceRole.ADMIN:
        return _response(403, "Không có quyền truy cập")
    list_new_mems = []
    for id_user in list_id_members:
        user = User.query.filter_by(id=id_user).first()
        if user is None:
            return _response(400, message="Một số thành viên không tồn tại")
        check_user_verify = OtpVerification.query.filter_by(
                                user_id=id_user
                                ).first()
        if check_user_verify.verified is False:
            return _response(400, message="Một số thành viên chưa xác thực")
        worksp_user = WorkspaceUser.query.filter_by(user_id=id_user).first()
        if worksp_user:
            continue
        new_user = WorkspaceUser(user_id=id_user,
                                 workspace_id=current_workspace.id,
                                 role=WorkspaceRole.MEMBER,
                                 created_at=datetime.now(timezone.utc),
                                 updated_at=datetime.now(timezone.utc)
                                 )
        db.session.add(new_user)
        db.session.commit()
        list_new_mems.append(make_data_to_response_project(to_dict(user),
                                                           "MEMBER"))
    user_list_pagination = make_data_to_response_page(list_new_mems)
    return _response(200,
                     message="Thêm thành viên thành công",
                     data=user_list_pagination)


def delete_member_from_workspace(permalink, user_id):
    current_user = request.user
    current_workspace = Workspace.query.filter_by(permalink=permalink).first()
    if current_workspace is None:
        return _response(404, "Không tìm thấy dữ liệu")
    current_user_workspace = WorkspaceUser.query.filter_by(
                                user_id=current_user.id
                                ).filter_by(
                                    workspace_id=current_workspace.id).first()
    if current_user_workspace is None:
        return _response(404, "Không tìm thấy dữ liệu")
    user_workspace_to_delete = WorkspaceUser.query.filter_by(
                                user_id=user_id
                                ).filter_by(
                                    workspace_id=current_workspace.id).first()
    if user_workspace_to_delete is None:
        return _response(404, "Không tìm thấy dữ liệu")
    if current_user_workspace.role != WorkspaceRole.ADMIN:
        return _response(403, "Không có quyền truy cập")
    db.session.delete(user_workspace_to_delete)
    db.session.commit()
    return _response(200, "Xóa thành viên thành công")
