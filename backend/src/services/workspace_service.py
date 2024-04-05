from datetime import datetime, timezone

from src import db
from src.models import Workspace, WorkspaceUser
from src.utils import _response, _pagination, to_dict, gen_permalink
from sqlalchemy import select, and_, insert, update
from flask import request


def show_workspace(keyword):
    current_user = request.user
    limit = request.pagination.limit
    page = request.pagination.page
    workspace_list = db.session.execute(
        select(Workspace)
        .join(WorkspaceUser, Workspace.id == WorkspaceUser.workspace_id)
        .where(
            WorkspaceUser.user_id
            == current_user.id & Workspace.title.like(f"%{keyword}%")
        )
    ).fetchall()
    start_index = (page - 1) * limit
    end_index = min(start_index + limit, len(workspace_list))
    current_page_item = workspace_list[start_index:end_index]
    workspace_list_pagination = _pagination(
        current_page=page,
        total_item=len(workspace_list),
        items=current_page_item,
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
    return _response(200, data=to_dict(new_workspace))


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


def access_workspace(permalink):
    if Workspace.query.filter_by(permalink=permalink).first():
        curr_workspace = Workspace.query.filter_by(permalink=permalink)
    else:
        return _response(404, "Không tìm thấy dữ liệu")
    user = request.user
    if (
        curr_workspace.is_private is True
        and is_workspace_user(user, curr_workspace) is True
    ) or curr_workspace.is_private is False:
        return_workspace = Workspace.query.filter_by(id=curr_workspace.id).first()
        return _response(200, to_dict(return_workspace))
    else:
        return _response(403, "Workspace private")


def edit_workspace(permalink, id, title, logo, description, new_permalink, is_private):
    if Workspace.query.filter_by(permalink=permalink).first():
        curr_workspace = Workspace.query.filter_by(permalink=permalink)
    else:
        return _response(404, "Không tìm thấy dữ liệu")
    user = request.user
    if is_workspace_user(user, curr_workspace) is False:
        return _response(403, "Workspace private")
    db.session.execute(
        update(Workspace)
        .where(permalink=permalink)
        .values(
            id=id,
            title=title,
            logo=logo,
            description=description,
            permalink=new_permalink,
            is_private=is_private,
            updated_at=int(datetime.now(timezone.utc).timestamp()),
        )
    )
    updated_workspace = db.session.flush()
    db.session.commit()
    return _response(
        200, message="Chỉnh sửa thông tin thành công", data=to_dict(updated_workspace)
    )
