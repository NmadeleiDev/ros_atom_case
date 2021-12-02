#библиотечки

import numpy as np
import tensorflow as tf
from skimage.transform import resize
from tensorflow.keras.models import load_model
from PIL import Image
from math import radians, cos, sin, asin, sqrt, pi
import tensorflow.keras.backend as K


#используемые функции
def my_loss(y_true, y_pred):
    return K.mean(-1 * K.log(1 - abs(y_pred - y_true)) * (1 + 10*y_true))

def new_loss(y_true, y_pred):
        return -1*K.mean(K.log(1-abs(y_pred - y_true)) * tf.convert_to_tensor([1., 3.]) * (0.33 + y_true))
    
def haversine(lon1, lat1, lon2, lat2):#дистанция в метрах
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    """
    # convert decimal degrees to radians 
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

    # haversine formula 
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a)) 
    r = 6371 # Radius of earth in kilometers. Use 3956 for miles
    return c * r * 1000

#принимает данные для прогноза и метаданные, загружает модель, выдает прогноз
def predict(X_, filepath, filepath_classifier):
    X = np.array([resize(i, (256, 256)) for i in X_]).reshape((-1, 256, 256, 3))
    model = load_model(filepath, custom_objects={'my_loss': my_loss})
    classifier = load_model(filepath_classifier, custom_objects={'new_loss': new_loss})
    mask = np.concatenate([model(i.reshape(-1, 256, 256, 3)) for i in X])
    target = np.array([np.argmax(classifier(i.reshape(-1, 256, 256, 1)).numpy().reshape(-1,)) for i in mask])
    
    troubles = []
    for i in range(target.shape[0]):
        if target[i] == 1:
            img = Image.fromarray(np.uint8(X_[i] * 255), mode = 'RGB')
            temp = resize(mask[i], (X_[i].shape[0], X_[i].shape[1]))
            img = img.convert('RGBA') # Изменить цветовой канал на RGBA
            x, y = img.size # Получить длину и ширину
            
            # Установить прозрачность цвета каждого пикселя
            for j in range(x):
                for k in range(y):
                    color = img.getpixel((j, k))
                    color = color[:-1] + (int(50 + 205*temp[k][j]), )
                    img.putpixel((j, k), color)
            troubles.append([np.array(img), i])
            
            
    return troubles