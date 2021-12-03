import os
from os import path
from multiprocessing import Pool
from typing import List
import zipfile
import tempfile
import gzip
import pickle
from db.manager import DbManager
import pandas as pd
import logging


class DataInitializer:
    def __call__(self) -> None:
        self.db = DbManager()
        self.all_data = '/raw_data/all_data'
        self.spills_data = '/raw_data/spills'
        self.npy_files_dest = '/image_npy'

        self.locs_data = pd.read_excel('/reestr.xlsx')

        self.locs_data.drop_duplicates(subset=[''])
        self.locs_data.rename(columns=lambda x: x.strip().replace('  ', ' '), inplace=True)
        self.locs_data.set_index('')

    def parse_folder(self, dir_name: str, searched_ending='') -> List[str]:
        result = []
        for f in os.scandir(dir_name):
            if f.is_file():
                if f.name.endswith(searched_ending):
                    result.append(f.path)
            elif f.is_dir():
                result.extend(self.parse_folder(f.path))
        return result

    def process_location_dir(self, dir_path):

        loc_name = path.basename(dir_path)
        if loc_name not in self.locs_data.index:
            logging.warn("loc_name={} not in index".format(loc_name))
            return

        loc_info = self.locs_data.loc[loc_name]
        # hhh
        location_name = loc_name

        polution_type = loc_info['Вид приоритетного загрязняющего вещества']
        area_m = loc_info['Площадь загрязненного участка, га']
        level_of_polution = loc_info['Уровень загрязнения почв и земель нефтью, нефтепродуктами, мг/кг']

        company = loc_info['Предприятие']
        license_area = loc_info['Лицензионный участок']
        poluted_area_reg_n = loc_info['Регистрационный номер загрязненного участка(предприятия)']
        location_of_poluted_area = loc_info['Местоположение загрязненного участка']
        adm_region = loc_info['Административный район']
        last_spill_date = loc_info['Дата факта последнего разлива']
        region_category = loc_info['Категория земель до загрязнения']
        have_special_zones = loc_info['Наличие специальных защитных зон']

        conts = self.parse_folder(dir_path)
        npy_file_path = [x for x in conts if x.endswith('.npy.gz')]
        if len(npy_file_path) != 1:
            return
        npy_file_path = npy_file_path[0]

        bbox_path = path.join(dir_path, 'bbox.pkl.gz')
        ts_path = path.join(dir_path, 'timestamp.pkl.gz')

        with gzip.open(bbox_path, 'rb') as f:
            bbox_content = pickle.loads(f.read())

        with gzip.open(ts_path, 'rb') as f:
            ts_content = pickle.loads(f.read())

        with gzip.open(npy_file_path, 'rb') as f:
            img_contents = pickle.load(f.read())

        for bbox, ts, img_cont in zip(bbox_content, ts_content, img_contents):
            self.db.insert_sent_img_data(ts, bbox[0], bbox[1], img_cont, '', polution_type, area_m, level_of_polution, company, license_area, poluted_area_reg_n, location_of_poluted_area, adm_region, last_spill_date, region_category, location_name, have_special_zones)

    def unzip_ar(self, f_path: str):
        save_dir = tempfile.TemporaryDirectory()

        with zipfile.ZipFile(f_path, 'r') as zip_ref:
            zip_ref.extractall(save_dir.name)

        for f in os.scandir(save_dir.name):
            if f.is_dir():
                for loc_dir in os.scandir(f.path):
                    if loc_dir.is_dir():
                        self.process_location_dir(loc_dir.path)

        save_dir.cleanup()

    def parse_data(self):
        target_data = self.parse_folder(self.spills_data, '.zip')
        reg_data = self.parse_folder(self.all_data, '.zip')

        for n in reg_data:
            self.unzip_ar(f_path=n)
