from datetime import datetime, timezone, timedelta

from src import db
from src.models import Workspace, WorkspaceUser, WorkspaceProject, Project
from src.models import UserRole, Role, User, Issue
from src.utils import _response, to_dict, gen_permalink
from src.services.workspace_service import is_workspace_user
from src.services.workspace_service import make_data_to_response_page
from src.enums import WorkspaceRole
from sqlalchemy import and_, or_
from flask import request


def show_project_in_workspace(permalink, issue_kw, leader_kw, member_kw, status):
    curr_workspace = Workspace.query.filter_by(permalink=permalink).first()
    project_list = (
        Project.query.join(WorkspaceProject, WorkspaceProject.project_id == Project.id)
        .join(Role, Project.id == Role.project_id)
        .join(UserRole, UserRole.role_id == Role.id)
        .join(User, User.id == UserRole.user_id)
        .filter(WorkspaceProject.workspace_id == curr_workspace.id)
        .filter(
            or_(
                Issue.name.like(f"%{issue_kw}%"),
                Issue.description.like(f"%{issue_kw}%"),
            )
        )
        .filter(
            and_(
                User.username.like(f"%{leader_kw}%"), Role.description == "ROLE_LEADER"
            )
        )
        .filter(User.username.like(f"%{member_kw}%"))
        .filter(Project.status == status)
        .all()
    )
    project_list_dict = [to_dict(row) for row in project_list]
    project_list_pagination = make_data_to_response_page(project_list_dict)
    return _response(200, message="Retrieve Success", data=project_list_pagination)


def display_project(permalink):
    project = Project.query.filter_by(permalink=permalink).first()
    if project is None:
        return _response(400, "Không tìm thấy project")
    return_project = to_dict(project)

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
    if not is_workspace_user(curr_user):
        return _response(403, "Bạn không nằm trong workspace này")
    user_workspace_role = WorkspaceUser.query.filter_by(user_id=curr_user.id).first()
    if not (
        user_workspace_role.role == WorkspaceRole.ADMIN
        or user_workspace_role.role == WorkspaceRole.MODERATOR
    ):
        return _response(403, "Không có quyền khởi tạo project")
    if Workspace.query.filter_by(id=workspace_id).first is None:
        return _response(400, "Không tìm thấy workspace")
    if User.query.filter_by(id=leader_id).first() is None:
        return _response(400, "Không tìm thấy leader được thêm vào")
    for user_id in member_id:
        user = User.query.filter_by(id=user_id).first()
        if user is None:
            return _response(400, "Không tìm thấy member được thêm vào")
    new_project = Project(
        workspace_id=workspace_id,
        name=name,
        description=description,
        icon=icon,
        status=status,
        start_date=start_date,
        end_date=end_date,
        permalink=gen_permalink(),
        is_removed=False,
        remove_date=datetime.now(timezone.utc) + timedelta(days=30),
        leader_id=leader_id,
        member_id=member_id,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.session.add(new_project)
    db.session.flush()
    new_project_leader_role = Role(
        name="leader",
        description="ROLE.LEADER",
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
        description="ROLE.MEMBER",
        project_id=new_project.id,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.session.add(new_project_member_role)
    db.session.flush()
    member_list = []
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
            role_id=new_project_member_role,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.session.add(member)
        db.session.flush()
    db.session.commit()
    return_project = to_dict(new_project)
    new_leader = to_dict(User.query.filter_by(id=leader_id).first())
    del new_leader["password"]
    del new_leader["email"]
    del new_leader["phone_number"]
    del new_leader["description"]
    del new_leader["created_at"]
    del new_leader["updated_at"]
    return_project["leader"] = new_leader
    return_project["members"] = member_list
    del return_project["is_removed"]
    del return_project["remove_date"]
    return _response(200, message="Tạo project thành công", data=return_project)