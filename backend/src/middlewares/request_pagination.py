from flask import request
from functools import wraps


def request_pagination(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        page = 1
        limit = 10
        try:
            page = request.args.get("page").strip()
            if page.isnumeric():
                page = int(page)
            else:
                page = 1
        except TypeError:
            page = 1
        try:
            limit = request.args.get("limit").strip()
            if limit.isnumeric():
                limit = int(limit)
            else:
                limit = 10
        except TypeError:
            limit = 10
        pagination = {"page": max(page, 1), "limit": max(min(limit, 10, 1))}
        request.pagination = pagination
        return f(*args, **kwargs)

    return decorated
