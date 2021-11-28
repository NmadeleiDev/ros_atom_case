from datetime import datetime
import os
import logging
from typing import List, Tuple
import psycopg2
from db.table_queries import *

class DbManager():
    datasets_schema_name = 'user_datasets'

    def __init__(self) -> None:
        self.db_name = os.getenv('POSTGRES_DB')
        self.host = os.getenv('POSTGRES_HOST')
        self.port = int(os.getenv('POSTGRES_PORT', '5432'))
        self.user = os.getenv('POSTGRES_USER')
        self.password = os.getenv('POSTGRES_PASSWORD')

        self.conn = psycopg2.connect(database=self.db_name, user=self.user, password=self.password, host=self.host,port=self.port)

    def cursor_wrapper(f):
        def db_fn(self, *args, **kwargs):
            cursor = self.conn.cursor()
            res = f(self, *args, **kwargs, cursor=cursor)
            cursor.close()
            return res
        return db_fn

    @cursor_wrapper
    def create_tables(self, cursor =None):
        cursor.execute(schema_create_query)
        cursor.execute(images_table_query)

    @cursor_wrapper
    def get_records(self, class_filter: List[str] = None, cursor = None) -> Tuple[List[dict], bool]:
        query = """SELECT img_file_id, lat, lon, class_id FROM rosatom_case.images """

        try:
            if class_filter is not None:
                query += "WHERE class_id IN %s"
                cursor.execute(query, class_filter)
            else:
                cursor.execute(query)

            result = cursor.fetchall()

            colnames = ['img_file_id', 'lat', 'lon', 'class_id']

            return [dict(zip(colnames, x)) for x in result], True
        except Exception as e:
            return [], False

    @cursor_wrapper
    def insert_record(self, img_file_id=None, lat=None, lon=None, class_id=None, cursor = None) -> bool:
        query = """INSERT INTO rosatom_case.images (img_file_id, lat, lon, class_id) VALUES (%s, %s, %s, %s) ON CONFLICT (img_file_id) DO NOTHING"""

        try:
            cursor.execute(query, (img_file_id, lat, lon, class_id))
            return True
        except Exception as e:
            return False



