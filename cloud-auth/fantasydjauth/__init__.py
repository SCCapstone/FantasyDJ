from flask import Flask, request, redirect
import urllib
import jwt
import logging

logger = logging.getLogger(__name__)

app = Flask(__name__)

# Server-side Parameters
BIND_ADDR = 'localhost'
PORT = 80


@app.route('/')
def auth():
    # request received from Ionic Auth
    my_shared_secret = '<a_shared_secret>'
    redirect_uri = request.args['redirect_uri']
    state = request.args['state']

    try:
        incoming_token = jwt.decode(request.args['token'], my_shared_secret)
    except jwt.InvalidTokenError:
        raise

    user_id = incoming_token['data']['spotifyId']

    outgoing_token = jwt.encode({'user_id': user_id}, my_shared_secret)
    params = urllib.urlencode({
        'token': outgoing_token,
        'state': state,
        # TODO: Take out the redirect_uri parameter before production
        'redirect_uri': 'https://api.ionic.io/auth/integrations/custom/success'
    })
    url = '{}&{}'.format(redirect_uri, params)
    return redirect(url)


if __name__ == '__main__':
    app.run(BIND_ADDR, debug=True, port=PORT)
