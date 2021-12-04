from datetime import datetime
import os
import logging
import pickle
from typing import List, Tuple
import psycopg2
import psycopg2.extensions
from db.table_queries import *
import asyncio
import numpy as np
import pandas as pd
from db.utils import *


class DbManager():
    def __init__(self) -> None:
        self.db_name = os.getenv('POSTGRES_DB')
        self.host = os.getenv('POSTGRES_HOST')
        self.port = int(os.getenv('POSTGRES_PORT', '5432'))
        self.user = os.getenv('POSTGRES_USER')
        self.password = os.getenv('POSTGRES_PASSWORD')

        try:
            logging.info("Establishing db connection... {}".format(
                (self.db_name, self.user, self.password, self.host, self.port)))
            self.conn = psycopg2.connect(
                database=self.db_name, user=self.user, password=self.password, host=self.host, port=self.port)
        except Exception as e:
            logging.fatal("Failed to connect to db: {}".format(e))
            exit(1)

        self.conn.set_isolation_level(
            psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT)
        self.conn.autocommit = True
        logging.info("Connected to db")

    def cursor_wrapper(f):
        def db_fn(self, *args, **kwargs):
            cursor = self.conn.cursor()
            res = f(self, *args, **kwargs, cursor=cursor)
            cursor.close()
            return res
        return db_fn

    @cursor_wrapper
    def create_tables(self, cursor=None):
        cursor.execute(schema_create_query)
        cursor.execute(sent_imgs_table)
        logging.debug("Tables created")

    @cursor_wrapper
    def get_records(self, offset=0, class_filter: List[str] = None, cursor=None) -> Tuple[List[dict], bool]:
        query = """SELECT id, shoot_ts, lat, lon,
                        class_id, polution_type, area_meters, level_of_pol, company, license_area, 
                        poluted_area_reg_n, location_of_poluted_area, adm_region, last_spill_date, 
                        region_category, location_name, have_special_zones FROM rosatom_case.sentinel_images 
                        WHERE class_id != ''
                        ORDER_BY shoot_ts DESC
                        OFFSET %s LIMIT 500"""

        try:
            if class_filter is not None:
                query += "WHERE class_id IN %s"
                cursor.execute(query, (offset, class_filter))
            else:
                cursor.execute(query, (offset, ))

            result = cursor.fetchall()

            colnames = ['id', 'shoot_ts', 'lat', 'lng',
                        'class_id', 'polution_type', 'area_meters', 'level_of_pol', 'company', 'license_area',
                        'poluted_area_reg_n', 'location_of_poluted_area', 'adm_region', 'last_spill_date',
                        'region_category', 'location_name', 'have_special_zones']

            return [dict(zip(colnames, x)) for x in result], True
        except Exception as e:
            logging.error("Failed get record data: {}".format(e))
            return [], False

    @cursor_wrapper
    def get_image(self, id: int, cursor=None) -> np.ndarray:
        query = """SELECT npy_img_bytes FROM rosatom_case.sentinel_images WHERE id=%s"""

        cursor.execute(query, (id, ))

        imgs_bytes = cursor.fetchall()

        if len(imgs_bytes) < 1:
            return None
        else:
            return pickle.loads(imgs_bytes[0][0])

    @cursor_wrapper
    def get_data_for_training(self, cursor=None) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
        query = """SELECT npy_img_bytes, class_id, polution_type, area_meters, level_of_pol FROM rosatom_case.sentinel_images"""

        cursor.execute(query)

        data = cursor.fetchall()
        imgs, labels, ptypes, pareas, lofp = zip(*data)
        return np.stack([pickle.loads(x) for x in imgs], axis=0), np.array(labels), np.array(ptypes), np.array(pareas), np.array(lofp)

    @cursor_wrapper
    def get_not_processed_data(self, cursor=None) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
        query = """SELECT npy_img_bytes, id FROM rosatom_case.sentinel_images WHERE is_processed = false AND class_id = ''"""

        cursor.execute(query)

        data = cursor.fetchall()
        imgs, ids = zip(*data)
        return np.stack([pickle.loads(x) for x in imgs], axis=0), list(ids)

    @cursor_wrapper
    def save_predicted_data(self, labels, ptypes, pareas, lofp, id, cursor=None):
        query = """UPDATE rosatom_case.sentinel_images 
                SET (class_id, polution_type, area_meters, level_of_pol, is_processed) = (%s,%s,%s,%s,%s)
                WHERE id=%s"""

        cursor.execute(query, (labels, ptypes, pareas, lofp, True, id))

    @cursor_wrapper
    def listen_for_new_image_id(self, callback=None, cursor=None):
        def handle_notify():
            logging.debug("Pulling log")
            self.conn.poll()
            for notify in self.conn.notifies:
                callback(*(notify.payload.split(',')), db=self)
                logging.debug("Got NOTIFY: {}, {}, {}".format(
                    notify.pid, notify.channel, notify.payload))

            self.conn.notifies.clear()

        cursor.execute("LISTEN new_shots;")

        loop = asyncio.get_event_loop()
        loop.add_reader(self.conn, handle_notify)

    @cursor_wrapper
    def set_record_class_id(self, record_id: int, class_id: str, cursor=None) -> bool:
        query = """UPDATE rosatom_case.sentinel_images SET class_id=%s WHERE id=%s"""

        try:
            cursor.execute(query, [class_id, record_id])
            return True
        except Exception as e:
            logging.error("Failed to update class_id: {}".format(e))
            return False

    @cursor_wrapper
    def set_record_class_id_and_mask(self, record_id: int, class_id: str, mask_name: str, cursor=None) -> bool:
        query = """UPDATE rosatom_case.images SET class_id=%s, mask_name=%s WHERE id=%s"""

        try:
            cursor.execute(query, [class_id, mask_name, record_id])
            return True
        except Exception as e:
            logging.error("Failed to update class_id: {}".format(e))
            return False

    @cursor_wrapper
    def create_parsing_task(self, lat_1: float, lon_1: float, lat_2: float, lon_2: float, cursor=None) -> bool:
        query = """INSERT INTO rosatom_case.parser_task (lat_1, lon_1, lat_2, lon_2) VALUES (%s, %s, %s, %s)RETURNING id"""

        try:
            cursor.execute(query, [lat_1, lon_1, lat_2, lon_2])
            id = cursor.fetchall()[0]
        except Exception as e:
            logging.error("Failed to insert parsing task: {}".format(e))
            return False

        try:
            cursor.execute("NOTIFY parse_requests, '{}'".format(id[0]))
            return True
        except Exception as e:
            logging.error("Failed to notify of parsing task: {}".format(e))
            return False

    @cursor_wrapper
    def insert_sent_img_data(self, ts: datetime, coords: tuple, coords_system: str, img_npy: bytes,
                             class_id: str, polution_type: str, area_meters: float, level_of_pol: float,
                             company, license_area, poluted_area_reg_n, location_of_poluted_area, adm_region,
                             last_spill_date, region_category, location_name, have_special_zones, is_from_target,
                             cursor=None):

        query = """INSERT INTO rosatom_case.sentinel_images (shoot_ts, lat, lon, npy_img_bytes,
                             class_id, polution_type, area_meters, level_of_pol, company, license_area, 
                             poluted_area_reg_n, location_of_poluted_area, adm_region, last_spill_date, 
                             region_category, location_name, have_special_zones, is_from_target) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                             """

        lat, lon = convert_coords(coords, coords_system)
        np_imd_bytes = pickle.dumps(img_npy)

        cursor.execute(query, (ts, lat, lon, np_imd_bytes, class_id,
                       polution_type, area_meters, level_of_pol, company, license_area, poluted_area_reg_n,
                       location_of_poluted_area, adm_region, last_spill_date, region_category, location_name,
                       have_special_zones, is_from_target))
