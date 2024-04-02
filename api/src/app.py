from datetime import datetime, timedelta
from typing import Optional, TypedDict

from fastapi import FastAPI, Form, Query, status
from fastapi.responses import RedirectResponse

from services.database import JSONDatabase

app = FastAPI()


class Quote(TypedDict):
    name: str
    message: str
    time: str


database: JSONDatabase[list[Quote]] = JSONDatabase("data/database.json")


@app.on_event("startup")
def on_startup() -> None:
    """Initialize database when starting API server."""
    if "quotes" not in database:
        print("Adding quotes entry to database")
        database["quotes"] = []


@app.on_event("shutdown")
def on_shutdown() -> None:
    """Close database when stopping API server."""
    database.close()


@app.post("/quote")
def post_message(name: str = Form(), message: str = Form()) -> RedirectResponse:
    """
    Process a user submitting a new quote.
    You should not modify this function except for the return value.
    """
    now = datetime.now().replace(microsecond=0)

    quote = Quote(name=name, message=message, time=now.isoformat())
    database["quotes"].append(quote)

    # You may modify the return value as needed to support other functionality
    return RedirectResponse("/", status.HTTP_303_SEE_OTHER)

@app.get("/quotes")
def get_messages():
    """
    Returns dictionary of quotes from database given the maximum age
    """
    interval: Optional[str] = Query(None, 
                                    description = "Max age of quote (week, month, year); Default includes all")

    quotes = database["quotes"]
    now = datetime.now().date()

    if interval == "week":
        max_date = 7
    elif interval == "month":
        max_date = 30
    elif interval == "year":
        max_date = 365
    else:
        max_date = float('inf')

    filtered_quotes = [quote for quote in quotes 
              if 0 <= (now - datetime.strptime(quote["time"], "%Y-%m-%dT%H:%M:%S").date()).days <= max_date]
    
    return filtered_quotes