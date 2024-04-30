from datetime import datetime, timezone

from src import db
from src.models import Issue, Project, User, Label, IssueLabel
from src.models import Workspace, Resources, Activity, WorkspaceUser, Milestone
from src.models import UserRole, Role
from src.utils import _response, gen_permalink, to_dict
from src.services.workspace_service import make_data_to_response_page
from flask import request


def create_response_activity(current_issue, current_user):
    activities = Activity.query.filter(
                    Activity.issue_id == current_issue.id).filter(
                        Activity.user_id == current_user.id).first()
    if activities is None:
        activities = Activity(
            issue_id = current_issue.id,
            user_id = current_user.id,
            action = "edit",
            is_edited = True,
            created_at = datetime.now(timezone.utc),
            updated_at = datetime.now(timezone.utc),
        )
        db.session.flush()
    else:
        activities.action = "edit"
        activities.is_edited=True
    db.session.commit()
    activities = to_dict(activities)
    del activities["issue_id"]
    return activities


def check_user_project(project_id, user_id):
    item_project = db.session.query(Project, Role, UserRole, User).join(
                    Project, Project.id == Role.project_id).join(
                        UserRole, Role.id == UserRole.role_id).join(
                            User, UserRole.user_id == User.id).filter(
                                Project.id == project_id, User.id == user_id
                                ).first()
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
        new_resource = Resources.query.filter(Resources.link == i).filter(
            Resources.issue_id == issue.id).first()
        if new_resource is None:
            new_resource = Resources(
                issue_id=issue.id,
                link=i,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc)
            )
            db.session.add(new_resource)
            db.session.commit()
        data_response.append({
            "id": new_resource.id,
            "link": new_resource.link,
        })
    return data_response


def make_data_response_issue(issue, list_resource, project): #service
    labels = db.session.query(Label, IssueLabel).join(
                Label, Label.id == IssueLabel.label_id
                ).filter(IssueLabel.issue_id == issue.id).all()
    list_labels = []
    for i in labels:
        list_labels.append(i[0].title)
    data_response = {}
    data_response["project"] = {
        "id": project.id,
        "name": project.name,
        "permalink": project.permalink,
        "icon": project.icon,
    }
    data_response["id"] = issue.id
    data_response["name"] = issue.name
    data_response["status"] = issue.status.value
    if len(list_labels) == 0:
        data_response["label"] = []
    else:
        data_response["label"] = list_labels
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
        updated_at=datetime.now(timezone.utc)
    )
    db.session.add(new_issue)
    db.session.flush()
    list_label = []
    for i in label:
        label_i = Label.query.filter_by(id=i).first()
        if label_i is None:
            return _response(404, "Một số label không tồn tại")
        list_label.append(label_i)
    for i in list_label:
        issue_label = IssueLabel(
                        issue_id=new_issue.id,
                        label_id=i.id,
                        created_at=datetime.now(timezone.utc),
                        updated_at=datetime.now(timezone.utc)
                    )
        db.session.add(issue_label)
        db.session.flush()
    db.session.commit()
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
    data_response = make_data_response_issue(new_issue, list_resource,
                                                   current_project)
    db.session.commit()
    return _response(status=200,
                     message="Tạo issue thành công",
                     data=data_response)


def get_issue_user(user_name, project_id, keyword, status, label_list):
    current_project = Project.query.filter_by(id=project_id).first()
    if current_project is None:
        return _response(400, "project không tồn tại")
    user_to_get_issue = User.query.filter_by(username=user_name).first()
    if user_to_get_issue is None:
        return _response(400, "user không tồn tại")
    issue_user_tuple = ()
    if status == "" and label_list == []:
        issue_user_tuple = db.session.query(Issue, IssueLabel, Label).join(
            IssueLabel, IssueLabel.issue_id == Issue.id).join(
                Label, Label.id == IssueLabel.label_id).filter(
                    Issue.assignee_id == user_to_get_issue.id).filter(
                        Issue.name.like(f"%{keyword}%")).all()
    elif status == "" and label_list != []:
        issue_user_tuple = db.session.query(Issue, IssueLabel, Label).join(
            IssueLabel, IssueLabel.issue_id == Issue.id).join(
                Label, Label.id == IssueLabel.label_id).filter(
                    Issue.assignee_id == user_to_get_issue.id).filter(
                        Issue.name.like(f"%{keyword}%")).filter(
                            Label.title.in_(label_list)).all()
    elif status != "" and label_list == []:
        issue_user_tuple = db.session.query(Issue, IssueLabel, Label).join(
            IssueLabel, IssueLabel.issue_id == Issue.id).join(
                Label, Label.id == IssueLabel.label_id).filter(
                    Issue.assignee_id == user_to_get_issue.id).filter(
                        Issue.name.like(f"%{keyword}%")).filter(
                            Issue.status == status).all()
    else:
        issue_user_tuple = db.session.query(Issue, IssueLabel, Label).join(
            IssueLabel, IssueLabel.issue_id == Issue.id).join(
                Label, Label.id == IssueLabel.label_id).filter(
                    Issue.assignee_id == user_to_get_issue.id).filter(
                        Issue.name.like(f"%{keyword}%")).filter(
                            Issue.status == status).filter(
                                            Label.title.in_(label_list)).all()
    if len(issue_user_tuple) == 0:
        return _response(status=404, message="Không tìm thấy dữ liệu")
    list_response = []
    for i in issue_user_tuple:
        list_resource_i = []
        resources_i = Resources.query.filter_by(issue_id=i[0].id).all()
        for j in resources_i:
            list_resource_i.append(j.link)
        list_response.append(make_data_response_issue(i[0],
                             list_resource_i, current_project))
    return _response(status=200,
                     message="Lấy issue thành công",
                     data=make_data_to_response_page(list_response))


