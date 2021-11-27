import logging
from os import path, stat
import os
from fastapi import FastAPI, Response, status
import pandas as pd
import numpy as np
from starlette.responses import FileResponse

from db.manager import DbManager
from files_manager.files import get_img_path_by_id
from .utils import *
from .model import *


def apply_handlers(app: FastAPI, db: DbManager):
    @app.get("/test", status_code=200, response_model=DefaultResponseModel[dict], include_in_schema=False)
    def test_handler():
        return success_response({'result': 'ok'})

    @app.get("/records", status_code=status.HTTP_200_OK, response_model=DefaultResponseModel[list])
    def get_services(response: Response):
        """
        Возвращает список записей с id и данными фотографии
        """
        records, ok = db.get_records()
        if ok is False:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return error_response('failed to get records')
        return success_response(records)

    @app.get("/img/{img_id}", status_code=status.HTTP_200_OK)
    def get_services(response: Response, img_id: str):
        """
        Загрузка фотографии
        """
        img_path, ok = get_img_path_by_id(img_id)

        if ok:
            return FileResponse(img_path)
        else:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return error_response('img not found')
