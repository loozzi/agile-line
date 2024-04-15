import os

from dotenv import load_dotenv

load_dotenv()


class EnvConfig:
    def __init__(self) -> None:
        self.SQLALCHEMY_DATABASE_URI = os.environ.get("SQLALCHEMY_DATABASE_URI_TEST")

        self.EMAIL_HOST = os.getenv("EMAIL_HOST")
        self.EMAIL_PORT = int(os.getenv("EMAIL_PORT"))
        self.EMAIL_MAIL = os.getenv("EMAIL_MAIL")
        self.EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

        self.SECRET_KEY = os.getenv("SECRET_KEY")
