from datetime import datetime, timezone, timedelta
from src import bcrypt, db
from src.models import Workspace, WorkspaceUser, Project
from src.models import UserRole, Role, User, Issue
from src.utils import _response, to_dict, gen_permalink
from src.utils import make_data_to_response_page, is_workspace_user
from src.enums import WorkspaceRole, ProjectStatus, ProjectDefaultRole
from sqlalchemy import and_, or_
from flask import request


def show_project_in_workspace(permalink, issue_kw, leader_kw, member_kw, status):
    curr_workspace = Workspace.query.filter_by(permalink=permalink).first()
    project_list = (
        Project.query.join(Role, Project.id == Role.project_id)
        .join(UserRole, UserRole.role_id == Role.id)
        .join(User, User.id == UserRole.user_id)
        .filter(Project.workspace_id == curr_workspace.id)
        .filter(
            or_(
                Issue.name.like(f"%{issue_kw}%"),
                Issue.description.like(f"%{issue_kw}%"),
            )
            if issue_kw
            else True
        )
        .filter(
            and_(
                User.username.like(f"%{leader_kw}%"),
                Role.description == ProjectDefaultRole.LEADER.value,
            )
            if leader_kw
            else True
        )
        .filter(User.username.like(f"%{member_kw}%") if member_kw else True)
        .filter(Project.status == status if status else True)
        .all()
    )
    project_list_dict = [to_dict(row) for row in project_list]
    for project in project_list_dict:
        project["status"] = project["status"].value
    project_list_pagination = make_data_to_response_page(project_list_dict)
    return _response(200, message="Retrieve Success", data=project_list_pagination)


def display_project(permalink):
    project = Project.query.filter_by(permalink=permalink).first()
    if project is None:
        return _response(400, "Không tìm thấy project")
    return_project = to_dict(project)
    del return_project["workspace_id"]
    del return_project["is_removed"]
    del return_project["remove_date"]
    del return_project["created_at"]
    project_leader_role = (
        Role.query.filter_by(project_id=project.id)
        .filter_by(description=ProjectDefaultRole.LEADER.value)
        .first()
    )
    project_leader = UserRole.query.filter_by(role_id=project_leader_role.id).first()
    leader_user = to_dict(User.query.filter_by(id=project_leader.user_id).first())
    del leader_user["password"]
    del leader_user["email"]
    del leader_user["phone_number"]
    del leader_user["description"]
    del leader_user["created_at"]
    del leader_user["updated_at"]
    leader_user["role"] = project_leader_role.name
    return_project["leader"] = leader_user
    project_member_role = (
        Role.query.filter_by(project_id=project.id)
        .filter_by(description=ProjectDefaultRole.MEMBER.value)
        .first()
    )
    list_member = []
    project_members = UserRole.query.filter_by(role_id=project_member_role.id).all()
    for member in project_members:
        member_user = to_dict(User.query.filter_by(id=member.user_id).first())
        del member_user["password"]
        del member_user["email"]
        del member_user["phone_number"]
        del member_user["description"]
        del member_user["created_at"]
        del member_user["updated_at"]
        member_user["role"] = project_member_role.name
        list_member.append(member_user)
    return_project["members"] = list_member
    return_project["status"] = return_project["status"].value
    return _response(200, message="Retrieve Success", data=return_project)


