from flask import Flask, session,request,jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from bson.objectid import ObjectId
from api.mongodb_client import connector
from datetime import datetime, timedelta, timezone
from pymongo.errors import DuplicateKeyError
import traceback
import json
from bson import json_util
import logging
import bcrypt
from pymongo import ReturnDocument

logger = logging.getLogger(__name__)

def parse_json(data):
    return json.loads(json_util.dumps(data))

app = Flask(__name__)
DB = connector()
CORS(app, support_credentials=True)
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax' # For testing locally
# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this "super secret" to something else!
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=15)  # Access token lifespan
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)    # Refresh token lifespan
jwt = JWTManager(app)
app.config['SECRET_KEY'] = '<repalce with session token from next.js>'

# Liveliness check
@app.route("/api/ping")
def ping():
    return jsonify("pong")

@app.route("/api/login", methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data['email']
        password = data['password']
        # hashpassword
        password = password.encode("utf-8")
        
        user = DB.users.find_one({
            "email":email,
        })
        print("user from database", user)
        if user is None:
            # The user was not found on the database
            return jsonify(message="Invalid credentials"), 401
        if bcrypt.checkpw(password, user['password']):
            #store userID in current session
            session['userID'] = str(user['_id'])
            additional_claims = {'role': user['role'], 'userId': str(user['_id'])}
            access_token = create_access_token(identity=str(user['_id']), fresh=True, additional_claims=additional_claims)
            return jsonify(access_token=access_token, role=user['role'], userId=str(user['_id'])), 200
        else:
            logger.error("[!] Failed credential check")
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error":"Missing data"}), 415

# Called on UI page load (e.g. after page refresh)
# Returns any necessary data stored in jwt
@app.route("/api/load", methods = ['GET'])
@jwt_required()
def load():
    claims = get_jwt()
    return jsonify(claims)

@app.route('/api/index')
@jwt_required()
def index():
    # Access the identity of the current user with get_jwt_identity
    current_user_id = get_jwt_identity()
    
@app.route('/api/users',methods=['GET'])
@jwt_required()
def users():
    current_role = session.get('role')
    if current_role and current_role == 'admin':
        users = DB.users.find({})
        all_users = modify_entity_ids(users)
        return jsonify({"data":all_users})
    return jsonify({"unauthorized":"Only admins and view this data"}), 403

# Creates
@app.route("/api/register", methods=['POST'])
def register():
    try:
        user_info = request.get_json()
        user = DB.users.find_one({"email":user_info['email']}), 400
        print("found user",user)
        if user[0] is not None:
            return jsonify({"error":"user has already been created"})
        enhanced_user_info = {
            "name":user_info['name'],
            "email":user_info["email"],
            "password": bcrypt.hashpw(user_info["password"].encode("utf-8"),bcrypt.gensalt()), # hold of on adding salt bycrypt.gensalt()
            "role": "user", # admins should be not be made through portal
            "points": 0.0,
            "events_attended": [],
            "events_created": [],
            "events_missed": [],
            "created_at": datetime.now()
            }
        print(f"[+] user info: {enhanced_user_info}")
        DB.users.insert_one(enhanced_user_info)
        user = DB.users.find_one({"name":user_info['name']})
        if user:
            user_id = str(user['_id'])
            logger.info(f"[+] user found {user_id}")
            return jsonify({"userId":user_id}), 200
        else:
            logger.error("[!] Error with request")
            return jsonify({"failed","user not created"}), 500
    except Exception as e:
        logger.error(e)
        return jsonify({"error":"request failed resend data"}), 400

@app.route('/api/create-event', methods=["POST"])
@jwt_required()
def create_event():
    if request.method == 'POST':
        try:
            event_info = request.get_json()
            if event_info.get("name",None) is None or event_info.get("host",None) is None or event_info.get("description",None) is None:
                return jsonify({"error":"missing required feilds"}), 400
            event = {
                "name": event_info.get("name"),
                "host": event_info.get('host'),
                "location":event_info.get('location'),
                "description": event_info.get('description'),
                "partiful_link":event_info.get("partiful_link"),
                "event_date":event_info.get("event_date"),
                "qr_codes":[],
                "attended": [],
                "going": [],
                "maybes":[],
                "ics_file": event_info.get('ics_file'),
                "is_paid":event_info.get("is_paid"),
                "attendance_points": event_info.get("points"),
                "created_at":datetime.now()
            }
            logger.info(f"[+] current event {event}")
            DB.events.insert_one(event)
            event_data = DB.events.find_one({"name": event['name']})
            event_data['_id'] = str(event_data['_id'])  # Convert ObjectId to string
            return jsonify({"id": event_data['_id']}), 200
        except Exception as e:
            traceback.print_exc()
            return jsonify({"error":"Failed to send data"}), 400
    else:
        return jsonify({"error":"Most be a post request"}), 400

@app.route('/api/token', methods=['POST'])
def create_token():
    username = request.json.get("name", None)
    password = request.json.get("password", None)
    # Query your database for username and password
    user = DB.users.find_one({"name":username,"password":password})
    # session['role']=user['role']
    print("user is",user)
    if user is None:
        # The user was not found on the database
        return jsonify({"msg": "Bad username or password"}), 401

    # Create a new token with the user id inside
    access_token = create_access_token(identity=user['name'])
    return jsonify({ "token": access_token, "user_id": user['name'] }), 200

# Reads
@app.route('/api/user/<userid>',methods=['GET'])
@jwt_required()
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

@app.route('/api/events',methods=['GET','POST'])
@jwt_required()
def events():
    try:
        if request.method == "POST":
            filter_obj = request.get_json()
        else:
            if(request.args.get('today') == 'true'):
                date_param = datetime.now()
                start_date = date_param - timedelta(hours=24)
                end_date = date_param + timedelta(hours=24)
                filter_obj = {"startDateTime": {"$gte": start_date, "$lte": end_date}}
            else:
                filter_obj = {}
        print('filter_obj:',filter_obj)
        events = DB.events.find(filter_obj)
        # remove objectId from events
        all_events = modify_entity_ids(events)
        print(all_events)
        return jsonify(all_events),200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error":"issue with request"}), 400

def modify_entity_ids(entities):
    all_entities = []
    for entity in entities:
        print("current entities being modified")
        modified_entity = entity
        modified_entity = {key: value for key, value in entity.items() if key != "_id"}
        modified_entity["id"] = str(entity["_id"])
        all_entities.append(modified_entity)
    return all_entities

@app.route('/api/event/<eventID>',methods=['GET'])
@jwt_required()
def event(eventID):
    try:
        print("check event id",eventID)
        event = DB.events.find({"_id":ObjectId(eventID)})
        print("all events found",event)
        modified_event = modify_entity_ids(event)
        return jsonify({"data":modified_event}),200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error":"issue with request"}), 400

# Updates
@app.route('/api/update-event/<eventID>',methods=['PUT'])
@jwt_required()
def update_event(eventID):
    try:
        if permission_to_modify_event(eventID,session['userID']) is False:
            return jsonify({"error":"Unauthorized access"}), 403
        
        event_data = request.get_json()
        event_filter = {"_id": ObjectId(eventID)}
        update_event_data = {**event_data,
                             "updated_at": datetime.now()}
        update_operation = {"$set": update_event_data}
        
        result = DB.events.update_one(event_filter, update_operation)
        
        if result.matched_count > 0:
            return jsonify({"message": "Event updated successfully"}), 200
        else:
            return jsonify({"error": "Event not found"}), 404
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to update event"}), 500

@app.route('/api/update-user/<userID>',methods=['PUT'])
@jwt_required()
def update_user(userID):
    try:
        if userID is not session["userID"]:
            return jsonify({"error":"Unauthorized access"}), 403
        
        user_data = request.get_json()
        user_filter = {"_id": ObjectId(userID)}
        updated_user_data = {**user_data,
                             "updated_at":datetime.now()}
        update_operation = {"$set": updated_user_data}
        
        result = DB.users.update_one(user_filter, update_operation)
        
        if result.matched_count > 0:
            return jsonify({"message": "User updated successfully"}), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to update user"}), 500

@app.route('/api/update-password/<userID>',methods=['PUT'])
@jwt_required()
def update_password(userID):
    try: 
        if userID != session['userID']:
            return jsonify({"error":"Unauthorized access"}), 403
        user_info = request.json()
        user_email = user_info.get("email")
        password = user_info.get("password")
        if user_email:
            # user email and userID must match with user from mongo
            mongo_user = DB.users.find_one({"email":user_email})
            if userID == str(mongo_user["_id"]) and mongo_user["email"] == user_email:
                encrypted_pass = bcrypt.hashpw(password.encode("utf-8"),bcrypt.gensalt())
                user_filter = {"email": user_email}
                new_field = {"$set": {"password": encrypted_pass}}
                DB.users.update_one(user_filter, new_field)
                print('updated password successfully')
                return jsonify({"sucess":f"{user_email} password has been updated"}), 200
        else:
            return jsonify({"error":"User email was not in request, or invalid"}), 400
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error":"Issue with request"}), 400

# Deletes
@app.route('/api/delete-event/<eventID>', methods=['DELETE'])
@jwt_required()
def delete_event(eventID):
    try:
        if permission_to_modify_event(eventID,session['userID']) is False:
            return jsonify({"error":"Unauthorized access"}), 403
        
        event_filter = {"_id": ObjectId(eventID)}
        result = DB.events.delete_one(event_filter)
        
        if result.deleted_count > 0:
            return jsonify({"message": "Event deleted successfully"}), 200
        else:
            return jsonify({"error": "Event not found"}), 404
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to delete event"}), 500

@app.route('/api/delete-user/<userID>', methods=['DELETE'])
@jwt_required()
def delete_user(userID):
    try:
        if permission_to_modify_user(userID) is False:
            return jsonify({"error":"Unauthorized access"}), 403
        
        user_filter = {"_id": ObjectId(userID)}
        result = DB.users.delete_one(user_filter)
        
        if result.deleted_count > 0:
            return jsonify({"message": "User deleted successfully"}), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to delete user"}), 500
    
def permission_to_modify_event(eventID,userID):
         # Only admins and the host of the event can remove the event
        event = DB.events.find_one({"_id":ObjectId(eventID)})
        current_user = DB.users.find_one({"_id":userID})
        if event['host'] != current_user["email"] or current_user['role'] != 'admin':
            return False
        else:
            return True
        
def permission_to_modify_user(userID):
        # Admins can delete any user but a user can only delete themselves
        if session['role'] != 'admin' or userID != session['userID']:
            return False
        else:
            return True
        
@app.route('/api/scan', methods=['POST'])
@jwt_required()
def scan():
    jwt_role = get_jwt()['role']
    if jwt_role != 'admin':
        return jsonify({"message":"Unauthorized"}), 404
    try:
        user_id = request.get_json().get("userId")
        event_id = request.get_json().get("eventId")
        scan_time = datetime.now()

        if not user_id or not event_id:
            return jsonify({"error":"Missing user id or event id"}), 400
        
        scan_doc = {
            "event_id":ObjectId(event_id),
            "user_id":ObjectId(user_id),
            "scan_time":scan_time
        }

        try:
            DB.code_scans.insert_one(scan_doc)
            return jsonify({"message": "Scan recorded successfully"}), 201
        except DuplicateKeyError:
            return jsonify({"error": "User has already scanned for this event"}), 409
        except Exception as e:
            return jsonify({"error": "Unable to create scan record", "details": str(e)}), 500

    except Exception as e:
        traceback.print_exc()
        return jsonify({"message":"Unable to create scan record"}), 500

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