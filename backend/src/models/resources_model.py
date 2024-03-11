import datetime

from sqlalchemy import TIMESTAMP, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from src import db


class Resources(db.Model):
    __tablename__ = "resources"
    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, nullable=False, autoincrement=True
    )
    issue_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("issue.id", ondelete="CASCADE"), nullable=False
    )
    link: Mapped[str] = mapped_column(String(1024), nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=func.current_timestamp()
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        TIMESTAMP(timezone=True), onupdate=func.current_timestamp()
    )
