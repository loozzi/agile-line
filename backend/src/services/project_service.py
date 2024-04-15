from datetime import datetime, timezone

from src import db
from src.models import Workspace, WorkspaceUser, WorkspaceProject, Project
from src.models import UserRole, Role, OtpVerification
from src.utils import _response, _pagination, to_dict, gen_permalink
from src.enums import WorkspaceRole
from sqlalchemy import select, and_, update
from flask import request


def show_project_in_workspace(permalink, issue_kw, leader_kw, member_kw, status):
    curr_workspace = Workspace.query.filter_by(permalink=permalink).first()
    project_list_pagination = (
        Project.query.join(WorkspaceProject, WorkspaceProject.project_id == Project.id)
        .filter(WorkspaceProject.workspace_id == curr_workspace.id)
        .filter()
        .filter(Project.status == status)
        .all()
    )
    return _response(200, message="Retrieve Success", data=project_list_pagination)


def show_project(permalink):
    project = Project.query.filter_by(permalink=permalink).first()
    return _response(200, message="Retrieve Success", data=to_dict(project))


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
    new_project = Project(
        workspace_id=workspace_id,
        name=name,
        description=description,
        icon=icon,
        status=status,
        start_date=start_date,
        end_date=end_date,
        leader_id=leader_id,
        member_id=member_id,
    )
    return _response(200, message="Tạo project thành công", data=to_dict(new_project))
