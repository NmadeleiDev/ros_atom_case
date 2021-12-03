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
    id: int
    shoot_ts: datetime
    lat: float
    lng: float
    npy_img_bytes: Optional[bytes]
    class_id: Optional[str]
    polution_type: Optional[str]
    area_meters: Optional[float]
    level_of_pol: Optional[float]
    company: Optional[str]
    license_area: Optional[str]
    poluted_area_reg_n: Optional[str]
    location_of_poluted_area: Optional[str]
    adm_region: Optional[str]
    last_spill_date: Optional[datetime]
    region_category: Optional[str]
    location_name: Optional[str]
    have_special_zones: Optional[str]


class Coords(BaseModel):
    lat: float
    lon: float


class ParsingTask(BaseModel):
    northWest: Coords
    southEast: Coords
