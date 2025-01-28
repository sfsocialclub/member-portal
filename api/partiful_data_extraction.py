import requests
import json

URL = "https://api.partiful.com/getGuests"
HEADERS = {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjQwZDg4ZGQ1NWQxYjAwZDg0ZWU4MWQwYjk2M2RlNGNkOGM0ZmFjM2UiLCJ0eXAiOiJKV1QifQ.eyJwaWN0dXJlIjoiaHR0cHM6Ly9maXJlYmFzZXN0b3JhZ2UuZ29vZ2xlYXBpcy5jb20vdjAvYi9nZXRwYXJ0aWZ1bC5hcHBzcG90LmNvbS9vL3Byb2ZpbGVJbWFnZXMlMkZmZTEyZTMxNC04NDNhLTQ3N2QtYmY_YWx0PW1lZGlhJnRva2VuPWE4ZTFjMTg3LWU1NjUtNDRkYy1hNTQ0LTYzNjRlYWE5NTE2MiIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9nZXRwYXJ0aWZ1bCIsImF1ZCI6ImdldHBhcnRpZnVsIiwiYXV0aF90aW1lIjoxNzM2ODg2NjQ5LCJ1c2VyX2lkIjoiR09rTmhyQXVTQ2hBMnVWR0U4QnpMS3V1NWI4MiIsInN1YiI6IkdPa05ockF1U0NoQTJ1VkdFOEJ6TEt1dTViODIiLCJpYXQiOjE3MzY5OTc0NjUsImV4cCI6MTczNzAwMTA2NSwicGhvbmVfbnVtYmVyIjoiKzE0NDM0NjczNjg3IiwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJwaG9uZSI6WyIrMTQ0MzQ2NzM2ODciXX0sInNpZ25faW5fcHJvdmlkZXIiOiJjdXN0b20ifX0.oC_vqGt3IbXfL6kNMkBDcSrkSd4CJxnCk_t9hCrmu9FFUlSm-_Dc75cQO4RcTWgp0WNQeCsUBwXhdgdc8g115e_YKkwarWvtZRDM_uk_CT2YCQazQdyCAV0fiQjDOmVH1tg8RZRQUSVBc1i6IaGnRoeOzTUC0jWBmMbaO9gPDH36fLjVGU7wfCvoWFaOjc4BqPHa2i_KIGCSPiiXhmGyYAyb_ioCqoIjhf1JMbCwmF5LJVTjVWUjFbgFPGtwlYL2QAvBIYXPFy8CxJFPl-YSRHxvms0bOK3qz03dIouPLgIScyYe_UwOcfxq4ovKiujTwIvd_Kslhw35tqlYSg7YPw',
    'content-type': 'application/json',
    'dnt': '1',
    'origin': 'https://partiful.com',
    'priority': 'u=1, i',
    'referer': 'https://partiful.com/',
    'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    }
def extract_event_data(event_id):
    payload = json.dumps({
    "data": {
        "params": {
        "eventId": event_id, #" Example ID: 4hISEuaxpg1LL7Wfbluc",
        "includeInvitedGuests": True
        },
        "paging": {
        "cursor": None,
        "maxResults": 500
        },
        "userId": "GOkNhrAuSChA2uVGE8BzLKuu5b82"
    }
    })
    response = requests.request("POST", URL, headers=HEADERS, data=payload)

    print(response.text)
