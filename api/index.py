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

    # TODO: Encrypted password implementation + query
    user = DB.users.find_one({
        "email":email,
    })
    
    if user is None:
        # The user was not found on the database
        return jsonify(message="Invalid credentials"), 401
    
    additional_claims = {'role': user['role'], 'userId': str(user['_id'])}
    access_token = create_access_token(identity=str(user['_id']), fresh=True, additional_claims=additional_claims)
    return jsonify(access_token=access_token, role=user['role'], userId=str(user['_id'])), 200

# Called on UI page load (e.g. after page refresh)
# Returns any necessary data stored in jwt
@app.route("/load", methods = ['GET'])
@jwt_required()
def load():
    claims = get_jwt()
    return jsonify(claims)
    

@app.route("/register", methods=['POST'])
def register():
    if request.method == 'POST':
        try:
            user_info = request.get_json()
            DB.users.insert_one(user_info)
            user = DB.users.find_one({"name":user_info['name']})
            if user:
                user_id = str(user['_id'])
                logger.info(f"[+] user found {user_id}")
                return jsonify({"id":user_id}), 200
            else:
                logger.error("[!] Error with request")
                return jsonify({"failed","user not created"}), 500
        except Exception as e:
            logger.error(e)
            return jsonify({"error":"request failed resend data"}), 400



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

@app.route('/user/<userid>',methods=['GET'])
@jwt_required()
def user(userid):
    user = DB.users.find_one({"_id":ObjectId(userid)})
    return jsonify(parse_json(user)),200

@app.route('/events',methods=['GET'])
@jwt_required()
def events():
    event = DB.events.find({})
    return jsonify({"data":event}),200

@app.route('/event/<eventID>',methods=['GET'])
@jwt_required()
def event(eventID):
    event = DB.events.find({"id":eventID})
    return jsonify({"data":event}),200

@app.route('/create-event/', methods=["POST"])
# @jwt_required()
def create_event():
    if request.method == 'POST':
        try:
            event = request.get_json()
            logger.info(f"[+] current event {event}")
            DB.events.insert_one(event)
            event_data = DB.events.find_one({"name": event['name']})
            event_data['_id'] = str(event_data['_id'])  # Convert ObjectId to string
            return jsonify({"id": event_data['_id']}), 200
        except Exception as e:
            print(e)
            return jsonify({"error":"Failed to send data"}), 500
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



if __name__ == '__main__':
    app.run(debug=True,port=8000)