from pymongo import MongoClient
from pymongo import ASCENDING
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import certifi
import os

# load_dotenv()
client = MongoClient()

"""
    NOTE: Mongo client ip access list currently set to be accessible anywhere.
     I've done this for development purposes but before we push to prod it should be set to a static IP.

"""

USERNAME = os.environ.get("MONGO_USERNAME")
PASSWORD = os.environ.get("MONGO_PASSWORD")
URI = f"mongodb+srv://{USERNAME}:{PASSWORD}@cluster1.nfvpz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"

print(USERNAME, PASSWORD)

if USERNAME is None or PASSWORD is None:
    raise ValueError("Missing MONGO_USERNAME or MONGO_PASSWORD in environment variables.")

def connector():
    # Create a new client and connect to the server
    client = MongoClient(URI, tlsCAFile=certifi.where())
    # Send a ping to confirm a successful connection
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")

        db = client.db

        # Enforce uniqueness only once slack_id exists (safe during/after backfill)
        db.code_scans.create_index(
            [("event_id", ASCENDING), ("slack_id", ASCENDING)],
            name="event_id_1_slack_id_1_unique_partial",
            unique=True,
            partialFilterExpression={"slack_id": {"$exists": True}},
        )

        # Helpful for filtering by person
        db.code_scans.create_index([("slack_id", ASCENDING)], name="slack_id_1")

        # (Optional) also keep an event_id index if you query by it often
        db.code_scans.create_index([("event_id", ASCENDING)], name="event_id_1")

        return db
    except Exception as e:
        print(e)
        return None
    
def test_collection():
    database = connector()
    print(database.list_collection_names())
    print(database.users.find_one({"name":"Sean Brown"}))