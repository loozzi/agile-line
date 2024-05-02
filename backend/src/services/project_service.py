from datetime import datetime, timezone, timedelta

from src import db
from src.models import Workspace, WorkspaceUser, Project
from src.models import UserRole, Role, User, Issue
from src.utils import _response, to_dict, gen_permalink
from src.utils import make_data_to_response_page, is_workspace_user
from src.enums import WorkspaceRole, ProjectStatus, ProjectDefaultRole
from sqlalchemy import and_, or_
from flask import request


def show_project_in_workspace(permalink, issue_kw, leader_kw, member_kw, status):
    curr_workspace = Workspace.query.filter_by(permalink=permalink).first()
    project_list = (
        Project.query.join(Role, Project.id == Role.project_id)
        .join(UserRole, UserRole.role_id == Role.id)
        .join(User, User.id == UserRole.user_id)
        .filter(Project.workspace_id == curr_workspace.id)
        .filter(
            or_(
                Issue.name.like(f"%{issue_kw}%"),
                Issue.description.like(f"%{issue_kw}%"),
            )
            if issue_kw
            else True
        )
        .filter(
            and_(
                User.username.like(f"%{leader_kw}%"),
                Role.description == ProjectDefaultRole.LEADER.value,
            )
            if leader_kw
            else True
        )
        .filter(User.username.like(f"%{member_kw}%") if member_kw else True)
        .filter(Project.status == status if status else True)
        .all()
    )
    project_list_dict = [to_dict(row) for row in project_list]
    for project in project_list_dict:
        project["status"] = project["status"].value
    project_list_pagination = make_data_to_response_page(project_list_dict)
    return _response(200, message="Retrieve Success", data=project_list_pagination)


def display_project(permalink):
    project = Project.query.filter_by(permalink=permalink).first()
    if project is None:
        return _response(404, "Không tìm thấy project")
    return_project = to_dict(project)
    del return_project["workspace_id"]
    del return_project["is_removed"]
    del return_project["remove_date"]
    del return_project["created_at"]
    project_leader_role = (
        Role.query.filter_by(project_id=project.id)
        .filter_by(description=ProjectDefaultRole.LEADER.value)
        .first()
    )
    project_leader = UserRole.query.filter_by(role_id=project_leader_role.id).first()
    leader_user = to_dict(User.query.filter_by(id=project_leader.user_id).first())
    del leader_user["password"]
    del leader_user["email"]
    del leader_user["phone_number"]
    del leader_user["description"]
    del leader_user["created_at"]
    del leader_user["updated_at"]
    leader_user["role"] = project_leader_role.name
    return_project["leader"] = leader_user
    project_member_role = (
        Role.query.filter_by(project_id=project.id)
        .filter_by(description=ProjectDefaultRole.MEMBER.value)
        .first()
    )
    list_member = []
    project_members = UserRole.query.filter_by(role_id=project_member_role.id).all()
    for member in project_members:
        member_user = to_dict(User.query.filter_by(id=member.user_id).first())
        del member_user["password"]
        del member_user["email"]
        del member_user["phone_number"]
        del member_user["description"]
        del member_user["created_at"]
        del member_user["updated_at"]
        member_user["role"] = project_member_role.name
        list_member.append(member_user)
    return_project["members"] = list_member
    return_project["status"] = return_project["status"].value
    return _response(200, message="Retrieve Success", data=return_project)


