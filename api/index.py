from flask import Flask, session,request,jsonify
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, get_jwt_identity, jwt_required
)
from mongodb_client import connector
from datetime import timedelta

app = Flask(__name__)
CLIENT = connector()
CORS(app, support_credentials=True)
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax' # For testing locally
# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this "super secret" to something else!
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=15)  # Access token lifespan
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)    # Refresh token lifespan
jwt = JWTManager(app)
app.config['SECRET_KEY'] = '<repalce with session token from next.js>'

@app.route("/api/login", methods=['POST'])
def login():
    data = request.get_json()
    # TODO: retrieve user from db

    ###### Mock role-based user login below ######
    if data['email'] == 'admin@example.com':
        access_token = create_access_token(identity='admin', fresh=True)
        return jsonify(access_token=access_token, role='admin'), 200
    elif data['email'] == 'member@example.com':
        access_token = create_access_token(identity='member', fresh=True)
        return jsonify(access_token=access_token, role='member'), 200
    ##############################################

    return jsonify(message="Invalid credentials"), 401

@app.route('/api/role', methods=['GET'])
@jwt_required()
def role():
    role = get_jwt_identity()
    return jsonify(role=role), 200

@app.route("/register", methods=['POST'])
def register():
    pass


@app.route('/token', methods=['POST'])
def create_token():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    # Query your database for username and password
    user = CLIENT.user.query.filter_by(username=username, password=password).first()

    if user is None:
        # The user was not found on the database
        return jsonify({"msg": "Bad username or password"}), 401

    # Create a new token with the user id inside
    access_token = create_access_token(identity=user.id)
    return jsonify({ "token": access_token, "user_id": user.id })



if __name__ == '__main__':
    app.run(debug=True)