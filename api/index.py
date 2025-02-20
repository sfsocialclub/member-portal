from flask import Flask, session,request,jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from bson.objectid import ObjectId
from api.mongodb_client import connector
from datetime import timedelta
import json
from bson import json_util
import logging
import bcrypt
import datetime

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
        print("look at data", data)
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
        print(e)
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
            "created_at": datetime.datetime.now()
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
                "created_at":datetime.datetime.now()
            }
            logger.info(f"[+] current event {event}")
            DB.events.insert_one(event)
            event_data = DB.events.find_one({"name": event['name']})
            event_data['_id'] = str(event_data['_id'])  # Convert ObjectId to string
            return jsonify({"id": event_data['_id']}), 200
        except Exception as e:
            print(e)
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

        class RsvpStatus:
            attended = 'attended'
            maybe = 'maybe'
            no = 'no'

        MOCK_EVENTS = [
            {
                "id": "event-0",
                "name": "Rooftop Party",
                "startDateTime": "2025-02-14T02:00:00.000Z",
                "endDateTime": "2025-02-14T02:00:00.000Z",
                "description": "A rooftop soirée under the stars with live music and signature cocktails.",
                "points": 100,
                "location": {
                    "name": "The Rooftop",
                    "address": "123 Main St, San Francisco, CA 94105"
                },
                "status": RsvpStatus.attended
            },
            {
                "id": "event-1a",
                "name": "Jazz Bar",
                "startDateTime": "2025-02-18T02:00:00.000Z",
                "endDateTime": "2025-02-18T02:00:00.000Z",
                "description": "An underground speakeasy night featuring jazz, craft cocktails, and hidden surprises.",
                "points": 150,
                "location": {
                    "name": "The Jazz Club",
                    "address": "456 Broadway, New York, NY 10013"
                },
                "status": RsvpStatus.maybe
            },
            {
                "id": "event-1b",
                "name": "Pickle Ball",
                "startDateTime": "2025-02-18T01:00:00.000Z",
                "endDateTime": "2025-02-18T01:00:00.000Z",
                "description": "Meet at the courts, make progress to your game, vibe with the crew.",
                "points": 200,
                "location": {
                    "name": "The Pickle Ball Court",
                    "address": "789 Oak St, Los Angeles, CA 90012"
                },
                "status": RsvpStatus.no
            },
            {
                "id": "event-2",
                "name": "Cosplay Con",
                "startDateTime": "2025-02-21T02:00:00.000Z",
                "endDateTime": "2025-02-21T02:00:00.000Z",
                "description": "A themed costume party with a DJ, dance floor, and interactive photo booths.",
                "points": 250,
                "location": {
                    "name": "The Convention Center",
                    "address": "901 Market St, San Francisco, CA 94105"
                },
                "status": RsvpStatus.attended
            },
            {
                "id": "event-3",
                "name": "Beach Visit",
                "startDateTime": "2025-02-27T02:00:00.000Z",
                "endDateTime": "2025-02-27T02:00:00.000Z",
                "description": "A sunset beach bonfire with s’mores, acoustic live performances, and ocean waves.",
                "points": 300,
                "location": {
                    "name": "The Beach",
                    "address": "123 Beach St, Miami, FL 33139"
                },
                "status": RsvpStatus.maybe
            }
        ]

        return jsonify({
            "name": user.get("name"),
            "email": user.get("email"),
            "points": user.get("points"),
            # TODO: Retrieve events RSVP by given user
            #       id: string;
            #       startDateTime: string;
            #       endDateTime: string;
            #       name: string;
            #       description: string;
            #       points: number;
            #       location: {
            #           name: string;
            #           address: string;
            #       }
            #       status: RsvpStatus;
            "events": MOCK_EVENTS,
            "events_attended": user.get("events_attended"),
            "dateJoined": user.get("dateJoined")
        }),200
    except Exception as e:
        print(e)
        return jsonify({"error":"issue with request"}), 400

@app.route('/api/events',methods=['GET','POST'])
@jwt_required()
def events():
    try:
        if request.method == "POST":
            filter_obj = request.get_json()
        else:
            filter_obj = {}
        events = DB.events.find(filter_obj)
        # remove objectId from events
        all_events = modify_entity_ids(events)
        print(all_events)
        return jsonify(all_events),200
    except Exception as e:
        print(e)
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
        print(e)
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
                             "updated_at": datetime.datetime.now()}
        update_operation = {"$set": update_event_data}
        
        result = DB.events.update_one(event_filter, update_operation)
        
        if result.matched_count > 0:
            return jsonify({"message": "Event updated successfully"}), 200
        else:
            return jsonify({"error": "Event not found"}), 404
    except Exception as e:
        print(e)
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
                             "updated_at":datetime.datetime.now()}
        update_operation = {"$set": updated_user_data}
        
        result = DB.users.update_one(user_filter, update_operation)
        
        if result.matched_count > 0:
            return jsonify({"message": "User updated successfully"}), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        print(e)
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
        print(e)
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
        print(e)
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
        print(e)
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
        user_id = request.get_json("userId")
        event_id = request.get_json().get("eventId")
        event_filter = {"_id":ObjectId(event_id)}
        update_operation = {
                "updated_at": datetime.datetime.now(),
                "attended": {user_id:True}
            }
        DB.update_one(event_filter,{
            "$set": update_operation
        })
        return jsonify({"message":"Successfully scanned code " + user_id}), 200
    except Exception as e:
        print(e)
        return jsonify({"message":"Code unrecognized"}), 500
    
if __name__ == '__main__':
    app.run(debug=True)