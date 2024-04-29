from datetime import datetime, timezone

from src import db
from src.models import Issue
from src.models import Resources
from src.utils import _response, to_dict
from src.services.issue_service import check_user_project
from flask import request


def edit_resource(id_resource, link):
    current_user = request.user
    current_resource = Resources.query.filter_by(id=id_resource).first()
    if current_resource is None:
        return _response(404, "Không tìm thấy resource")
    current_issue = Issue.query.filter_by(id=current_resource.issue_id).first()
    if check_user_project(current_issue.project_id,
                          current_user.id) is False:
        return _response(status=403,
                         message="Không có quyền chỉnh sửa resource")
    current_resource.link = link
    db.session.commit()
    current_resource = to_dict(current_resource)
    return _response(status=200,
                     message="Chỉnh sửa resource thành công",
                     data=current_resource)


def add_resources_to_issue(resources, issue_id):
    current_user = request.user
    current_issue = Issue.query.filter_by(id=issue_id).first()
    if current_issue is None:
        return _response(status=404, message="Không tìm thấy issue")
    if check_user_project(current_issue.project_id, current_user.id) is False:
        return _response(status=403,
                         message="Không có quyền thêm resources vào issue")
    list_resource = []
    for i in resources:
        exist_resource = Resources.query.filter(
                            Resources.link == i).filter(
                                Resources.issue_id == issue_id).first()
        if exist_resource is not None:
            continue
        new_resource = Resources(
            issue_id=issue_id,
            link=i,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.session.add(new_resource)
        db.session.commit()
        list_resource.append(to_dict(new_resource))
    data_response = {"resources": list_resource}
    return _response(status=200,
                     message="Thêm resources thành công",
                     data=data_response)


def delete_resource(id):
    current_user = request.user
    current_resource = Resources.query.filter_by(id=id).first()
    if current_resource is None:
        return _response(status=404, message="Không tìm thấy resource")
    current_issue = Issue.query.filter_by(
                        id=current_resource.issue_id
                        ).first()
    if check_user_project(current_issue.project_id, current_user.id) is False:
        return _response(status=403,
                         message="Không có quyền xóa resource")
    db.session.delete(current_resource)
    db.session.commit()
    return _response(status=200, message="Xóa resource thành công")
