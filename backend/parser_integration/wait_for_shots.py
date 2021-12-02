import logging
from typing import Tuple
from db.manager import DbManager
from files_manager.files import get_img_path_by_id
from nn_model_interface.manager import get_predict_for_img
from PIL import Image
from os import path

def execute_model(img_path: str) -> Tuple[any, str, bool]:
    img_arr, class_id = get_predict_for_img(img_path)
    if class_id != 'clear':
        img_pil = Image.fromarray(img_arr)
        parts = img_path.split('.')
        mask_path = '.'.join(parts[:-1]) + '_mask' + parts[-1]
        img_pil.save(mask_path)
    else:
        mask_path = None
    return mask_path, class_id, True

def new_shot_callback(record_id: int, img_name: str, img_format: str, db: DbManager = None):
    pa, ok = get_img_path_by_id(img_name, img_format)
    if not ok:
        logging.error(f"Image not found: {img_name} {img_format}")

    mask_path, class_id, ok = execute_model(pa)
    if not ok:
        return

    if db is not None:
        if mask_path is not None:
            db.set_record_class_id_and_mask(record_id, class_id, path.basename(mask_path))
        else:
            db.set_record_class_id(record_id, class_id)


def start_waiting():
    db = DbManager()
    db.listen_for_new_image_id(new_shot_callback)