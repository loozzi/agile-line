from datetime import datetime, timezone

from sqlalchemy import or_, func
from src import bcrypt, db
from src.models import Workspace, WorkspaceUser, User
from src.utils import _response, _pagination, to_dict
from sqlalchemy import select
from flask import request


def show_workspace(limit, page, keyword):
    current_user = request.user
    workspace_list = db.session.execute(
        select(Workspace)
        .join(WorkspaceUser, Workspace.id == WorkspaceUser.workspace_id)
        .where(
            WorkspaceUser.user_id
            == current_user.id & Workspace.title.like(f"%{keyword}%")
        )
    ).fetchall()
    workspace_list_pagination = _pagination(
        current_page=page,
        total_item=len(workspace_list),
        items=workspace_list,
        limit=limit,
    )
    return _response(200, workspace_list_pagination)


def create_workspace(title, logo, description, is_private):

    return _response(200)


def access_workspace(workspace):
    if workspace.is_private is False:
        return _response(200, to_dict(workspace))
    else:
        return _response(403, "Workspace private")
