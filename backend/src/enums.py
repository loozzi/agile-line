import enum


class ProjectStatus(enum.Enum):
    BACKLOG = "backlog"
    PLANNED = "planned"
    INPROGRESS = "inprogress"
    PAUSED = "paused"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class IssueStatus(enum.Enum):
    BACKLOG = "backlog"
    TODO = "todo"
    INPROGRESS = "inprogress"
    DONE = "done"
    DUPLICATE = "duplicate"
    CANCELLED = "cancelled"


class IssuePriority(enum.Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    URGEN = "urgent"
    NOPRIORITY = "nopriority"


class WorkspaceRole(enum.Enum):
    ADMIN = "admin"
    MEMBER = "member"
    MODERATOR = "moderator"


class ProjectDefaultRole(enum.Enum):
    LEADER = "ROLE_LEADER"
    MEMBER = "ROLE_MEMBER"
