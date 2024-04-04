from datetime import datetime, timezone

from src import db
from src.models import Workspace, WorkspaceUser
from src.utils import _response, _pagination, to_dict, gen_permalink
from sqlalchemy import select, and_, insert
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


def create_workspace(new_title, logo, description, is_private):
    new_workspace = {
        "title": new_title,
        "logo": logo,
        "description": description,
        "permalink": gen_permalink(),
        "is_private": is_private,
        "created_at": int(datetime.now(timezone.utc).timestamp()),
        "updated_at": int(datetime.now(timezone.utc).timestamp()),
    }
    db.session.execute(insert(Workspace), new_workspace)
    pending_workspace = db.session.new
    new_workspace["id"] = pending_workspace.id
    db.session.commit()
    return _response(200, to_dict(new_workspace))


def is_workspace_user(user, workspace):
    if (
        db.session.execute(
            select(WorkspaceUser).where(
                and_(
                    WorkspaceUser.workspace_id
                    == workspace.id & WorkspaceUser.user_id
                    == user.id
                )
            )
        )
        is not None
    ):
        return True
    return False


def access_workspace(workspace):
    user = request.user
    if workspace.is_private is False and is_workspace_user(user, workspace) is True:
        return_workspace = Workspace.query.filter_by(id=workspace.id).first()
        return _response(200, to_dict(return_workspace))
    else:
        return _response(403, "Workspace private")
