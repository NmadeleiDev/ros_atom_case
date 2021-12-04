from typing import Tuple
from db.manager import DbManager
from nn_model_interface.model_func import predict, train
from PIL import Image
import numpy as np
import pickle


model1_file = './tf_model_files/model1'
model2_file = './tf_model_files/model2'
model3_file = './tf_model_files/model3'
model4_file = './tf_model_files/model4'
model5_file = './tf_model_files/model5'
conf_file = './tf_model_files/conf_file'


def get_predict_for_img_array(np_imgs: np.ndarray) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    confs = pickle.load(conf_file)

    label, square, measure, types = predict(
        np_imgs, *confs, model1_file, model2_file, model3_file, model4_file, model5_file)

    return label, square, measure, types


def train_models():
    db = DbManager()
    imgs, labels, ptypes, pareas, lofp = db.get_data_for_training()

    mask_with = labels == 'oil'

    imgs, labels, ptypes, pareas, lofp = imgs, labels, ptypes, pareas.astype(
        'float64', casting='unsafe'), lofp.astype('float64', casting='unsafe')

    c_sq, c_msr, c_data, class_pollution = train(imgs[mask_with], imgs[mask_with == False], pareas[mask_with],
                                                 ptypes[mask_with], lofp[mask_with],
                                                 model1_file, model2_file, model3_file, model4_file, model5_file)

    pickle.dump([c_sq, c_msr, c_data, class_pollution], conf_file)
