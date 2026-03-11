from pydantic import BaseModel
from typing import Dict, Any

class MonthDataBase(BaseModel):
    month: str
    values: Dict[str, float] = {}

class MonthDataCreate(MonthDataBase):
    pass

class MonthDataResponse(MonthDataBase):
    id: int

    class Config:
        from_attributes = True
