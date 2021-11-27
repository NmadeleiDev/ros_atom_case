
from logging import error
from typing import Union

from api.model import DefaultResponseModel


def success_response(msg: dict = {}) -> DefaultResponseModel[dict]:
    resp = DefaultResponseModel[dict](data=msg, status=True)
    return resp

def error_response(msg: Union[str, None] = None) -> DefaultResponseModel[dict]:
    resp = DefaultResponseModel[dict](error=msg, status=False)
    return resp


