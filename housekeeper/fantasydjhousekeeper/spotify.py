import spotipy
import spotipy.util as util
from . import config

def auth():
  token = util.prompt_for_user_token(
    config.spotify_username,
    config.spotify_scope,
    config.spotify_client_id,
    config.spotify_client_secret,
    config.spotify_redirect_uri
  )

  if (token):
    return spotipy.Spotify(auth=token)
  else:
    raise ValueError("can't get token for %s" % (username))
