from typing import List, Optional, Tuple, Generic, TypeVar, Union
from pydantic.generics import GenericModel
from pydantic.main import BaseModel

DataT = TypeVar('DataT')

class DefaultResponseModel(GenericModel, Generic[DataT]):
    status: bool
    error: Optional[str] = None
    data: Optional[DataT]

class Coords(BaseModel):
    lat: float
    lon: float

class ParsingTask(BaseModel):
    northWest: Coords
    southEast: Coords