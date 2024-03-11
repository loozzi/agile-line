import datetime

from sqlalchemy import TIMESTAMP, ForeignKey, Integer, PrimaryKeyConstraint
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from src import db


class IssueLabel(db.Model):
    __tablename__ = "issue_label"
    issue_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("issue.id", ondelete="CASCADE"),
        nullable=False,
    )
    label_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("label.id", ondelete="CASCADE"),
        nullable=False,
    )
    created_at: Mapped[datetime.datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=func.current_timestamp()
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        TIMESTAMP(timezone=True), onupdate=func.current_timestamp()
    )

    __tableargs__ = (PrimaryKeyConstraint(issue_id, label_id), {})
