from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Financeiro API")

# Configure CORS (Allow connection from React Frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/months", response_model=List[schemas.MonthDataResponse])
def get_all_months(db: Session = Depends(get_db)):
    months = db.query(models.MonthData).all()
    return months

@app.post("/api/months", response_model=schemas.MonthDataResponse)
def create_or_update_month(month_in: schemas.MonthDataCreate, db: Session = Depends(get_db)):
    db_month = db.query(models.MonthData).filter(models.MonthData.month == month_in.month).first()
    
    if db_month:
        # Update existing
        for var, value in vars(month_in).items():
            if value is not None:
                setattr(db_month, var, value)
    else:
        # Create new
        db_month = models.MonthData(**month_in.model_dump())
        db.add(db_month)
        
    db.commit()
    db.refresh(db_month)
    return db_month

@app.delete("/api/months/{month}")
def delete_month(month: str, db: Session = Depends(get_db)):
    db_month = db.query(models.MonthData).filter(models.MonthData.month == month).first()
    if not db_month:
        raise HTTPException(status_code=404, detail="Mês não encontrado")
    
    db.delete(db_month)
    db.commit()
    return {"message": "Deletado com sucesso"}
