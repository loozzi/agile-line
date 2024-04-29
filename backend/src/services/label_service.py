from datetime import datetime, timezone

from flask import request
from src import db
from src.models import Label, Workspace, IssueLabel
from src.utils import _response, to_dict
from src.services.issue_service import check_user_workspace


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
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.session.add(new_label)
    db.session.commit()
    data_response = {
        "id": new_label.id,
        "workspace": {
            "id": current_workspace.id,
            "permalink": current_workspace.permalink,
            "title": current_workspace.title,
        },
        "color": new_label.color,
        "title": new_label.title,
        "description": new_label.description,
        "created_at": new_label.created_at,
        "updated_at": new_label.updated_at,
    }
    return _response(status=200,
                     message="tạo label thành công",
                     data=data_response)


def edit_label(id, title, color, description):
    current_user = request.user
    current_label = Label.query.filter_by(id=id).first()
    if current_label is None:
        return _response(404,
                         "Không tìm thấy label")
    if check_user_workspace(current_label.workspace_id,
                            current_user.id) is False:
        return _response(403,
                         "Không có quyền sửa label")
    exist_label = Label.query.filter(
                    Label.title == title).filter(
                        Label.color == color).first()
    if exist_label is not None:
        return _response(409,
                         "Title đã tồn tại, vui lòng chọn title khác")
    current_label.title = title
    current_label.color = color
    current_label.description = description
    current_label.updated_at = datetime.now(timezone.utc)
    db.session.commit()
    current_label = to_dict(current_label)
    del current_label["workspace_id"]
    return _response(200, "Sửa label thành công",
                     current_label)


def delete_label(id):
    current_user = request.user
    current_label = Label.query.filter_by(id=id).first()
    if current_label is None:
        return _response(404, "Không tìm thấy label")
    if check_user_workspace(current_label.workspace_id,
                            current_user.id) is False:
        return _response(403, "Không có quyền xóa label")
    current_issue_label = IssueLabel.query.filter_by(
                            label_id=id).first()
    if current_issue_label is not None:
        db.session.delete(current_issue_label)
        db.session.flush()
    db.session.delete(current_label)
    db.session.commit()
    return _response(200, "Xóa label thành công")
