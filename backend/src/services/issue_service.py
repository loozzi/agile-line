from datetime import datetime, timezone

from src import db
from src.models import Issue, Project, User, Label, IssueLabel, Workspace, Resources, Activity, WorkspaceUser
from src.models import UserRole, Role
from src.utils import _response, gen_permalink
from flask import request


def check_user_project(project_id, user_id):
    item_project = db.session.query(Project, Role, UserRole, User).join(
                    Project, Project.id == Role.project_id).join(
                        UserRole, Role.id == UserRole.role_id).join(
                            User, UserRole.user_id == User.id).filter(
                                Project.id == project_id, User.id == user_id).first()
    if item_project is None:
        return False
    return True


def check_user_workspace(workspace_id, user_id):
    workspace_user = WorkspaceUser.query.filter_by(
                        workspace_id=workspace_id, user_id=user_id
                        ).first()
    if workspace_user is None:
        return False
    return True


def create_resource_and_response(list_resource, issue):
    data_response = []
    if list_resource == "":
        return data_response
    for i in list_resource:
        new_resource = Resources(
            issue_id=issue.id,
            link=i,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )
        db.session.add(new_resource)
        db.session.flush()
        data_response.append({
            "id": new_resource.id,
            "link": new_resource.link,
        })
    return data_response


def make_data_response(issue, list_resource):
    label = db.session.query(Label, IssueLabel).join(
                Label, Label.id == IssueLabel.label_id
                ).filter(IssueLabel.issue_id == issue.id).first()
    data_response = {}
    data_response["id"] = issue.id
    data_response["name"] = issue.name
    data_response["status"] = issue.status.value
    data_response["label"] = label[0].title
    data_response["priority"] = issue.priority.value
    data_response["assignee_id"] = issue.assignee_id
    data_response["assignor_id"] = issue.assignor_id
    data_response["testor_id"] = issue.testor_id
    data_response["milestone_id"] = issue.milestone_id
    data_response["permalink"] = issue.permalink
    data_response["created_at"] = issue.created_at
    data_response["updated_at"] = issue.updated_at
    data_response["resources"] = create_resource_and_response(
                                    list_resource, issue)
    return data_response


def create_issue(project_id, name, description, status, label,
                 priority, assignee_id, assignor_id, testor,
                 milestone_id, list_resource):
    current_user = request.user
    current_project = Project.query.filter_by(id=project_id).first()
    if current_project is None:
        return _response(400, "project không tồn tại")
    current_workspace = Workspace.query.filter_by(
                        id=current_project.workspace_id
                        ).first()
    if current_workspace is None:
        return _response(400, "Không tìm thấy workspace")
    if check_user_workspace(current_workspace.id,
                            current_user.id
                            ) is False:
        return _response(403, "Không nằm trong workspace")
    if check_user_project(project_id, current_user.id) is False:
        return _response(403, "Không nằm trong project")
    if assignee_id == "":
        assignee_id = current_user.id
    if assignor_id == "":
        assignor_id = current_user.id
    if testor == "":
        testor = current_user.id
    new_issue = Issue(
        project_id=project_id,
        name=name,
        description=description,
        status=status,
        priority=priority,
        assignee_id=assignee_id,
        assignor_id=assignor_id,
        testor_id=testor,
        milestone_id=milestone_id,
        permalink=gen_permalink(),
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    db.session.add(new_issue)
    db.session.flush()
    label = Label.query.filter_by(title=label).first()
    if label is None:
        return _response(400, "Nhãn không tồn tại")
    issue_label = IssueLabel(
        issue_id=new_issue.id,
        label_id=label.id,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    db.session.add(issue_label)
    db.session.flush()
    new_activity = Activity(
        user_id=current_user.id,
        issue_id=new_issue.id,
        action="create",
        is_edited=False,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    db.session.add(new_activity)
    db.session.commit()
    return _response(status=200,
                     message="Tạo issue thành công",
                     data=make_data_response(new_issue, list_resource))
