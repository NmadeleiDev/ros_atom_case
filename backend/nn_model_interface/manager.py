from typing import Tuple
from nn_model_interface.model_func import predict
from PIL import Image
import numpy as np

def get_predict_for_img(img_path: str) -> Tuple[np.ndarray, str]:
    image = Image.open(img_path)
    np_img = np.array(image)

    model1_path = './tf_model_files/model'
    model2_path = './tf_model_files/classifier'

    res = predict([np_img], model1_path, model2_path)

    if len(res) > 0:
        return res[0][0], 'oil_spill'
    else:
        return None, 'clear'

