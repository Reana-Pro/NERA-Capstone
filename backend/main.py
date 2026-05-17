from supabase import create_client, Client
from dotenv import load_dotenv
from geopy.geocoders import Nominatim
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(swagger_ui_parameters={"displayRequestDuration": True})

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
geolocator = Nominatim(user_agent="nera_app")
supabase: Client = create_client(url, key)

@app.get("/test_connection")
def test_connection():
    try:
        result = supabase.rpc("neighborhood_search", {"latitude": 33.6846, "longitude": -117.8265}).execute()
        return {"status": "connected", "data": result.data}
    except Exception as e:
        return {"status": "failed", "error": str(e)}

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
    economic_value = supabase.rpc("get_neighborhood_most_current_economic_value",
                                  {"neighborhood": response.data[0]["neighborhood_name"]}
                                  ).execute()
    education_value = supabase.rpc("get_neighborhood_most_current_education_value",
                                  {"neighborhood": response.data[0]["neighborhood_name"]}
                                  ).execute()
    poverty_value = supabase.rpc("get_neighborhood_most_current_poverty_value",
                                  {"neighborhood": response.data[0]["neighborhood_name"]}
                                  ).execute()
    elderly_number = supabase.rpc("get_neighborhood_most_current_elderly_number",
                                  {"neighborhood": response.data[0]["neighborhood_name"]}
                                  ).execute()
    population_value = supabase.rpc("get_neighborhood_most_current_population_number",
                                  {"neighborhood": response.data[0]["neighborhood_name"]}
                                  ).execute()
    elderly_value = supabase.rpc("get_neighborhood_most_current_elderly_value",
                                  {"neighborhood": response.data[0]["neighborhood_name"]}
                                  ).execute()
    score = supabase.rpc("get_neighborhood_score",
                         {"neighborhood" : response.data[0]["neighborhood_name"],
                                    "city" : response.data[0]["city_name"]}
                         ).execute()
    projection3years = supabase.rpc("get_neighborhood_score",
                         {"neighborhood" : response.data[0]["neighborhood_name"],
                                    "city" : response.data[0]["city_name"],
                                    "years" : 3}
                         ).execute()
    projection5years = supabase.rpc("get_neighborhood_score",
                         {"neighborhood" : response.data[0]["neighborhood_name"],
                                    "city" : response.data[0]["city_name"],
                                    "years" : 5}
                         ).execute()
    projection7years = supabase.rpc("get_neighborhood_score",
                         {"neighborhood" : response.data[0]["neighborhood_name"],
                                    "city" : response.data[0]["city_name"],
                                    "years" : 7}
                         ).execute()
    confidence = supabase.rpc("get_confidence_rating",
                              {"neighborhood": response.data[0]["neighborhood_name"],
                               "city": response.data[0]["city_name"]}
                              ).execute()
    return {
        "Neighborhood": response.data[0]["neighborhood_name"],
        "Score": score.data,
        "3 Year Projection": projection3years.data,
        "5 Year Projection": projection5years.data,
        "7 Year Projection": projection7years.data,
        "Confidence Rating": confidence.data,
        "Median Household Income": economic_value.data,
        "Median Percentage of Bachelor's or Higher": education_value.data,
        "Median Poverty rate across education levels higher than less than HS graduate": poverty_value.data,
        "Median Elderly population within neighborhood number" : elderly_number.data,
        "Median Total population within neighborhood number" : population_value.data,
        "Median Percentage of Elderly compared to Total population" : elderly_value.data,
        "latitude": location.latitude,
        "longitude": location.longitude
    }