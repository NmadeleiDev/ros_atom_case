import os
import numpy as np
from tensorflow import keras
import pandas as pd
import tensorflow as tf
from tensorflow.keras.layers import Dense, Flatten, Input, Lambda, Add, Multiply, Conv3D, BatchNormalization, Softmax
from tensorflow.keras.layers import LeakyReLU, Dropout, Attention, Concatenate, LSTM, Conv2D, Reshape, MaxPool2D, Activation
from tensorflow.keras.utils import to_categorical
from sklearn.utils import shuffle
from tensorflow.keras import optimizers
import tensorflow.keras.backend as K
from tensorflow.keras import regularizers
from skimage.transform import resize
from skimage import io
from tensorflow.keras import activations
from tensorflow.keras.models import load_model
from math import radians, cos, sin, asin, sqrt, pi
from PIL import Image
import gzip
import pickle
from sklearn.preprocessing import OneHotEncoder


def my_loss(y_true, y_pred):
    return K.mean(-1 * K.log(1 - abs(y_pred - y_true)))

# X_with - массив картинок с разливами, X_without - без разливов


def prep(X_with, X_without, squares, type_pollution, measure_pollution):

    nan_sq = ~np.isnan(squares)
    nan_tp = np.array([True if i in ['нефть', 'водонефтяная эмульсия', 'Нефть, нефтепродукты',
                                     'Вода подтоварная', 'газовый конденсат', 'нефтепродукты',
                                     'подтоварная вода', 'вмж', 'ВНЭ', 'газовая смесь',
                                     'нефтяная эмульсия', 'Нефть', 'Подтоварная вода',
                                     'нефтесодержащая жидкость', 'газоводонефтяная эмульсия',
                                     'Нефтяная эмульсия', 'нефть, нефтепродукты',
                                     'нефтегазожидкостная смесь ', 'вода промысловая сточная'] else False for i in type_pollution])
    nan_mp = ~np.isnan(measure_pollution)

    squares = squares[nan_sq]
    type_pollution = type_pollution[nan_tp]
    measure_pollution = measure_pollution[nan_mp]

    X_sq = X_with[nan_sq]
    X_tp = X_with[nan_tp]
    X_mp = X_with[nan_mp]

    target_ = np.concatenate(
        [np.ones(len(X_with),), np.zeros(len(X_without),)])
    target = to_categorical(target_)
    data = np.concatenate([np.array(X_with), np.array(X_without)])
    data, target = shuffle(data, target)
    c_data = np.max(data)
    data /= c_data
    c_sq = np.max(squares)
    c_msr = np.max(measure_pollution)
    squares /= c_sq
    measure_pollution /= c_msr
    enc = OneHotEncoder()
    enc.fit(np.array(type_pollution).reshape(-1, 1))
    type_pollution_ = enc.transform(type_pollution.reshape(-1, 1)).toarray()
    class_pollution = {np.argmax(
        type_pollution_[i]): type_pollution[i] for i in range(len(type_pollution))}
    return data, target, squares, class_pollution, measure_pollution, c_sq, c_msr, c_data, X_sq, X_tp, X_mp, type_pollution_
    # возвращает данные для обучения и таргеты


