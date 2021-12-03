from typing import List, Optional, Tuple, Generic, TypeVar, Union
from pydantic.generics import GenericModel
from pydantic.main import BaseModel
from datetime import datetime

DataT = TypeVar('DataT')

class DefaultResponseModel(GenericModel, Generic[DataT]):
    status: bool
    error: Optional[str] = None
    data: Optional[DataT]

class LocationData(BaseModel):
    lat: float
    lng: float
    class_id: Optional[str]
    time_shoot: Optional[datetime]
    format: Optional[str]
    file_name: str

class Coords(BaseModel):
    lat: float
    lon: float

class ParsingTask(BaseModel):
    northWest: Coords
    southEast: Coords