from datetime import datetime, timezone

from src import db
from src.models import Workspace, WorkspaceUser
from src.utils import _response, _pagination, to_dict, gen_permalink
from src.enums import WorkspaceRole
from sqlalchemy import select, and_, insert, update
from flask import request


def show_workspace(keyword):
    current_user = request.user
    limit = request.pagination["limit"]
    page = request.pagination["page"]
    workspace_list = (
        Workspace.query.join(WorkspaceUser, Workspace.id == WorkspaceUser.workspace_id)
        .filter(WorkspaceUser.user_id == current_user.id)
        .all()
    )

    workspace_list_dict = [to_dict(row) for row in workspace_list]
    start_index = (page - 1) * limit
    end_index = min(start_index + limit, len(workspace_list_dict))
    current_page_item = workspace_list_dict[start_index:end_index]
    workspace_list_pagination = _pagination(
        current_page=page,
        total_item=len(workspace_list_dict),
        items=current_page_item,
        limit=limit,
    )
    return _response(200, workspace_list_pagination)


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
    return _response(200, return_workspace)


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
        return_workspace = Workspace.query.filter_by(id=curr_workspace.id).first()
        return _response(200, to_dict(return_workspace))
    else:
        return _response(403, "Workspace private")


def edit_workspace(permalink, title, logo, description, new_permalink, is_private):
    curr_workspace = Workspace.query.filter_by(permalink=permalink).first()
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