# X_with - массив картинок с разливами, X_without - без разливов,
# squares - массив площадей разливов для разливов (по площадям надо еще созвониться)
def train(X_with, X_without, squares, type_pollution, measure_pollution, file_feat, file_recogner, file_reg, file_reg_pol, file_class_pol):

    data, target, squares, class_pollution, measure_pollution, c_sq, c_msr, c_data, X_sq, X_tp, X_mp, type_pollution_ = prep(
        X_with, X_without, squares, type_pollution, measure_pollution)

    inp = Input((64, 64, 13))
    x1 = Conv2D(64, (7, 7), activation='relu', padding='same')(inp)
    x = BatchNormalization()(x1)
    #x = MaxPool3D(pool_size = (1, 2, 2))(x)
    x = Dropout(0.1)(x)

    x2 = Conv2D(128, (5, 5), activation='relu', padding='same')(x)
    x = BatchNormalization()(x2)
    x = MaxPool2D(pool_size=(2, 2))(x)
    x = Dropout(0.1)(x)

    x3 = Conv2D(128, (5, 5), activation='relu', padding='same')(x)
    x = BatchNormalization()(x3)
    #x = MaxPool3D(pool_size = (1, 2, 2))(x)
    x = Dropout(0.1)(x)

    x4 = Conv2D(256, (3, 3), activation='relu', padding='same')(x)
    x = BatchNormalization()(x4)
    x = MaxPool2D(pool_size=(2, 2))(x)
    x = Dropout(0.1)(x)

    x5 = Conv2D(256, (3, 3), activation='relu', padding='same')(x)
    x = BatchNormalization()(x5)
    #x = MaxPool3D(pool_size = (1, 2, 2))(x)
    x = Dropout(0.1)(x)

    x6 = Conv2D(512, (3, 3), activation='relu', padding='same')(x)
    x = BatchNormalization()(x6)
    x = MaxPool2D(pool_size=(2, 2))(x)
    x7 = Dropout(0.1)(x)

    x7 = Conv2D(8, (3, 3), activation='relu', padding='same')(x)
    x = BatchNormalization()(x7)
    #x = MaxPool2D(pool_size = (2, 2))(x)
    x8 = Dropout(0.1)(x)

    o = Flatten()(x8)
    out = Dense(2, activation='softmax')(o)

    feat = keras.Model(inp, o)
    recogner = keras.Model(inp, out)
    recogner.compile(optimizer=keras.optimizers.Adam(
        3e-4), loss=my_loss, metrics=['accuracy'])

    inp1 = Input((o.shape[1], ))
    x = Dense(20, activation='relu')(inp1)
    x = BatchNormalization()(x)
    x = Dropout(0.4)(x)
    out1 = Dense(1, activation='relu')(x)

    reg = keras.Model(inp1, out1)
    reg.compile(optimizer=keras.optimizers.Adam(3e-4), loss='mse')

    inp2 = Input((o.shape[1], ))
    x = Dense(20, activation='relu')(inp2)
    x = BatchNormalization()(x)
    x = Dropout(0.4)(x)
    out2 = Dense(1, activation='relu')(x)

    reg_pol = keras.Model(inp2, out2)
    reg_pol.compile(optimizer=keras.optimizers.Adam(3e-4), loss='mse')

    inp3 = Input((o.shape[1], ))
    out3 = Dense(len(type_pollution_[0]), activation='softmax')(inp3)

    class_pol = keras.Model(inp3, out3)
    class_pol.compile(optimizer=keras.optimizers.Adam(3e-4),
                      loss=my_loss, metrics=['accuracy'])

    # конец модели

    recogner.fit(data, target, epochs=10, batch_size=25)
    features = np.concatenate(
        [feat(i.reshape((-1, 64, 64, 13))) for i in X_sq])
    features_tp = np.concatenate(
        [feat(i.reshape((-1, 64, 64, 13))) for i in X_tp])
    features_mp = np.concatenate(
        [feat(i.reshape((-1, 64, 64, 13))) for i in X_mp])
    reg.fit(features, squares, epochs=10, batch_size=25)
    reg_pol.fit(features_mp, measure_pollution, epochs=10, batch_size=25)
    class_pol.fit(features_tp, type_pollution_, epochs=10, batch_size=25)
    feat.save(file_feat)
    recogner.save(file_recogner)
    reg.save(file_reg)
    reg_pol.save(file_reg_pol)
    class_pol.save(file_class_pol)

    return c_sq, c_msr, c_data, class_pollution


def predict(X, c_sq, c_msr, c_data, class_pollution, file_feat, file_recogner, file_reg, file_reg_pol, file_class_pol):
    feat = load_model(file_feat)
    recogner = load_model(file_recogner, custom_objects={'my_loss': my_loss})
    reg = load_model(file_reg)
    reg_pol = load_model(file_reg_pol)
    class_pol = load_model(file_class_pol, custom_objects={'my_loss': my_loss})
    X /= c_data
    label = [np.argmax(recogner.predict(i.reshape((-1, 64, 64, 13))))
             for i in X]
    f = [feat(i.reshape((-1, 64, 64, 13))) for i in X]
    square = np.concatenate([reg.predict(i) * c_sq for i in f]).reshape(-1,)
    measure = np.concatenate(
        [reg_pol.predict(i) * c_msr for i in f]).reshape(-1,)
    types = np.array(
        [class_pollution[np.argmax(class_pol.predict(i))] for i in f])
    return label, square, measure, types
