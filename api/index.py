from flask import Flask, session,request,jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from mongodb_client import connector

app = Flask(__name__)
DB = connector()
CORS(app, support_credentials=True)
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax' # For testing locally
# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this "super secret" to something else!
jwt = JWTManager(app)
app.config['SECRET_KEY'] = '<repalce with session token from next.js>'

@app.route("/login", methods=['POST'])
def login():
    # create access token
    pass

@app.route("/register", methods=['POST'])
def register():
    pass

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
    user = DB.users.find_one({"id":userid})
    return jsonify({"data":user}),200

@app.route('/events',methods=['GET'])
@jwt_required()
def events():
    event = DB.events.find({})
    return jsonify({"data":event}),200

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