def create_project(
    workspace_id,
    name,
    description,
    icon,
    status,
    start_date,
    end_date,
    leader_id,
    member_id,
):
    curr_user = request.user
    workspace = Workspace.query.filter_by(id=workspace_id).first()
    if Workspace.query.filter_by(id=workspace_id).first() is None:
        return _response(404, "Không tìm thấy workspace")
    if not is_workspace_user(curr_user, workspace):
        return _response(403, "Bạn không nằm trong workspace này")
    user_workspace_role = WorkspaceUser.query.filter_by(user_id=curr_user.id).first()
    if not (
        user_workspace_role.role == WorkspaceRole.ADMIN
        or user_workspace_role.role == WorkspaceRole.MODERATOR
    ):
        return _response(403, "Không có quyền khởi tạo project")

    if User.query.filter_by(id=leader_id).first() is None:
        return _response(404, "Không tìm thấy leader được thêm vào")
    if not isinstance(member_id, int):
        for user_id in member_id:
            user = User.query.filter_by(id=user_id).first()
            if user is None:
                return _response(404, "Không tìm thấy member được thêm vào")
    else:
        if User.query.filter_by(id=member_id).first() is None:
            return _response(404, "Không tìm thấy member được thêm vào")
    new_project = Project(
        workspace_id=workspace_id,
        name=name,
        description=description,
        icon=icon,
        status=ProjectStatus[status.upper()],
        start_date=start_date,
        end_date=end_date,
        permalink=gen_permalink(),
        is_removed=False,
        remove_date=datetime.now(timezone.utc) + timedelta(days=30),
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.session.add(new_project)
    db.session.flush()
    new_project_leader_role = Role(
        name="leader",
        description=ProjectDefaultRole.LEADER.value,
        project_id=new_project.id,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.session.add(new_project_leader_role)
    db.session.flush()
    leader_user = UserRole(
        user_id=leader_id,
        role_id=new_project_leader_role.id,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.session.add(leader_user)
    db.session.flush()
    new_project_member_role = Role(
        name="member",
        description=ProjectDefaultRole.MEMBER.value,
        project_id=new_project.id,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.session.add(new_project_member_role)
    db.session.flush()
    member_list = []
    if not isinstance(member_id, int):
        if leader_id not in member_id:
            leader_member = UserRole(
                user_id=leader_id,
                role_id=new_project_member_role.id,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.session.add(leader_member)
            db.session.flush()
    else:
        if leader_id != member_id:
            leader_member = UserRole(
                user_id=leader_id,
                role_id=new_project_member_role.id,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.session.add(leader_member)
            db.session.flush()
    if not isinstance(member_id, int):
        for user_id in member_id:
            new_member = to_dict(User.query.filter_by(id=user_id).first())
            del new_member["password"]
            del new_member["email"]
            del new_member["phone_number"]
            del new_member["description"]
            del new_member["created_at"]
            del new_member["updated_at"]
            new_member["roles"] = "member"
            member_list.append(new_member)
            member = UserRole(
                user_id=user_id,
                role_id=new_project_member_role.id,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.session.add(member)
            db.session.flush()
    else:
        new_member = to_dict(User.query.filter_by(id=member_id).first())
        del new_member["password"]
        del new_member["email"]
        del new_member["phone_number"]
        del new_member["description"]
        del new_member["created_at"]
        del new_member["updated_at"]
        new_member["roles"] = "member"
        member_list.append(new_member)
        member = UserRole(
            user_id=member_id,
            role_id=new_project_member_role.id,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.session.add(member)
        db.session.flush()
    return_project = to_dict(new_project)
    return_project["status"] = return_project["status"].value
    new_leader = to_dict(User.query.filter_by(id=leader_id).first())
    del new_leader["password"]
    del new_leader["email"]
    del new_leader["phone_number"]
    del new_leader["description"]
    del new_leader["created_at"]
    del new_leader["updated_at"]
    return_project["leader"] = new_leader
    return_project["members"] = member_list
    del return_project["workspace_id"]
    del return_project["is_removed"]
    del return_project["remove_date"]
    del return_project["created_at"]
    db.session.commit()
    return _response(200, message="Tạo project thành công", data=return_project)


def show_role_in_project(permalink):
    curr_user = request.user
    project = Project.query.filter_by(permalink=permalink).first()
    if project is None:
        return _response(404, "Không tìm thấy project")
    workspace = Workspace.query.filter_by(id=project.workspace_id).first()
    if not is_workspace_user(curr_user, workspace):
        return _response(403, "Không có quyền truy cập vào project")
    role_list = Role.query.filter_by(project_id=project.id).all()
    role_list_dict = [to_dict(role) for role in role_list]
    for role in role_list_dict:
        del role["project_id"]
    role_list_pagination = make_data_to_response_page(role_list_dict)
    return _response(200, "Hiển thị thành công", role_list_pagination)


def create_role_in_project(permalink, name, description):
    curr_user = request.user
    project = Project.query.filter_by(permalink=permalink).first()
    project_user = (
        db.session.query(UserRole, Role)
        .join(Role, Role.id == UserRole.role_id)
        .filter_by(project_id=project.id)
        .filter(UserRole.user_id == curr_user.id)
        .all()
    )
    if project_user is None:
        return _response(403, "Không có quyền truy cập vào project")
    if [
        p_user.Role.description == ProjectDefaultRole.LEADER.value
        for p_user in project_user
    ] is None:
        return _response(403, "Không có quyền tạo role")
    if (
        description == ProjectDefaultRole.LEADER.value
        or description == ProjectDefaultRole.MEMBER.value
    ):
        return _response(403, "Không được tạo role trùng với role gốc")
    if Role.query.filter_by(project_id=project.id).filter_by(name=name).first():
        return _response(400, "Role đã tồn tại")
    new_role = Role(
        name=name,
        description=description,
        project_id=project.id,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.session.add(new_role)
    db.session.flush()
    return_role = to_dict(new_role)
    db.session.commit()
    return _response(200, "Tạo role thành công", return_role)


def edit_role_in_project(permalink, id, name, description):
    curr_user = request.user
    project = Project.query.filter_by(permalink=permalink).first()
    project_user = (
        db.session.query(UserRole, Role)
        .join(Role, Role.id == UserRole.role_id)
        .filter_by(project_id=project.id)
        .filter(UserRole.user_id == curr_user.id)
        .all()
    )
    if project_user is None:
        return _response(403, "Không có quyền truy cập vào project")
    if [
        p_user.Role.description == ProjectDefaultRole.LEADER.value
        for p_user in project_user
    ] is None:
        return _response(403, "Không có quyền chỉnh sửa role")
    if not Role.query.filter_by(project_id=project.id).filter_by(id=id).first():
        return _response(404, "Không tìm thấy role")
    if Role.query.filter_by(project_id=project.id).filter_by(name=name).first():
        return _response(400, "Trùng tên với role khác")
    if (
        Role.query.filter_by(project_id=project.id)
        .filter_by(description=description)
        .first()
    ):
        return _response(400, "Trùng description với role khác")
    edit_role = Role.query.filter_by(id=id).first()
    if (
        edit_role.description == ProjectDefaultRole.LEADER.value
        or edit_role.description == ProjectDefaultRole.MEMBER.value
    ):
        return _response(403, "Không có quyền chỉnh sửa role gốc")
    if edit_role.name != name:
        edit_role.name = name
    if edit_role.description != description:
        edit_role.description = description

    edit_role.updated_at = datetime.now(timezone.utc)
    return_role = to_dict(edit_role)
    del return_role["project_id"]
    db.session.commit()
    return _response(200, "Chỉnh sửa thành công", return_role)
