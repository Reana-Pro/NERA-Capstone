from supabase import create_client, Client
from dotenv import load_dotenv
from geopy.geocoders import Nominatim
from fastapi import FastAPI, HTTPException
import os

app = FastAPI(swagger_ui_parameters={"displayRequestDuration": True})
load_dotenv()
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
geolocator = Nominatim(user_agent="nera_app")
supabase: Client = create_client(url, key)


@app.get("/input_location")
def input_location(address: str):
    location = geolocator.geocode(address)

    if not location:
        raise HTTPException(status_code=400, detail="Invalid Address")

    response = supabase.rpc("neighborhood_search",
                            {"latitude": location.latitude, "longitude": location.longitude}
                            ).execute()

    if not response.data:
        raise HTTPException(status_code=400, detail="Neighborhood Not Found")

    data = supabase.rpc("get_neighborhood_attributes",
                        {"neighborhood": response.data}
                        ).execute()

    return {
        "Neighborhood": response.data,
        "Attributes": data
    }