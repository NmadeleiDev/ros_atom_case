import logging
import os
from os import path
from typing import Tuple
import random
from uuid import uuid1

from db.manager import DbManager

IMGS_DIR = '/service_data/images'
i_path = lambda x='': path.join(IMGS_DIR, x)

def import_data_on_fs_to_db(db: DbManager):
    random.seed()
    files = os.listdir(IMGS_DIR)
    for name in files:
        img_id = name.split('.')[0]

        db.insert_record(img_file_id=img_id, lat=random.random() * 180 - 90, lon=random.random() * 360 - 180)
    logging.debug("Imported {} files".format(len(files)))
    
def get_img_path_by_id(img_id: str, format: str) -> Tuple[str, bool]:
    pa = i_path(f'{str(img_id)}.{format}')
    return pa, path.isfile(pa)

def load_img_by_id(img_id: str) -> Tuple[str, bool]:
    pa = i_path(f'{str(img_id)}.{format}')
    if path.isfile(pa):
        with open(pa, 'r') as f:
            data = f.read()
        return data, True
    else:
        return '', False

def save_img(image, name:str) -> Tuple[str, bool]:
    img_id = str(uuid1().hex())
    img_name = '{}.{}'.format(img_id, name.split('.')[-1])
    img_path = i_path(img_name)
    try:
        with open(img_path, 'w') as f:
            f.write(image)
    except Exception as e:
        logging.error("Failed to save file: {}".format(e))
        return '', False
    return img_id, True

