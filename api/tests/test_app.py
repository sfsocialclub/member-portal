import pytest
from api import index  # Import your Flask app

@pytest.fixture
def client():
    index.config['TESTING'] = True
    with app.test_client() as client:
        yield client

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
    assert response.json == mock_data

def test_get_event(client):
    """
        This should accept the request and return a 200. The password should be changed
        for that user
    """
    pass

def test_get_user_is_correct_user(client):
    """
        GIVEN userID the app should 
        Check if the current user is the one who's ID is passed in
        RETURN 200, and data related to user
    """
    pass

def test_get_user_is_incorrect_user(client):
    """
        GIVEN the user id of a different user this should
        RETURN a 400 request and block user access
    """
    pass

def test_change_user_password_incorrect_user(client):
    """
        This should immediatly return a 400 request and block the changed password
    """
    pass

def test_change_user_password_correct_user(client):
    """
        This should accept the request and return a 200. The password should be changed
        for that user
    """
    pass

def test_registration(client):
    """
        This should accept the request and return a 200. The password should be changed
        for that user
    """
    pass

def test_registration_fail(client):
    """
        This should accept the request and return a 200. The password should be changed
        for that user
    """
    pass

def test_login(client):
    """
        This should accept the request and return a 200. The password should be changed
        for that user
    """
    pass

def test_login_fail(client):
    """
        This should accept the request and return a 200. The password should be changed
        for that user
    """
    pass


def test_token_validation(client):
    """
        This should accept the request and return a 200. The password should be changed
        for that user
    """
    pass
