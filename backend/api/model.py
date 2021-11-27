from typing import List, Optional, Tuple, Generic, TypeVar, Union
from pydantic.generics import GenericModel

DataT = TypeVar('DataT')

class DefaultResponseModel(GenericModel, Generic[DataT]):
    status: bool
    error: Optional[str] = None
    data: Optional[DataT]
