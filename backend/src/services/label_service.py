from datetime import datetime, timezone

from src import db
from src.models import Label, Workspace, WorkspaceUser
from src.utils import _response
from flask import request


def check_user_workspace(workspace_id, user_id):
    workspace_user = WorkspaceUser.query.filter_by(workspace_id=workspace_id,
                                                   user_id=user_id).first()
    if workspace_user is None:
        return False
    return True


def create_label(title, color, workspace_id, description):
    current_user = request.user
    current_workspace = Workspace.query.filter_by(id=workspace_id).first()
    if current_workspace is None:
        return _response(400, "Không tìm thấy workspace")
    if check_user_workspace(workspace_id, current_user.id) is False:
        return _response(403, "Không có quyền tạo label")
    exist_label = Label.query.filter_by(title=title,
                                        workspace_id=workspace_id).first()
    if exist_label is not None:
        return _response(409, "Label đã tồn tại")
    new_label = Label(
        workspace_id=workspace_id,
        title=title,
        color=color,
        description=description,
        create_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    db.session.add(new_label)
    db.session.commit()
    data_response = {
        "id": new_label.id,
        "workspace": {
            "id": current_workspace.id,
            "permalink": current_workspace.permalink,
            "title": current_workspace.title
        },
        "color": new_label.color,
        "title": new_label.title,
        "description": new_label.description,
        "created_at": new_label.create_at,
        "updated_at": new_label.updated_at
    }
    return _response(status=200, message="tạo label thành công",
                     data=data_response)
