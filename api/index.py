from flask import Flask, session,request,jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from bson.objectid import ObjectId
from mongodb_client import connector
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

@app.route("/login", methods=['POST'])
def login():
    data = request.get_json()

    email = data['email']
    password = data['password']
    # hashpassword
    password = password.encode("utf-8")
    
    user = DB.users.find_one({
        "email":email,
    })

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

# Called on UI page load (e.g. after page refresh)
# Returns any necessary data stored in jwt
@app.route("/load", methods = ['GET'])
@jwt_required()
def load():
    claims = get_jwt()
    return jsonify(claims)

@app.route('/index')
@jwt_required()
def index():
    # Access the identity of the current user with get_jwt_identity
    current_user_id = get_jwt_identity()
    
@app.route('/users/',methods=['GET'])
@jwt_required()
def users():
    current_role = session.get('role')
    if current_role and current_role == 'admin':
        users = DB.users.find({})
        return jsonify({"data":users})
    return jsonify({"unauthorized":"Only admins and view this data"}), 403

# Creates
@app.route("/register", methods=['POST'])
def register():
    try:
        user_info = request.get_json()

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

@app.route('/create-event', methods=["POST"])
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

@app.route('/token', methods=['POST'])
def create_token():
    username = request.json.get("name", None)
    password = request.json.get("password", None)
    # Query your database for username and password
    user = DB.users.find_one({"name":username,"password":password})
    session['role']=user['role']
    print("user is",user)
    if user is None:
        # The user was not found on the database
        return jsonify({"msg": "Bad username or password"}), 401

    # Create a new token with the user id inside
    access_token = create_access_token(identity=user['name'])
    return jsonify({ "token": access_token, "user_id": user['name'] }), 200

# Reads
@app.route('/user/<userid>',methods=['GET'])
@jwt_required()
def user(userid):
    try:
        user = DB.users.find_one({"_id":ObjectId(userid)})
        return jsonify({
            "name": user.get("name"),
            "email": user.get("email"),
            "points": user.get("points"),
            "events_attended": user.get("events_attended")
        }),200
    except Exception as e:
        print(e)
        return jsonify({"error":"issue with request"}), 400

@app.route('/events',methods=['GET'])
@jwt_required()
def events():
    try:
        event = DB.events.find({})
        return jsonify({"data":event}),200
    except Exception as e:
        print(e)
        return jsonify({"error":"issue with request"}), 400

@app.route('/event/<eventID>',methods=['GET'])
@jwt_required()
def event(eventID):
    try:
        event = DB.events.find({"id":eventID})
        return jsonify({"data":event}),200
    except Exception as e:
        print(e)
        return jsonify({"error":"issue with request"}), 400

# Updates
@app.route('/update-event/<eventID>',methods=['PUT'])
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

@app.route('/update-user/<userID>',methods=['PUT'])
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

@app.route('/update-password/<userID>',methods=['PUT'])
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
@app.route('/delete-event/<eventID>', methods=['DELETE'])
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

@app.route('/delete-user/<userID>', methods=['DELETE'])
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
        
if __name__ == '__main__':
    app.run(debug=True,port=8000)