def get_detail_issue(permalink):
    current_issue = Issue.query.filter_by(permalink=permalink).first()
    current_project = Project.query.filter_by(
                        id=current_issue.project_id).first()
    list_resource = []
    resources = Resources.query.filter_by(
                    issue_id=current_issue.id).all()
    for i in resources:
        list_resource.append(i.link)
    activity = Activity.query.filter_by(issue_id=current_issue.id).all()
    activity = activity[-1]
    update_activity = to_dict(activity)
    del update_activity["issue_id"]
    response = make_data_response_issue(
                    current_issue, list_resource, current_project)
    response["activities"] = update_activity
    return _response(status=200, message="Lấy issue thành công", data=response)


def edit_issue(issue_id, new_name, new_status, new_labels,
               new_priority, new_assignee_id, new_assignor_id,
               new_testor, new_milestone_id):
    current_issue = Issue.query.filter_by(id=issue_id).first()
    if current_issue is None:
        return _response(404, "issue không tồn tại")
    current_project = Project.query.filter_by(
                        id=current_issue.project_id).first()
    if check_user_project(current_project.id, request.user.id) is False:
        return _response(403, "Không có quyền chỉnh sửa issue")
    # xử lý asign
    if User.query.filter_by(id=new_assignee_id).first() is None:
        new_assignee_id = current_issue.assignee_id
    if User.query.filter_by(id=new_assignor_id).first() is None:
        new_assignor_id = current_issue.assignor_id
    if User.query.filter_by(id=new_testor).first() is None:
        new_testor = current_issue.testor_id
    # xử lý label
    list_new_label_id = []
    if new_labels != []:
        for i in new_labels:
            label = Label.query.filter_by(title=i).first()
            if label is None:
                list_new_label_id = []
                return _response(400, "Một số label không tồn tại")
            list_new_label_id.append(label.id)
    # xóa kết nối đến labels cũ
    issue_labels = IssueLabel.query.filter(
                    IssueLabel.issue_id == issue_id).all()
    for i in issue_labels:
        db.session.delete(i)
        db.session.flush()
    # thêm kết nối đến labels mới
    for i in list_new_label_id:
        new_issue_label = IssueLabel(
            issue_id=issue_id,
            label_id=i,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )
        db.session.add(new_issue_label)
        db.session.flush()
    # chỉnh sửa thông tin issue
    if new_name != "":
        current_issue.name = new_name
        db.session.flush()
    if new_status != "":
        current_issue.status = new_status
        db.session.flush()
    if new_priority != "":
        current_issue.priority = new_priority
        db.session.flush()
    if new_assignee_id != "":
        current_issue.assignee_id = new_assignee_id
        db.session.flush()
    if new_assignor_id != "":
        current_issue.assignor_id = new_assignor_id
        db.session.flush()
    if new_testor != "":
        current_issue.testor_id = new_testor
        db.session.flush()
    new_milestone = Milestone.query.filter_by(id=new_milestone_id).first()
    if new_milestone is None:
        new_milestone_id = None
    current_issue.milestone_id = new_milestone_id
    db.session.commit()
    #
    resources = Resources.query.filter_by(issue_id=current_issue.id).all()
    list_resource = []
    for i in resources:
        list_resource.append(i.link)
    data_response = make_data_response_issue(current_issue,
                                             list_resource,
                                             current_project)
    update_activity = create_response_activity(current_issue, request.user)
    data_response["activities"] = update_activity
    return _response(status=200,
                     message="Chỉnh sửa issue thành công",
                     data=data_response)


def edit_status_issue(status, permalink):
    current_user = request.user
    current_issue = Issue.query.filter_by(permalink=permalink).first()
    if current_issue is None:
        return _response(status=404,
                         message="Không tìm thấy issue")
    if check_user_project(current_issue.project_id, current_user.id) is False:
        return _response(status=403,
                         message="Không có quyền chỉnh sửa issue")
    current_issue.status = status
    db.session.commit()
    resources = Resources.query.filter(
                    Resources.issue_id == current_issue.id).all()
    list_resource = [i.link for i in resources]
    current_project = Project.query.filter(
                    Project.id == current_issue.project_id).first()
    data_response = make_data_response_issue(current_issue,
                                             list_resource,
                                             current_project)
    data_response["activity"] = create_response_activity(current_issue, current_user)
    return _response(status=200,
                     message="Chỉnh sửa status thành công",
                     data=data_response)


def delete_issue(id):
    current_user = request.user
    current_issue = Issue.query.filter_by(id=id).first()
    if current_issue is None:
        return _response(status=404, message="Không tìm thấy issue")
    if check_user_project(current_issue.project_id, current_user.id) is False:
        return _response(status=403, message="Không có quyền xóa issue")
    db.session.delete(current_issue)
    db.session.commit()
    return _response(status=200, message="Xóa issue thành công")
