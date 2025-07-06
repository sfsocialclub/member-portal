from flask import Flask, session,request,jsonify
from flask_cors import CORS

import jwt
from functools import wraps

from bson.objectid import ObjectId
from flaskApi.mongodb_client import connector

from datetime import datetime, timezone

from pymongo.errors import DuplicateKeyError
import traceback
import json
from bson import json_util
from pymongo import ReturnDocument

import logging
import os

from flaskApi.utils import add_timestamps

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
DB = connector()
CORS(app)
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax' # For testing locally
NEXTAUTH_SECRET = os.environ.get("NEXTAUTH_SECRET")

def jwt_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth = request.headers.get("Authorization", None)
        if not auth or not auth.startswith("Bearer "):
            return jsonify({"msg": "Missing or invalid Authorization header"}), 401

        token = auth.split(" ")[1]
        try:
            decoded = jwt.decode(token, NEXTAUTH_SECRET, algorithms=["HS256"])
            request.user = decoded  # Attach user info to request context
        except jwt.ExpiredSignatureError:
            return jsonify({"msg": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"msg": "Invalid token"}), 401

        return f(*args, **kwargs)
    return decorated_function

def role_required(role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if(role == 'admin'):
                if request.user['isAdmin'] is not True:
                    return jsonify({"error":"Unauthorized access"}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def parse_json(data):
    return json.loads(json_util.dumps(data))

# Liveliness check
@app.route("/flaskApi/ping")
def ping():
    print("NEXTAUTH_SECRET: ",NEXTAUTH_SECRET)
    return jsonify(NEXTAUTH_SECRET)
    
@app.route('/flaskApi/users',methods=['GET'])
@jwt_required
def users():
    current_role = session.get('role')
    if current_role and current_role == 'admin':
        users = DB.users.find({})
        all_users = modify_entity_ids(users)
        return jsonify({"data":all_users})
    return jsonify({"unauthorized":"Only admins and view this data"}), 403


@app.route('/flaskApi/event', methods=["POST"])
@jwt_required
def create_event():
    try:
        event_info = request.get_json()
        if event_info.get("name",None) is None or event_info.get("description",None) is None:
            return jsonify({"error":"missing required fields"}), 400
        event = {
            "name": event_info.get("name"),
            "hostUserIds": event_info.get('hostUserIds'),
            "location":event_info.get('location'),
            "description": event_info.get('description'),
            # "partiful_link":event_info.get("partiful_link"),
            # "event_date":event_info.get("event_date"),
            "startDateTime":event_info.get("startDateTime", None),
            "endDateTime":event_info.get("endDateTime", None),
        }

        result = DB.events.insert_one(add_timestamps(event))
        result.inserted_id
        event_data = DB.events.find_one({"_id": result.inserted_id})
        return jsonify({"id": str(event_data['_id'])}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error":"Failed to send data"}), 400
    
@app.route('/flaskApi/event/<eventId>', methods=["PUT"])
@jwt_required
def update_event(eventId):
    try:
        event_info = request.get_json()
        if event_info.get("name",None) is None or event_info.get("description",None) is None:
            return jsonify({"error":"missing required fields"}), 400
        event = {
            "name": event_info.get("name"),
            "hostUserIds": event_info.get('hostUserIds'),
            "location":event_info.get('location'),
            "description": event_info.get('description'),
            # "partiful_link":event_info.get("partiful_link"),
            # "event_date":event_info.get("event_date"),
            "startDateTime":event_info.get("startDateTime", None),
            "endDateTime":event_info.get("endDateTime", None),
        }

        result = DB.events.update_one(
            {"_id": ObjectId(eventId)},
            {"$set": add_timestamps(event, is_update=True)})
        if result.modified_count > 0:
            return jsonify({"message": "Event updated successfully"}), 200
        else:
            return jsonify({"error": "Event not found"}), 404
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error":"Failed to update event"}), 500

# Reads
@app.route('/flaskApi/user/<userid>',methods=['GET'])
@jwt_required
def user(userid):
    try:
        user = DB.users.find_one({"_id":ObjectId(userid)})

        event_rsvps = list(DB.event_rsvps.find({"user_id":ObjectId(userid)}, {"_id": 0, "event_id": 1, "status": 1}))
        scanned_events = set(doc["event_id"] for doc in DB.code_scans.find({"user_id":ObjectId(userid)}, {"_id": 0, "event_id": 1}))

        # Combine event IDs from both RSVP and scanned events (no duplicates)
        event_ids = set(rsvp["event_id"] for rsvp in event_rsvps) | scanned_events #set(str(scan["event_id"]) for scan in scanned_events)

        event_details = {str(event["_id"]): event for event in DB.events.find({"_id": {"$in": list(event_ids)}})}

        events = []
        for event_id in event_ids:
            event_id_str = str(event_id)
            event_info = event_details.get(event_id_str, {})

            # Get RSVP status for this event (if the user RSVP'd)
            rsvp_status = next((rsvp["status"] for rsvp in event_rsvps if str(rsvp["event_id"]) == event_id_str), None)

            # Check if the user scanned for this event
            scanned = event_id in scanned_events

            event = {
                "id": event_id_str,
                "name": event_info.get("name", ""),
                "description": event_info.get("description", ""),
                "startDateTime": event_info.get("startDateTime") if event_info.get("startDateTime") else None,
                "location": event_info.get("location", None),
                "status": rsvp_status,
                "scanned": scanned
            }

            events.append(event)

        return jsonify({
            "name": user.get("name"),
            "email": user.get("email"),
            "points": user.get("points"),
            "events": events,
            "dateJoined": user.get("dateJoined")
        }), 200
    
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    
@app.route('/flaskApi/admin/events',methods=['GET'])
@jwt_required
@role_required('admin')
def adminEvents():
    try:
        filter_obj = {}
        
        raw_events = DB.events.find(filter_obj)
        events_list = []

        for event in raw_events:
            event_id = str(event.get("_id"))  # Ensure it's a string for scan lookup
            scan_count = DB.code_scans.count_documents({"event_id": ObjectId(event_id)})

            event = modify_entity_ids(event)
            event["scanCount"] = scan_count

            events_list.append(event)

        return jsonify(events_list), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error":"issue with request"}), 400

@app.route('/flaskApi/events',methods=['GET'])
@jwt_required
def events():
    try:
        current_user = request.user
        user_slack_id = current_user.get("slackId")
        user_id = current_user.get("sub")

        scanned_event_docs = DB.code_scans.find({ "user_id": ObjectId(user_id) }, {"_id": 0, "event_id": 1})
        scanned_event_ids = {str(doc["event_id"]) for doc in scanned_event_docs}

        raw_events = DB.events.find({})
        events_list = []

        for event in raw_events:
            event_id = str(event.get("_id"))
            event = modify_entity_ids(event)
            
            event["userIsHost"] = user_slack_id in event.get("hostUserIds", [])
            event["scanned"] = event_id in scanned_event_ids

            # Hide hostUserIds for non-admins
            event.pop("hostUserIds", None)

            events_list.append(event)
            
        return jsonify(events_list), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error":"issue with request"}), 400

def modify_entity_ids(entity):
    if isinstance(entity, list):
        return [modify_entity_ids(item) for item in entity]
    elif isinstance(entity, dict):
        new_entity = {}
        for k, v in entity.items():
            if isinstance(v, ObjectId):
                v = str(v)
            elif isinstance(v, dict) or isinstance(v, list):
                v = modify_entity_ids(v)

            if k == "_id":
                new_entity["id"] = v
            else:
                new_entity[k] = v
        return new_entity
    else:
        return entity

@app.route('/flaskApi/admin/event/<eventID>', methods=['GET'])
@jwt_required
@role_required('admin')
def event(eventID):
    try:
        # Get single event document
        event = DB.events.find_one({"_id": ObjectId(eventID)})
        if not event:
            return jsonify({"error": "Event not found"}), 404

        # Fetch scans for the event
        scans_cursor = DB.code_scans.find({"event_id": ObjectId(eventID)})
        scans_list = list(scans_cursor)

        # Get unique user_ids from scans
        user_ids = list({scan["user_id"] for scan in scans_list})
        users_cursor = DB.users.find({"_id": {"$in": user_ids}})
        user_map = {
            str(user["_id"]): user.get("name", "") for user in users_cursor
        }

        # Attach user names to scans
        modified_scans = []
        for scan in scans_list:
            scan_mod = modify_entity_ids(scan)
            scan_mod["userName"] = user_map.get(scan_mod["user_id"], "Unknown")
            modified_scans.append(scan_mod)

        # Final event object
        modified_event = modify_entity_ids(event)
        modified_event["scans"] = modified_scans

        return jsonify(modified_event), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "issue with request"}), 400



# Delete only the event document (not relations to the event)
@app.route('/flaskApi/delete-event/<eventID>', methods=['DELETE'])
@jwt_required
@role_required('admin')
def delete_event(eventID):
    try:
        event_filter = {"_id": ObjectId(eventID)}
        result = DB.events.delete_one(event_filter)
        
        if result.deleted_count > 0:
            return jsonify({"message": "Event deleted successfully"}), 200
        else:
            return jsonify({"error": "Event not found"}), 404
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to delete event"}), 500
        
@app.route('/flaskApi/scan', methods=['POST'])
@jwt_required
def scan():
    try:
        # Get user making the request from JWT
        scanner_id = request.user["slackId"]

        # Extract data from the request
        data = request.get_json()
        user_id = data.get("userId")  # the person being scanned
        event_id = data.get("eventId")
        scan_time = datetime.now(timezone.utc)

        if not user_id or not event_id:
            return jsonify({"error": "Missing userId or eventId"}), 400

        # Fetch the event to check hostUserIds
        event = DB.events.find_one({"_id": ObjectId(event_id)})
        if not event:
            return jsonify({"error": "Event not found"}), 404

        # Convert host IDs to strings for comparison
        host_ids = [str(uid) for uid in event.get("hostUserIds", [])]

        # Throw an error if user is not a host and is not an admin
        if scanner_id not in host_ids and not request.user['isAdmin']:
            return jsonify({"error": "Unauthorized: not a host of this event"}), 403

        # Proceed to insert scan record
        scan_doc = {
            "event_id": ObjectId(event_id),
            "user_id": ObjectId(user_id),
            "scan_time": scan_time
        }

        try:
            DB.code_scans.insert_one(add_timestamps(scan_doc))
            return jsonify({"message": "Scan recorded successfully"}), 201
        except DuplicateKeyError:
            return jsonify({"error": "User has already scanned for this event"}), 409
        except Exception as e:
            traceback.print_exc()
            return jsonify({"error": "Unable to create scan record", "details": str(e)}), 500

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Unable to create scan record"}), 500
    
# Delete the scan document
@app.route('/flaskApi/admin/delete-scan/<scanId>', methods=['DELETE'])
@jwt_required
@role_required('admin')
def delete_scan(scanId):
    try:
        filter = {"_id": ObjectId(scanId)}
        result = DB.code_scans.delete_one(filter)
        
        if result.deleted_count > 0:
            return jsonify({"message": "Scan deleted successfully"}), 200
        else:
            return jsonify({"error": "Scan not found"}), 404
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to delete scan"}), 500

# Example usage  
# curl -X POST https://127.0.0.1:5328/rsvp -H "Content-Type: application/json" -d '{"status": "maybe", "user_id": "your_user_id", "event_id": "your_event_id"}' 
@app.route('/rsvp', methods=['POST'])
def create_or_update_rsvp():
    try:
        # Get the status from the request payload
        data = request.get_json()
        status = data.get("status", "yes")  # Default to "yes" if status is not provided
        user_id = data.get("user_id")
        event_id = data.get("event_id")

        if not user_id or not event_id:
            return jsonify({"error": "Missing user ID or event ID"}), 400

        # Find the existing RSVP for the user and event
        existing_rsvp = DB.event_rsvps.find_one({"user_id": ObjectId(user_id), "event_id": ObjectId(event_id)})

        if existing_rsvp:
            # If RSVP exists, update the status
            updated_rsvp = DB.event_rsvps.find_one_and_update(
                {"user_id": ObjectId(user_id), "event_id": ObjectId(event_id)},
                {"$set": {"status": status}},
                return_document=ReturnDocument.AFTER  # Return the updated document
            )
            print("updated_rsvp",updated_rsvp)
            updated_rsvp["_id"] = str(updated_rsvp["_id"])
            updated_rsvp["user_id"] = str(updated_rsvp["user_id"])
            updated_rsvp["event_id"] = str(updated_rsvp["event_id"])
            return jsonify({"message": "RSVP updated successfully", "updated_rsvp": updated_rsvp}), 200
        else:
            # If no existing RSVP, create a new one
            new_rsvp = {
                "user_id": ObjectId(user_id),
                "event_id": ObjectId(event_id),
                "status": status
            }
            result = DB.event_rsvps.insert_one(new_rsvp)
            return jsonify({"message": "RSVP created successfully", "event_rsvp_id": str(result.inserted_id)}), 201

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    
# Endpoint to delete an event_rsvp document
# curl -X DELETE https://127.0.0.1:5328/rsvp -H "Content-Type: application/json" -d '{"user_id": "your_user_id", "event_id": "your_event_id"}'
@app.route('/rsvp', methods=['DELETE'])
def delete_rsvp():
    try:
        # Get the user ID and event ID from the request payload
        data = request.get_json()
        user_id = data.get("user_id")
        event_id = data.get("event_id")

        if not user_id or not event_id:
            return jsonify({"error": "Missing user ID or event ID"}), 400
        
        # Delete the event_rsvp document with the constant user and event
        result = DB.event_rsvps.delete_one({"user_id": ObjectId(user_id), "event_id": ObjectId(event_id)})

        if result.deleted_count == 1:
            return jsonify({"message": "RSVP deleted successfully"}), 200
        else:
            return jsonify({"message": "No matching RSVP found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)