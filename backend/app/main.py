from app.database import SessionLocal
from app.models.trip import Trip
from app.database import engine
from app.database import Base
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/trips")
async def get_trips():
    db = SessionLocal()

    trips = db.query(Trip).all()

    result = []

    for trip in trips:
        result.append({
            "id": trip.id,
            "driver_name": trip.driver_name,
            "total_gallons": trip.total_gallons,
            "total_stops": trip.total_stops,
            "status": trip.status
        })

    return result
@app.get("/trips/{trip_id}")
async def get_single_trip(trip_id: int):
    db = SessionLocal()

    trip = db.query(Trip).filter(Trip.id == trip_id).first()

    if not trip:
        return {"message": "Trip not found"}

    return {
        "id": trip.id,
        "driver_name": trip.driver_name,
        "total_gallons": trip.total_gallons,
        "total_stops": trip.total_stops,
        "status": trip.status
    }
@app.post("/trips")
async def create_trip(trip: dict):
    db = SessionLocal()

    new_trip = Trip(
        driver_name=trip["driver_name"],
        total_gallons=trip["total_gallons"],
        total_stops=trip.get("total_stops", 0),
        status=trip["status"]
    )

    db.add(new_trip)

    db.commit()

    db.refresh(new_trip)

    return {
        "id": new_trip.id,
        "driver_name": new_trip.driver_name,
        "total_gallons": new_trip.total_gallons,
        "total_stops": new_trip.total_stops,
        "status": new_trip.status
    }