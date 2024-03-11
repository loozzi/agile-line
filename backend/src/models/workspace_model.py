import datetime

from sqlalchemy import TIMESTAMP, Boolean, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from src import db


class Workspace(db.Model):
    __tablename__ = "workspace"
    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, nullable=False, autoincrement=True
    )
    title: Mapped[str] = mapped_column(String(1024), nullable=False)
    logo: Mapped[str] = mapped_column(String(1024), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    permalink: Mapped[str] = mapped_column(String(256), nullable=False, unique=True)
    is_private: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime.datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=func.current_timestamp()
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        TIMESTAMP(timezone=True), onupdate=func.current_timestamp()
    )
