import logging
from os import path, stat
import os
from fastapi import FastAPI, Response, status, UploadFile, File
import pandas as pd
import numpy as np
from starlette.responses import FileResponse, StreamingResponse

from db.manager import DbManager
from files_manager.files import get_img_path_by_id
from .utils import *
from .model import *
from files_manager.files import save_img
from PIL import Image
import io


def apply_handlers(app: FastAPI, db: DbManager):
    @app.get("/test", status_code=200, response_model=DefaultResponseModel[dict], include_in_schema=False)
    def test_handler():
        return success_response({'result': 'ok'})

    @app.get("/records", status_code=status.HTTP_200_OK, response_model=DefaultResponseModel[List[LocationData]])
    def get_records(response: Response):
        """
        Возвращает список последних записей по каждому квадрату
        """
        records, ok = db.get_records()
        if ok is False:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return error_response('failed to get records')
        return success_response(records)

    @app.get("/img/{id}", status_code=status.HTTP_200_OK)
    def get_records(id: int, response: Response):
        """
        Возвращает список последних записей по каждому квадрату
        """
        img = db.get_image(id)
        logging.info("shape={}, img={}".format(img.shape, img))
        return Response(content=Image.fromarray((img[:, :, 1:4] * 255/img[:, :, 1:4].max()).astype('uint8')).tobytes(), media_type="image/png")

    @app.post("/parse", status_code=status.HTTP_200_OK, response_model=DefaultResponseModel[dict])
    def create_parsing_task(body: ParsingTask, response: Response):
        """
        Создание запроса на парсинг
        """
        ok = db.create_parsing_task(
            body.northWest.lat, body.northWest.lon, body.southEast.lat, body.southEast.lon)
        if ok is False:
            response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            return error_response('failed to create parsing task')
        return success_response()
