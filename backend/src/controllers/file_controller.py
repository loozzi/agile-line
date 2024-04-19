import requests
from flask import Blueprint, request
from src.middlewares.login_required import token_required
from src.utils import _response

fileRoute = Blueprint("file", __name__)


@fileRoute.route("/upload", methods=["POST"])
@token_required
def upload():
    return "upload"


@fileRoute.route("/image", methods=["POST"])
@token_required
def uploadImage():
    file = request.files.get("image")
    if not file:
        return _response(400, "Vui lòng chọn file")
    try:
        resp = requests.post(
            "https://api.imgur.com/3/image",
            files={"image": file},
            headers={"Authorization": "Client-ID 3ec457715d562c5 "},
        )
        if resp.status_code != 200:
            return _response(500, "Thất bại", error=resp.json()["data"])

        return _response(200, "Upload thành công", resp.json()["data"])
    except Exception as e:
        return _response(500, "Thất bại", error=e)
