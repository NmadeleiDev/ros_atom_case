from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from parser_integration.wait_for_shots import start_waiting

from db.manager import DbManager
from api.handlers import apply_handlers
from files_manager.files import import_data_on_fs_to_db
from threading import Thread

logging.basicConfig(format='%(asctime)s %(message)s', datefmt='%m/%d/%Y %H:%M:%S :', level=logging.DEBUG)

db = DbManager()

Thread(target=start_waiting).start()

app = FastAPI(
    title="Service API",
    description='API docs for backend',
    version="1.0.0",
    contact={
        "name": "Rolling Drones",
        "email": "potemkin3940@gmail.com",
    },
    openapi_url="/openapi.json",
    docs_url="/docs",
    root_path="/backend"
)

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://front:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

apply_handlers(app, db)
