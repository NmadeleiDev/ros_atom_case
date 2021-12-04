from datetime import datetime
import os
from os import path
from typing import List
import zipfile
import tempfile
import gzip
import pickle
from db.manager import DbManager
import pandas as pd
import logging
import glob
import numpy as np
from nn_model_interface.manager import train_models, get_predict_for_img_array


class DataInitializer():
    def __init__(self) -> None:
        self.db = DbManager()
        self.regular_data = '/raw_data/all_data'
        self.spills_data = '/raw_data/spills'

        self.locs_data = pd.read_excel('/reestr.xlsx')

        self.locs_data.rename(
            columns=lambda x: x.strip().replace('  ', ' '), inplace=True)
        self.locs_data.drop_duplicates(
            subset=['Регистрационный номер загрязненного участка в Реестре'])
        self.locs_data.set_index(
            'Регистрационный номер загрязненного участка в Реестре', inplace=True)

        num_fields = ['Уровень загрязнения почв и земель нефтью, нефтепродуктами, мг/кг',
                      'Площадь загрязненного участка, га']

        self.locs_data[num_fields] = self.locs_data[num_fields].apply(
            pd.to_numeric, errors='coerce').fillna(0)

        date_fields = ['Дата факта последнего разлива',
                       'Дата регистрации в Реестре']
        self.locs_data[date_fields] = self.locs_data[date_fields].apply(
            pd.to_datetime, errors='coerce').fillna(datetime.now())

    def parse_folder(self, dir_name: str, searched_ending='') -> List[str]:
        result = []
        for f in os.scandir(dir_name):
            if f.is_file():
                if f.name.endswith(searched_ending):
                    result.append(f.path)
            elif f.is_dir():
                result.extend(self.parse_folder(f.path))
        return result

    def process_location_dir(self, dir_path, class_id_known='', is_from_target: bool = False):
        loc_name = path.basename(dir_path)
        if loc_name in self.locs_data.index:
            location_name = loc_name
            loc_info = self.locs_data.loc[loc_name]

            polution_type = loc_info['Вид приоритетного загрязняющего вещества']
            area_m = loc_info['Площадь загрязненного участка, га']
            level_of_polution = loc_info['Уровень загрязнения почв и земель нефтью, нефтепродуктами, мг/кг']

            company = loc_info['Предприятие']
            license_area = loc_info['Лицензионный участок']
            poluted_area_reg_n = loc_info[
                'Регистрационный номер загрязненного участка (предприятия)']
            location_of_poluted_area = loc_info['Местоположение загрязненного участка']
            adm_region = loc_info['Административный район']
            last_spill_date = loc_info['Дата факта последнего разлива']
            region_category = loc_info['Категория земель до загрязнения']
            have_special_zones = loc_info['Наличие специальных защитных зон']
        else:
            location_name = None
            polution_type = None
            area_m = None
            level_of_polution = None
            company = None
            license_area = None
            poluted_area_reg_n = None
            location_of_poluted_area = None
            adm_region = None
            last_spill_date = None
            region_category = None
            have_special_zones = None

            logging.warn("loc_name={} not in index".format(loc_name))
        logging.info("Parsing {}".format(loc_name))

        conts = self.parse_folder(path.join(dir_path, 'data'))
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

        img_contents = np.load(gzip.GzipFile(npy_file_path))

        logging.info("Img shape: {}".format(img_contents.shape))
        if img_contents.shape[-1] != 13:
            return

        bbox = list(bbox_content)
        for ts, img_cont in zip(ts_content, img_contents):
            # logging.info("Args: {}".format([ts, bbox, img_cont, '', polution_type, area_m, level_of_polution, company, license_area,
            #                                 poluted_area_reg_n, location_of_poluted_area, adm_region, last_spill_date, region_category, location_name, have_special_zones]))

            self.db.insert_sent_img_data(ts, bbox, '', img_cont, class_id_known, polution_type, area_m, level_of_polution,
                                         company, license_area, poluted_area_reg_n, location_of_poluted_area,
                                         adm_region, last_spill_date, region_category, location_name, have_special_zones, is_from_target)

    def unzip_target_ar(self, f_path: str):
        save_dir = tempfile.TemporaryDirectory()

        with zipfile.ZipFile(f_path, 'r') as zip_ref:
            zipinfos = zip_ref.infolist()

            for zipinfo in zipinfos:
                zipinfo.filename = zipinfo.filename.encode(
                    'cp437').decode('cp866')

                zip_ref.extract(zipinfo, save_dir.name)

        logging.info("Extracted {} to dir {}, content: {}".format(
            f_path, save_dir.name, os.listdir(save_dir.name)))

        for f in os.scandir(save_dir.name):
            if f.is_dir():
                for loc_dir in os.scandir(f.path):
                    if loc_dir.is_dir():
                        try:
                            self.process_location_dir(loc_dir.path, 'oil')
                        except Exception as e:
                            logging.error(
                                "Error reading location info: {}".format(e))

        save_dir.cleanup()

    def unzip_reg_ar(self, f_path: str):
        loc_dir_glop_pattern = "*/*/*/*/*/*"

        save_dir = tempfile.TemporaryDirectory()

        with zipfile.ZipFile(f_path, 'r') as zip_ref:
            zip_ref.extractall(save_dir.name)

        loc_dir_glop_pattern = path.join(save_dir.name, "*/*/*/*/*/*")

        logging.info("Extracted {} to dir {}, content: {}, glob_search: {}".format(
            f_path, save_dir.name, os.listdir(save_dir.name), glob.glob(loc_dir_glop_pattern)))

        for n in glob.glob(loc_dir_glop_pattern):
            self.process_location_dir(n)

        save_dir.cleanup()

    def parse_data(self):
        logging.info("Started data initialization")

        target_data = self.parse_folder(self.spills_data, '.zip')
        reg_data = self.parse_folder(self.regular_data, '.zip')

        logging.info("target_data: {}".format(target_data))
        for n in target_data[:1]:
            self.unzip_target_ar(f_path=n)

        # logging.info("Reg_data: {}".format(reg_data))
        # for n in reg_data[:1]:
        #     self.unzip_reg_ar(f_path=n)

        if os.getenv('DO_RETRAIN') == '1':
            train_models()

        np_imgs, ids = self.db.get_not_processed_data()

        labels, squares, measures, types = get_predict_for_img_array(np_imgs)

        for label, square, measure, type, id in zip(labels, squares, measures, types, ids):
            self.db.save_predicted_data(label, type, square, measure, id)
