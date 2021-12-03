from datetime import datetime
import os
import logging
from typing import List, Tuple
import psycopg2
import psycopg2.extensions
from db.table_queries import *
import select
import asyncio


class DbManager():
    def __init__(self) -> None:
        self.db_name = os.getenv('POSTGRES_DB')
        self.host = os.getenv('POSTGRES_HOST')
        self.port = int(os.getenv('POSTGRES_PORT', '5432'))
        self.user = os.getenv('POSTGRES_USER')
        self.password = os.getenv('POSTGRES_PASSWORD')

        try:
            self.conn = psycopg2.connect(database=self.db_name, user=self.user, password=self.password, host=self.host,port=self.port)
        except:
            exit(1)

        self.conn.set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT)
        self.conn.autocommit = True

    def cursor_wrapper(f):
        def db_fn(self, *args, **kwargs):
            cursor = self.conn.cursor()
            res = f(self, *args, **kwargs, cursor=cursor)
            cursor.close()
            return res
        return db_fn

    @cursor_wrapper
    def get_records(self, class_filter: List[str] = None, cursor = None) -> Tuple[List[dict], bool]:
        query = """SELECT img_file_id, lat, lon, class_id, time_shoot, format, file_name FROM rosatom_case.images """

        try:
            if class_filter is not None:
                query += "WHERE class_id IN %s"
                cursor.execute(query, class_filter)
            else:
                cursor.execute(query)

            result = cursor.fetchall()

            colnames = ['img_file_id', 'lat', 'lon', 'class_id', 'time_shoot', 'format', 'file_name']

            return [dict(zip(colnames, x)) for x in result], True
        except Exception as e:
            logging.error("Failed get record data: {}".format(e))
            return [], False

    @cursor_wrapper
    def listen_for_new_image_id(self, callback=None, cursor=None):
        def handle_notify():
            logging.debug("Pulling log")
            self.conn.poll()
            for notify in self.conn.notifies:
                callback(*(notify.payload.split(',')), db=self)
                logging.debug("Got NOTIFY: {}, {}, {}".format(notify.pid, notify.channel, notify.payload))

            self.conn.notifies.clear()

        cursor.execute("LISTEN new_shots;")

        loop = asyncio.get_event_loop()
        loop.add_reader(self.conn, handle_notify)

    @cursor_wrapper
    def set_record_class_id(self, record_id: int, class_id: str, cursor = None) -> bool:
        query = """UPDATE rosatom_case.images SET class_id=%s WHERE id=%s"""

        try:
            cursor.execute(query, [class_id, record_id])
            return True
        except Exception as e:
            logging.error("Failed to update class_id: {}".format(e))
            return False

    @cursor_wrapper
    def set_record_class_id_and_mask(self, record_id: int, class_id: str, mask_name: str, cursor = None) -> bool:
        query = """UPDATE rosatom_case.images SET class_id=%s, mask_name=%s WHERE id=%s"""

        try:
            cursor.execute(query, [class_id, mask_name, record_id])
            return True
        except Exception as e:
            logging.error("Failed to update class_id: {}".format(e))
            return False

    @cursor_wrapper
    def create_parsing_task(self, lat_1: float, lon_1: float, lat_2: float, lon_2: float, cursor = None) -> bool:
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
        
