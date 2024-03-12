from math import ceil


def _response(status, message, data=None, error=None):
    return {"status": status, "message": message, "data": data, "error": error}


def _pagination(current_page, total_item, items, limit):
    return {
        "items": items,
        "pagination": {
            "current_page": current_page,
            "count": len(items),
            "total_item": total_item,
            "total_page": ceil(total_item / limit),
        },
    }
