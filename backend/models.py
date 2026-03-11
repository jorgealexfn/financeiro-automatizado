from sqlalchemy import Column, Integer, String, JSON
from database import Base

class MonthData(Base):
    __tablename__ = "month_data"

    id = Column(Integer, primary_key=True, index=True)
    month = Column(String, unique=True, index=True) # e.g., 'Jan-2024'
    values = Column(JSON, default=dict) # {"cat_soldo": 5000.0, "cat_nubank": 1500.0}
