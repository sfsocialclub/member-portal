import pytest
import sys
import os
import json

# Adding index to the current path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from index import app  # Import your Flask app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@pytest.fixture
def user_data():
    return {
        "name": "test account",
        "email": "test@example.com",
        "password":"123456",
        "role": "user"
    }

@pytest.fixture
def jwt_token():
    return {'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTczNjYzNzUwMiwianRpIjoiMDQzMWFhMTYtYWZlNy...WYyLTM2MjZmZWI0OWNjZiIsImV4cCI6MTczNjYzODQwMn0.Lv-rHLJXwGvoMnMBaIlCuRxBXlMKosPQpfOmKjdhqoQ', 'user_id': 'test account'}

def test_registration(client):
    """
        This should accept the request and return a 200. The password should be changed
        for that user
    """
    user = {
        "name": "test account",
        "email": "test@example.com",
        "password":"123456"
    }
    resp = client.post("/register",data=json.dumps(user),content_type="application/json")
    print(resp)
    data = resp.get_json()
    assert resp.status_code == 200
    assert "userId" in data

def test_registration_fail(client, user_data):
    """
        This should accept the request and return a 200. The password should be changed
        for that user
    """
    resp = client.post("/register",data=json.dumps(user_data),content_type="application/json")  
    data = resp.get_json()
    assert resp.status_code == 400

def test_token_validation(client, user_data):
   """
        This should accept the request and return a 200. The password should be changed
        for that user
   """
   resp = client.post("/token",data=json.dumps(user_data),content_type="application/json")
   data = resp.get_json()
   assert "test" in data

def test_login(client, user_data):
   """
    This should accept the request and return a 200. The password should be changed
        for that user
   """
   resp = client.post("/login",data=json.dumps(user_data),content_type="application/json")
   data = resp.get_json()
   assert resp.status_code == 200
   assert 'role' in data

def test_login_fail_missing_data(client):
   """
        This should accept the request and return a 200. The password should be changed
        for that user
   """
   resp = client.post("/login",data=json.dumps({}),content_type="application/json")
   data = resp.get_json()
   assert resp.status_code == 415
   assert 'error' in data

def test_get_events(client):
    """
        GIVEN GET request app should
        RETURN all events and required fields
    """
    # Mock the database or API call
    mock_data = [
        {'id': 1, 'name': 'SHACK15'},
        {'id': 2, 'name': 'Coffee Meetup'}
    ]

    # # Replace the actual database call with the mock data
    # with app.app_context():
    #     from your_app.models import User  # Import your model
    #     User.query.all = lambda: mock_data

    # Make a request to your endpoint
    response = client.get('/events')

    # Assert the response status code and content
    assert response.status_code == 200
    # assert response.json == mock_data

def test_get_event(client):
    """
        This should accept the request and return a 200. The password should be changed
        for that user
    """
    event = {"id":"1"}
    resp = client.get(f"/event/{event["id"]}",content_type="application/json")
    data = resp.get_json()
    assert resp.status_code == 200
    assert "name" in data

def test_get_user_is_correct_user(client):
    """
        GIVEN userID the app should 
        Check if the current user is the one who's ID is passed in
        RETURN 200, and data related to user
    """
    user = {"id": 1}
    resp = client.get(f"/user/{user["id"]}",content_type="application/json")
    data = resp.get_json()
    assert resp.status_code == 200
    assert "name" in data
    assert "points" in data

def test_get_user_with_incorrect_user(client):
    """
        GIVEN the user id of a different user this should
        RETURN a 400 request and block user access
    """
    user = {"id": 15}
    resp = client.get(f"/user/{user["id"]}",content_type="application/json")
    data = resp.get_json()
    assert resp.status_code == 400
    assert "error" in data

def test_change_user_password_incorrect_user(client):
    """
        This should immediatly return a 400 request and block the changed password
    """
    updated = {
        "email":"test@example.com",
        "password": "123"
    }
    resp = client.put(f"update-password{user_data["password"]}", data=json.dumps(updated), content_type="application/json")
    data = resp.get_json()
    assert resp.status_code == 400
    assert "error" in data

def test_change_user_password_correct_user(client, user_data):
    """
        This should accept the request and return a 200. The password should be changed
        for that user
    """
    updated = {
        "email":"test@example.com",
        "password": "123"
    }
    resp = client.put(f"update-password{user_data["password"]}", data=json.dumps(updated), content_type="application/json")
    data = resp.get_json()
    assert resp.status_code == 200
    assert "sucess" in data