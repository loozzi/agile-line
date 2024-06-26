from datetime import datetime, timezone

from flask import request
from src import db
from src.models import (
    Activity,
    Issue,
    IssueLabel,
    Label,
    Milestone,
    Project,
    Resources,
    Role,
    User,
    UserRole,
    Workspace,
    WorkspaceUser,
)
from src.services.activity_service import create as create_activity
from src.services.workspace_service import make_data_to_response_page
from src.utils import _response, gen_permalink, to_dict


def create_response_activity(current_issue, current_user):
    activities = (
        Activity.query.filter(Activity.issue_id == current_issue.id)
        .filter(Activity.user_id == current_user.id)
        .first()
    )
    if activities is None:
        activities = Activity(
            issue_id=current_issue.id,
            user_id=current_user.id,
            action="edit",
            is_edited=True,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.session.flush()
    else:
        activities.action = "edit"
        activities.is_edited = True
    db.session.commit()
    activities = to_dict(activities)
    del activities["issue_id"]
    return activities


def data_user_response(user):
    user = to_dict(user)
    del user["password"]
    del user["phone_number"]
    del user["description"]
    del user["created_at"]
    del user["updated_at"]
    return user


def check_user_project(project_id, user_id):
    item_project = (
        db.session.query(Project, Role, UserRole, User)
        .join(Project, Project.id == Role.project_id)
        .join(UserRole, Role.id == UserRole.role_id)
        .join(User, UserRole.user_id == User.id)
        .filter(Project.id == project_id, User.id == user_id)
        .first()
    )
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
    if list_resource == []:
        return data_response
    for i in list_resource:
        new_resource = (
            Resources.query.filter(Resources.link == i)
            .filter(Resources.issue_id == issue.id)
            .first()
        )
        if new_resource is None:
            new_resource = Resources(
                issue_id=issue.id,
                link=i,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.session.add(new_resource)
            db.session.commit()
        data_response.append(
            {
                "id": new_resource.id,
                "link": new_resource.link,
            }
        )
    return data_response


def make_data_response_issue(issue, list_resource):
    labels = (
        db.session.query(Label, IssueLabel)
        .join(Label, Label.id == IssueLabel.label_id)
        .filter(IssueLabel.issue_id == issue.id)
        .all()
    )
    list_labels = []
    for i in labels:
        label = to_dict(i[0])
        del label["workspace_id"]
        list_labels.append(label)
    data_response = {}
    project = Project.query.filter_by(id=issue.project_id).first()
    data_response["project"] = {
        "id": project.id,
        "name": project.name,
        "permalink": project.permalink,
        "icon": project.icon,
    }
    data_response["id"] = issue.id
    data_response["name"] = issue.name
    data_response["description"] = issue.description
    data_response["status"] = issue.status.value
    if len(list_labels) == 0:
        data_response["label"] = []
    else:
        data_response["label"] = list_labels
    data_response["priority"] = issue.priority.value
    asignee = User.query.filter_by(id=issue.assignee_id).first()
    data_response["assignee"] = data_user_response(asignee)
    assignor = User.query.filter_by(id=issue.assignor_id).first()
    data_response["assignor"] = data_user_response(assignor)
    testor = User.query.filter_by(id=issue.testor_id).first()
    data_response["testor"] = data_user_response(testor)
    data_response["milestone_id"] = issue.milestone_id
    data_response["permalink"] = issue.permalink
    data_response["created_at"] = issue.created_at
    data_response["updated_at"] = issue.updated_at
    data_response["resources"] = create_resource_and_response(list_resource, issue)
    return data_response


def create_issue(
    project_id,
    name,
    description,
    status,
    label,
    priority,
    assignee_id,
    assignor_id,
    testor,
    milestone_id,
    list_resource,
):
    current_user = request.user
    current_project = Project.query.filter_by(id=project_id).first()
    if current_project is None:
        return _response(400, "Không tìm thấy dự án")
    current_workspace = Workspace.query.filter_by(
        id=current_project.workspace_id
    ).first()
    if current_workspace is None:
        return _response(400, "Không tìm thấy workspace")
    if check_user_workspace(current_workspace.id, current_user.id) is False:
        return _response(403, "Không nằm trong workspace")
    if check_user_project(project_id, current_user.id) is False:
        return _response(403, "Không nằm trong dự án")
    if assignee_id == "":
        assignee_id = current_user.id
    if assignor_id == "":
        assignor_id = current_user.id
    if testor == "":
        testor = current_user.id
    milestone = Milestone.query.filter(Milestone.id == milestone_id).first()
    if milestone is None:
        milestone_id = None
    else:
        milestone_id = milestone.id
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
        updated_at=datetime.now(timezone.utc),
    )
    db.session.add(new_issue)
    db.session.flush()
    list_label = []
    for i in label:
        label_i = Label.query.filter_by(id=i).first()
        if label_i is None:
            return _response(404, "Một số nhãn không tồn tại")
        list_label.append(label_i)
    for i in list_label:
        issue_label = IssueLabel(
            issue_id=new_issue.id,
            label_id=i.id,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.session.add(issue_label)
        db.session.flush()
    db.session.commit()
    create_activity(new_issue.id, "", "create")
    data_response = make_data_response_issue(new_issue, list_resource)
    db.session.commit()
    return _response(status=200, message="Tạo công việc thành công", data=data_response)


def get_issue_user(user_name, project_id, keyword, status, label_list, workspace_id):
    if workspace_id == "":
        return _response(400, "Vui lòng chọn workspace")
    current_project = Project.query.filter_by(id=project_id).first()
    user_to_get_issue = User.query.filter_by(username=user_name).first()
    issue_user_tuple = ()
    if user_to_get_issue is not None and current_project is None:
        if status == "" and label_list == []:
            issue_user_tuple = (
                db.session.query(Issue, Project, Workspace)
                .join(Project, Project.id == Issue.project_id)
                .join(Workspace, Workspace.id == Project.workspace_id)
                .filter(Issue.assignee_id == user_to_get_issue.id)
                .filter(Issue.name.like(f"%{keyword}%"))
                .filter(Workspace.id == workspace_id)
                .all()
            )
        elif status == "" and label_list != []:
            issue_user_tuple = (
                db.session.query(Issue, IssueLabel, Label)
                .join(IssueLabel, IssueLabel.issue_id == Issue.id)
                .join(Label, Label.id == IssueLabel.label_id)
                .filter(Issue.assignee_id == user_to_get_issue.id)
                .filter(Issue.name.like(f"%{keyword}%"))
                .filter(Label.title.in_(label_list))
                .filter(Label.workspace_id == workspace_id)
                .all()
            )
        elif status != "" and label_list == []:
            issue_user_tuple = (
                db.session.query(Issue, Project, Workspace)
                .join(Project, Project.id == Issue.project_id)
                .join(Workspace, Workspace.id == Project.workspace_id)
                .filter(Issue.assignee_id == user_to_get_issue.id)
                .filter(Issue.name.like(f"%{keyword}%"))
                .filter(Workspace.id == workspace_id)
                .filter(Issue.status == status)
                .all()
            )
        else:
            issue_user_tuple = (
                db.session.query(Issue, IssueLabel, Label)
                .join(IssueLabel, IssueLabel.issue_id == Issue.id)
                .join(Label, Label.id == IssueLabel.label_id)
                .filter(Issue.assignee_id == user_to_get_issue.id)
                .filter(Issue.name.like(f"%{keyword}%"))
                .filter(Issue.status == status)
                .filter(Label.title.in_(label_list))
                .filter(Label.workspace_id == workspace_id)
                .all()
            )
    elif user_to_get_issue is None and current_project is not None:
        if status == "" and label_list == []:
            issue_user_tuple = (
                db.session.query(Issue, Project, Workspace)
                .join(Project, Project.id == Issue.project_id)
                .join(Workspace, Workspace.id == Project.workspace_id)
                .filter(Issue.name.like(f"%{keyword}%"))
                .filter(Workspace.id == workspace_id)
                .filter(Project.id == current_project.id)
                .all()
            )
        elif status == "" and label_list != []:
            issue_user_tuple = (
                db.session.query(Issue, IssueLabel, Label)
                .join(IssueLabel, IssueLabel.issue_id == Issue.id)
                .join(Label, Label.id == IssueLabel.label_id)
                .filter(Issue.name.like(f"%{keyword}%"))
                .filter(Issue.project_id == current_project.id)
                .filter(Label.title.in_(label_list))
                .filter(Label.workspace_id == workspace_id)
                .all()
            )
        elif status != "" and label_list == []:
            issue_user_tuple = (
                db.session.query(Issue, Project, Workspace)
                .join(Project, Project.id == Issue.project_id)
                .join(Workspace, Workspace.id == Project.workspace_id)
                .filter(Issue.name.like(f"%{keyword}%"))
                .filter(Workspace.id == workspace_id)
                .filter(Project.id == current_project.id)
                .filter(Issue.status == status)
                .all()
            )
        else:
            issue_user_tuple = (
                db.session.query(Issue, IssueLabel, Label)
                .join(IssueLabel, IssueLabel.issue_id == Issue.id)
                .join(Label, Label.id == IssueLabel.label_id)
                .filter(Issue.name.like(f"%{keyword}%"))
                .filter(Issue.project_id == current_project.id)
                .filter(Issue.status == status)
                .filter(Label.title.in_(label_list))
                .filter(Label.workspace_id == workspace_id)
                .all()
            )
    elif user_to_get_issue is not None and current_project is not None:
        if status == "" and label_list == []:
            issue_user_tuple = (
                db.session.query(Issue, Project, Workspace)
                .join(Project, Project.id == Issue.project_id)
                .join(Workspace, Workspace.id == Project.workspace_id)
                .filter(Issue.assignee_id == user_to_get_issue.id)
                .filter(Issue.name.like(f"%{keyword}%"))
                .filter(Workspace.id == workspace_id)
                .filter(Project.id == current_project.id)
                .all()
            )
        elif status == "" and label_list != []:
            issue_user_tuple = (
                db.session.query(Issue, IssueLabel, Label)
                .join(IssueLabel, IssueLabel.issue_id == Issue.id)
                .join(Label, Label.id == IssueLabel.label_id)
                .filter(Issue.assignee_id == user_to_get_issue.id)
                .filter(Issue.name.like(f"%{keyword}%"))
                .filter(Issue.project_id == current_project.id)
                .filter(Label.title.in_(label_list))
                .filter(Label.workspace_id == workspace_id)
                .all()
            )
        elif status != "" and label_list == []:
            issue_user_tuple = (
                db.session.query(Issue, Project, Workspace)
                .join(Project, Project.id == Issue.project_id)
                .join(Workspace, Workspace.id == Project.workspace_id)
                .filter(Issue.assignee_id == user_to_get_issue.id)
                .filter(Issue.name.like(f"%{keyword}%"))
                .filter(Workspace.id == workspace_id)
                .filter(Project.id == current_project.id)
                .filter(Issue.status == status)
                .all()
            )
        else:
            issue_user_tuple = (
                db.session.query(Issue, IssueLabel, Label)
                .join(IssueLabel, IssueLabel.issue_id == Issue.id)
                .join(Label, Label.id == IssueLabel.label_id)
                .filter(Issue.assignee_id == user_to_get_issue.id)
                .filter(Issue.name.like(f"%{keyword}%"))
                .filter(Issue.project_id == current_project.id)
                .filter(Issue.status == status)
                .filter(Label.title.in_(label_list))
                .filter(Label.workspace_id == workspace_id)
                .all()
            )
    else:
        if status == "" and label_list == []:
            issue_user_tuple = (
                db.session.query(Issue, Project, Workspace)
                .join(Project, Project.id == Issue.project_id)
                .join(Workspace, Workspace.id == Project.workspace_id)
                .filter(Issue.name.like(f"%{keyword}%"))
                .filter(Workspace.id == workspace_id)
                .all()
            )
        elif status == "" and label_list != []:
            issue_user_tuple = (
                db.session.query(Issue, IssueLabel, Label)
                .join(IssueLabel, IssueLabel.issue_id == Issue.id)
                .join(Label, Label.id == IssueLabel.label_id)
                .filter(Issue.name.like(f"%{keyword}%"))
                .filter(Label.title.in_(label_list))
                .filter(Label.workspace_id == workspace_id)
                .all()
            )
        elif status != "" and label_list == []:
            issue_user_tuple = (
                db.session.query(Issue, Project, Workspace)
                .join(Project, Project.id == Issue.project_id)
                .join(Workspace, Workspace.id == Project.workspace_id)
                .filter(Issue.name.like(f"%{keyword}%"))
                .filter(Workspace.id == workspace_id)
                .filter(Issue.status == status)
                .all()
            )
        else:
            issue_user_tuple = (
                db.session.query(Issue, IssueLabel, Label)
                .join(IssueLabel, IssueLabel.issue_id == Issue.id)
                .join(Label, Label.id == IssueLabel.label_id)
                .filter(Issue.name.like(f"%{keyword}%"))
                .filter(Issue.status == status)
                .filter(Label.title.in_(label_list))
                .filter(Label.workspace_id == workspace_id)
                .all()
            )
    if len(issue_user_tuple) == 0:
        return _response(status=404, message="Không tìm thấy dữ liệu")
    issue_user_set = set()
    for i in issue_user_tuple:
        issue_user_set.add(i[0].id)
    list_issue = Issue.query.filter(Issue.id.in_(issue_user_set)).all()
    list_response = []
    for i in list_issue:
        list_resource_i = []
        resources_i = Resources.query.filter_by(issue_id=i.id).all()
        for j in resources_i:
            list_resource_i.append(j.link)
        list_response.append(make_data_response_issue(i, list_resource_i))
    list_response = sorted(list_response, key=lambda x: x["created_at"], reverse=True)
    return _response(
        status=200,
        message="Truy vấn công việc thành công",
        data=make_data_to_response_page(list_response),
    )


def get_detail_issue(permalink):
    current_issue = Issue.query.filter_by(permalink=permalink).first()
    list_resource = []
    resources = Resources.query.filter_by(issue_id=current_issue.id).all()
    for i in resources:
        list_resource.append(i.link)
    activities = Activity.query.filter_by(issue_id=current_issue.id).all()
    parsed_activities = []

    user_ids = [activity.user_id for activity in activities]

    unique_user_ids = list(set(user_ids))
    users = User.query.filter(User.id.in_(unique_user_ids)).all()

    for activity in activities:
        user = next((user for user in users if user.id == activity.user_id), None)
        parsed_activity = to_dict(activity)
        del parsed_activity["issue_id"]
        del parsed_activity["user_id"]
        parsed_activity["user"] = data_user_response(user)
        parsed_activities.append(parsed_activity)

    response = make_data_response_issue(current_issue, list_resource)
    response["activities"] = parsed_activities
    return _response(status=200, message="Truy vấn công việc thành công", data=response)


def edit_label_issue(list_label, permalink):  # label
    current_user = request.user
    issue = Issue.query.filter_by(permalink=permalink).first()
    list_new_label_id = []
    if list_label != []:
        for i in list_label:
            label = Label.query.filter_by(id=i).first()
            if label is None:
                list_new_label_id = []
                return _response(400, "Một số nhãn không tồn tại")
            list_new_label_id.append(label.id)
    # xóa kết nối đến labels cũ
    issue_labels = IssueLabel.query.filter(IssueLabel.issue_id == issue.id).all()
    for i in issue_labels:
        db.session.delete(i)
        db.session.flush()
    # thêm kết nối đến labels mới
    for i in list_new_label_id:
        new_issue_label = IssueLabel(
            issue_id=issue.id,
            label_id=i,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.session.add(new_issue_label)
        db.session.flush()
    db.session.commit()
    resources = Resources.query.filter(Resources.issue_id == issue.id).all()
    list_resource = [i.link for i in resources]
    data_response = make_data_response_issue(issue, list_resource)
    create_activity(issue.id, "Cập nhật nhãn", "edit")
    return _response(
        status=200, message="Chỉnh sửa nhãn thành công", data=data_response
    )


def edit_priority_issue(priority, permalink):  # priority
    current_user = request.user
    issue = Issue.query.filter_by(permalink=permalink).first()
    if priority != "":
        issue.priority = priority
    db.session.commit()
    resources = Resources.query.filter(Resources.issue_id == issue.id).all()
    list_resource = [i.link for i in resources]
    data_response = make_data_response_issue(issue, list_resource)
    create_activity(issue.id, "Cập nhật mức độ ưu tiên", "edit")
    return _response(
        status=200, message="Chỉnh sửa mức độ ưu tiên thành công", data=data_response
    )


def edit_assignee_issue(assignee_id, permalink):  # assignee
    current_user = request.user
    issue = Issue.query.filter_by(permalink=permalink).first()
    if assignee_id != "":
        issue.assignee_id = assignee_id
    db.session.commit()
    resources = Resources.query.filter(Resources.issue_id == issue.id).all()
    list_resource = [i.link for i in resources]
    data_response = make_data_response_issue(issue, list_resource)
    create_activity(issue.id, "Cập nhật người phụ trách", "edit")
    return _response(
        status=200, message="Chỉnh sửa người phụ trách thành công", data=data_response
    )


def edit_name_description_issue(
    new_name, new_description, permalink
):  # name, description
    current_user = request.user
    issue = Issue.query.filter_by(permalink=permalink).first()
    if new_name != "":
        issue.name = new_name
    if new_description != "":
        issue.description = new_description
    db.session.commit()
    resources = Resources.query.filter(Resources.issue_id == issue.id).all()
    list_resource = [i.link for i in resources]
    data_response = make_data_response_issue(issue, list_resource)
    create_activity(issue.id, "Cập nhật tên và mô tả", "edit")
    return _response(
        status=200,
        message="Chỉnh sửa thông tin công việc thành công",
        data=data_response,
    )


def edit_status_issue(status, permalink):  # status
    current_user = request.user
    current_issue = Issue.query.filter_by(permalink=permalink).first()
    if current_issue is None:
        return _response(status=404, message="Không tìm thấy công việc")
    if check_user_project(current_issue.project_id, current_user.id) is False:
        return _response(status=403, message="Không có quyền chỉnh sửa công việc")
    current_issue.status = status
    db.session.commit()
    resources = Resources.query.filter(Resources.issue_id == current_issue.id).all()
    list_resource = [i.link for i in resources]
    data_response = make_data_response_issue(current_issue, list_resource)
    create_activity(current_issue.id, "Cập nhật trạng thái", "edit")
    return _response(
        status=200, message="Chỉnh sửa trạng thái thành công", data=data_response
    )


def delete_issue(id):
    current_user = request.user
    current_issue = Issue.query.filter_by(id=id).first()
    if current_issue is None:
        return _response(status=404, message="Không tìm thấy công việc")
    if check_user_project(current_issue.project_id, current_user.id) is False:
        return _response(status=403, message="Không có quyền xóa công việc")
    db.session.delete(current_issue)
    db.session.commit()
    return _response(status=200, message="Xóa công việc thành công")
