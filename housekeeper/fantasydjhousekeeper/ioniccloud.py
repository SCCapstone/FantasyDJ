import requests
import json

__URL_API_PUSH = 'https://api.ionic.io/push/notifications'

# 'housekeeper' API token generated at ionic.io
__TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZDdmMTU3Z' + \
    'i04OTNkLTRlOTctYTljNi04ZDlhM2I2NGE2MjEifQ.wzsqQHv7bIDmpfvrT3eyhU' + \
    '00N7f6p9QtsNyqcRW6xBc'

__HEADERS = {
    'Authorization': 'Bearer ' + __TOKEN,
    'Content-Type': 'application/json'
}


def __init_data(external_id, message):
    return {
        'external_ids': [external_id],
        'profile': 'push',
        'notification': {
            'message': message
        }
    }


def send_push(external_id, message):
    r = requests.post(__URL_API_PUSH,
                      data=json.dumps(
                          __init_data(external_id, message)
                      ),
                      headers=__HEADERS)
    return r.json()
