import os
from os import path
from multiprocessing import Pool
from typing import List
import zipfile
import tempfile
import gzip
import pickle


def parse_folder(dir_name: str, searched_ending='') -> List[str]:
    result = []
    for f in os.scandir(dir_name):
        if f.is_file():
            if f.name.endswith(searched_ending):
                result.append(f.path)
        elif f.is_dir():
            result.extend(parse_folder(f.path))
    return result


def process_location_dir(dir_path):
    pass


def unzip_ar(f_path: str, npy_dest: str):
    img_f_name = 'L2A.npy.gz'

    save_dir = tempfile.TemporaryDirectory()

    with zipfile.ZipFile(f_path, 'r') as zip_ref:
        zip_ref.extractall(save_dir.name)

    conts = parse_folder(save_dir.name)
    npy_file_path = [x for x in conts if x.endswith('.npy.gz')]
    if len(npy_file_path) != 1:
        return
    npy_file_path = npy_file_path[0]

    bbox_path = path.join(save_dir.name, 'bbox.pkl.gz')
    ts_path = path.join(save_dir.name, 'timestamp.pkl.gz')

    with gzip.open(bbox_path, 'rb') as f:
        bbox_content = pickle.loads(f.read())

    with gzip.open(ts_path, 'rb') as f:
        ts_content = pickle.loads(f.read())

    with gzip.open(npy_file_path, 'rb') as f:
        img_contents = f.read()


def parse_data():
    all_data = '/raw_data/all_data'
    spills_data = '/raw_data/spills'
    npy_files_dest = '/image_npy'

    parse_folder(spills_data, '.zip')
    reg_data = parse_folder(all_data, '.zip')
    # print(parse_folder('/home/greg/Yandex.Disk/Загрузки/'))

    with Pool(8) as p:
        print(p.map(f, [1, 2, 3]))


parse_data()