def create_project(
    workspace_id,
    name,
    description,
    icon,
    status,
    start_date,
    end_date,
    leader_id,
    member_id,
):
    curr_user = request.user
    workspace = Workspace.query.filter_by(id=workspace_id).first()
    if Workspace.query.filter_by(id=workspace_id).first() is None:
        return _response(400, "Không tìm thấy workspace")
    if not is_workspace_user(curr_user, workspace):
        return _response(403, "Bạn không nằm trong workspace này")
    user_workspace_role = WorkspaceUser.query.filter_by(user_id=curr_user.id).first()
    if not (
        user_workspace_role.role == WorkspaceRole.ADMIN
        or user_workspace_role.role == WorkspaceRole.MODERATOR
    ):
        return _response(403, "Không có quyền khởi tạo project")
    if User.query.filter_by(id=leader_id).first() is None:
        return _response(400, "Không tìm thấy leader được thêm vào")
    if not isinstance(member_id, int):
        for user_id in member_id:
            user = User.query.filter_by(id=user_id).first()
            if user is None:
                return _response(400, "Không tìm thấy member được thêm vào")
    else:
        if User.query.filter_by(id=member_id).first() is None:
            return _response(400, "Không tìm thấy member được thêm vào")
    new_project = Project(
        workspace_id=workspace_id,
        name=name,
        description=description,
        icon=icon,
        status=ProjectStatus[status.upper()],
        start_date=start_date,
        end_date=end_date,
        permalink=gen_permalink(),
        is_removed=False,
        remove_date=datetime.now(timezone.utc) + timedelta(days=30),
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.session.add(new_project)
    db.session.flush()
    new_project_leader_role = Role(
        name="leader",
        description=ProjectDefaultRole.LEADER.value,
        project_id=new_project.id,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.session.add(new_project_leader_role)
    db.session.flush()
    leader_user = UserRole(
        user_id=leader_id,
        role_id=new_project_leader_role.id,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.session.add(leader_user)
    db.session.flush()
    new_project_member_role = Role(
        name="member",
        description=ProjectDefaultRole.MEMBER.value,
        project_id=new_project.id,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.session.add(new_project_member_role)
    db.session.flush()
    member_list = []
    if not isinstance(member_id, int):
        if leader_id not in member_id:
            leader_member = UserRole(
                user_id=leader_id,
                role_id=new_project_member_role.id,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.session.add(leader_member)
            db.session.flush()
    else:
        if leader_id != member_id:
            leader_member = UserRole(
                user_id=leader_id,
                role_id=new_project_member_role.id,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.session.add(leader_member)
            db.session.flush()
    if not isinstance(member_id, int):
        for user_id in member_id:
            new_member = to_dict(User.query.filter_by(id=user_id).first())
            del new_member["password"]
            del new_member["email"]
            del new_member["phone_number"]
            del new_member["description"]
            del new_member["created_at"]
            del new_member["updated_at"]
            new_member["roles"] = "member"
            member_list.append(new_member)
            member = UserRole(
                user_id=user_id,
                role_id=new_project_member_role.id,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.session.add(member)
            db.session.flush()
    else:
        new_member = to_dict(User.query.filter_by(id=member_id).first())
        del new_member["password"]
        del new_member["email"]
        del new_member["phone_number"]
        del new_member["description"]
        del new_member["created_at"]
        del new_member["updated_at"]
        new_member["roles"] = "member"
        member_list.append(new_member)
        member = UserRole(
            user_id=member_id,
            role_id=new_project_member_role.id,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.session.add(member)
        db.session.flush()
    return_project = to_dict(new_project)
    return_project["status"] = return_project["status"].value
    new_leader = to_dict(User.query.filter_by(id=leader_id).first())
    del new_leader["password"]
    del new_leader["email"]
    del new_leader["phone_number"]
    del new_leader["description"]
    del new_leader["created_at"]
    del new_leader["updated_at"]
    return_project["leader"] = new_leader
    return_project["members"] = member_list
    del return_project["workspace_id"]
    del return_project["is_removed"]
    del return_project["remove_date"]
    del return_project["created_at"]
    db.session.commit()
    return _response(200, message="Tạo project thành công", data=return_project)


def make_data_to_respone_user_in_project(user, project):
    data = to_dict(user)
    del data["password"]
    del data["email"]
    del data["phone_number"]
    del data["description"]
    user_roles = (
        db.session.query(Role)
        .join(UserRole, UserRole.role_id == Role.id)
        .filter(UserRole.user_id == user.id, Role.project_id == project.id)
        .all()
    )
    # Chuyển đổi danh sách các role thành list của dictionaries
    data["roles"] = [role.name for role in user_roles]
    return data


def make_data_to_respone(project):
    data = to_dict(project)
    data["status"] = str(data["status"].value)
    del data["workspace_id"]
    del data["is_removed"]
    del data["remove_date"]

    # Lấy tất cả người trong project
    users = (
        db.session.query(User)
        .join(UserRole)
        .join(Role)
        .filter(Role.project_id == project.id)
        .distinct()
        .all()
    )

    members_data = []
    leader_data = None
    for user in users:
        user_dict = make_data_to_respone_user_in_project(user, project)
        if "leader" in user_dict["roles"]:
            leader_data = user_dict
            members_data.append(leader_data)
        else:
            members_data.append(user_dict)

    # Thêm thông tin leader và members vào dữ liệu project
    data["leader"] = leader_data
    data["members"] = members_data

    return data


# Kiểm tra user có phải là Leader của Project không
def is_user_leader(user_id, project_id):
    # Thực hiện join giữa user, user_role, và role để lấy role của user trong project
    user_roles = (
        db.session.query(Role)
        .join(UserRole, UserRole.role_id == Role.id)
        .filter(UserRole.user_id == user_id, Role.project_id == project_id)
        .all()
    )

    return any("ROLE_LEADER" in role.description for role in user_roles)


def edit_project(update_info, permalink):
    curr_project = Project.query.filter_by(permalink=permalink).first()
    if curr_project is None:
        return _response(404, "Không tìm thấy dữ liệu")
    user = request.user

    # Kiểm tra xem người dùng có role là ROLE_LEADER không
    if not is_user_leader(user.id, curr_project.id):
        return _response(403, "Không có quyền chỉnh sửa Project")

    # Cập nhật thông tin project nếu người dùng có quyền
    for key, value in update_info.items():
        setattr(curr_project, key, value)
    curr_project.updated_at = datetime.now(timezone.utc)
    db.session.commit()
    data = make_data_to_respone(curr_project)
    return _response(200, "Cập nhật thành công", data)


def edit_status(status, permalink):
    curr_project = Project.query.filter_by(permalink=permalink).first()
    if curr_project is None:
        return _response(404, "Không tìm thấy dữ liệu")
    user = request.user

    # Kiểm tra xem người dùng có role là ROLE_LEADER không
    if not is_user_leader(user.id, curr_project.id):
        return _response(403, "Không có quyền chỉnh sửa Project")

    # Cập nhật thông tin project nếu người dùng có quyền
    curr_project.status = ProjectStatus[status.upper()]
    curr_project.updated_at = datetime.now(timezone.utc)
    db.session.commit()
    data = make_data_to_respone(curr_project)
    return _response(200, "Cập nhật thành công", data)


def edit_leader(leader_id, permalink):
    curr_project = Project.query.filter_by(permalink=permalink).first()
    if curr_project is None:
        return _response(404, "Không tìm thấy dữ liệu")
    user = request.user

    # Kiểm tra xem người dùng có role là ROLE_LEADER không
    if not is_user_leader(user.id, curr_project.id):
        return _response(403, "Không có quyền chỉnh sửa Project")

    # Kiểm tra xem leader_id có nằm trong project không
    users = (
        db.session.query(User)
        .join(UserRole)
        .join(Role)
        .filter(Role.project_id == curr_project.id)
        .distinct()
        .all()
    )
    users_id = [user.id for user in users]

    if leader_id not in users_id:
        return _response(400, "Id không hợp lệ")

    # Cập nhật thông tin project nếu người dùng có quyền
    # Tìm và xóa role của leader hiện tại
    current_leader = (
        db.session.query(UserRole)
        .join(Role)
        .filter(Role.description == "ROLE_LEADER", Role.project_id == curr_project.id)
        .first()
    )
    if current_leader:
        db.session.delete(current_leader)

    # Thêm ROLE_LEADER cho người dùng mới
    leader_user = UserRole(
        user_id=leader_id,
        role_id=db.session.query(Role.id)
        .filter(Role.description == "ROLE_LEADER", Role.project_id == curr_project.id)
        .scalar(),
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.session.add(leader_user)

    curr_project.updated_at = datetime.now(timezone.utc)
    db.session.commit()
    data = make_data_to_respone(curr_project)
    return _response(200, "Cập nhật thành công", data)


def edit_members(members_id, permalink):
    curr_project = Project.query.filter_by(permalink=permalink).first()
    if curr_project is None:
        return _response(404, "Không tìm thấy dữ liệu")
    user = request.user

    # Kiểm tra xem người dùng có role là ROLE_LEADER không
    if not is_user_leader(user.id, curr_project.id):
        return _response(403, "Không có quyền chỉnh sửa Project")

    # Kiểm tra xem id trong members_id có nằm trong workspace không
    curr_workspace_user = (
        db.session.query(WorkspaceUser)
        .join(Workspace)
        .join(Project)
        .filter(Project.id == curr_project.id)
        .distinct()
        .all()
    )
    users_id = [workspaceuser.user_id for workspaceuser in curr_workspace_user]

    invalid_member_ids = set(members_id) - set(users_id)
    if invalid_member_ids:
        return _response(400, "Một số thành viên không hợp lệ")

    # Kiểm tra nếu leader_id không nằm trong members_id thì báo lỗi
    if any(is_user_leader(user_id, curr_project.id) for user_id in members_id) == False:
        return _response(400, "Không thể xóa leader khỏi project")

    # Cập nhật thông tin project nếu người dùng có quyền
    # Tìm và xóa role của tất cả trừ leader hiện tại
    current_leader = (
        db.session.query(UserRole)
        .join(Role)
        .filter(Role.description == "ROLE_LEADER", Role.project_id == curr_project.id)
        .first()
    )
    all_members_role = UserRole.query.join(Role).filter(
        UserRole.user_id != current_leader.user_id, Role.project_id == curr_project.id
    )
    # Xóa các role của tất cả các thành viên trừ leader hiện tại
    for userrole in all_members_role:
        db.session.delete(userrole)

    # Thêm ROLE cho thành viên mới
    for id in members_id:
        if id != current_leader.user_id:
            new_member = UserRole(
                user_id=id,
                role_id=db.session.query(Role.id)
                .filter(
                    Role.description == "ROLE_MEMBER",
                    Role.project_id == curr_project.id,
                )
                .scalar(),
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.session.add(new_member)

    curr_project.updated_at = datetime.now(timezone.utc)
    db.session.commit()
    data = make_data_to_respone(curr_project)
    return _response(200, "Cập nhật thành công", data)


def delete_project(password, permalink):
    curr_project = Project.query.filter_by(permalink=permalink).first()
    if curr_project is None:
        return _response(404, "Không tìm thấy dữ liệu")
    user = request.user

    # Kiểm tra mật khẩu
    if not bcrypt.check_password_hash(user.password, password):
        return _response(400, "Sai mật khẩu")

    # Kiểm tra người dùng có quyền không
    # Kiểm tra người dùng có phải ADMIN của workspace hoặc có là leader của project không
    user_workspace_role = WorkspaceUser.query.filter_by(user_id=user.id).first()
    if not user_workspace_role.role == WorkspaceRole.ADMIN and not is_user_leader(
        user.id, curr_project.id
    ):
        return _response(403, "Không có quyền xóa project")

    # Xóa Project khỏi Workspace
    db.session.delete(curr_project)

    db.session.commit()
    return _response(200, "Xóa Project thành công")
