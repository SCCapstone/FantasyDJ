import pyrebase
from .config import firebase_config
from .entities import League, Song
from .util import get_val, get_date
from datetime import datetime


firebase = pyrebase.initialize_app(firebase_config)
db = firebase.database()


def get_active_leagues():
  leagues = []
  fbleagues = db.child('Leagues').get()
  for fbleague in fbleagues.each():
    val = fbleague.val()
    league = League(
      fbleague.key(),
      val['name'],
      [key_id for key_id in val['users'].keys()],
      get_date(val, 'draftDate'),
      get_date(val, 'endTime'),
      get_val(val, 'winner')
    )
    leagues.append(league)

  now = datetime.now()
  return [
    league for league in leagues
    if league.winner is None
    #and league.draftDate is not None
    #and league.draftDate < now
  ]


def get_song(song_id):
  fbsong = db.child('Songs/%s' % song_id).get()
  val = fbsong.val()

  leagues = None
  try:
    leagues = [
      key_id for key_id in val['leagues'].keys()
    ]
  except KeyError:
    pass

  song = Song(
    fbsong.key(),
    get_val(val, 'artist'),
    get_val(val, 'name'),
    get_val(val, 'spotifyId'),
    leagues
  )
  return song


def get_playlists(league_id, user_id):
  fbplaylist = db.child(
    'Leagues/%s/users/%s' % (league_id, user_id)
  ).get()
  val = fbplaylist.val()
  if val in [True, False]:
    return None
  return [get_song(song_id) for song_id in val.keys()]

