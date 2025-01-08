# Overview

Our backend consists of a flask app, connecting to the front end via a next.js integration and mongodb as our database. This will outline local setup, and installation instructions


## TODO
        1. Fix 415 status code on registration - Fixed: add name field to registration form
        2. finish crud operations - DONE need to test
        2a. test code
        3. security checks
            a. users can't update anyones password but there own
            b. only admins or owners of events can delete or update events
            c. only admins can view other users information
            b. password encrypttion works
            e. database security
            f. encrypt data in transit; plaintext passwords in payload
        4. every user has points
            if you go to event you get a point
            if you dont show up subtract a point
        5. events add points to events 
        6. Duplicate handling/prevention
## MongoDB Local setup (Mac)

[installation doc](https://www.mongodb.com/docs/manual/installation/)


starts mogodb service:

```mongod```

start mongo shell

```mongosh```


## Flask setup

``` pip install -r requirements.txt ```

```python index.py```


# Collection Schemas


### Users
* name
* password
* email
* points
* events-attended
* events-created
* events-missed
* created_at
* updated_at
* role

### Events
* name
* host
* location
* attended
* descrption
* event_date
* partiful_link
* qr-codes
* ics-file
* created_at
* updated_at
* is_paid
* attendance_points

# API Documentation

| API | Status Codes | Response |
|----------|----------|----------|
|Register  | 200  | Data 2   |
| Row 2    | Data 3   | Data 4   |