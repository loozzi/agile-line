import datetime

from sqlalchemy import (
    TIMESTAMP,
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from src import db
from src.enums import ProjectStatus


class Project(db.Model):
    __tablename__ = "project"
    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True, nullable=False
    )
    workspace_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("workspace.id", ondelete="CASCADE"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(1024), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    icon: Mapped[str] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(Enum(ProjectStatus), nullable=False)
    start_date: Mapped[datetime.date] = mapped_column(DateTime, nullable=True)
    end_date: Mapped[datetime.date] = mapped_column(DateTime, nullable=True)
    permalink: Mapped[str] = mapped_column(String(256), nullable=False, unique=True)
    is_removed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    remove_date: Mapped[datetime.date] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime.datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=func.current_timestamp()
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        TIMESTAMP(timezone=True), onupdate=func.current_timestamp()
    )
