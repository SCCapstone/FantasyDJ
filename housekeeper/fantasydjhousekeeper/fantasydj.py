import pyrebase
from .config import firebase_config
from .entities import League, Song, SongStat
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

    # now = datetime.now()
    return [
        league for league in leagues
        if league.winner is None
        # and league.draftDate is not None
        # and league.draftDate < now
    ]


def get_song(song_id):
    fbsong = db.child('Songs/%s' % song_id).get()
    val = fbsong.val()

    leagues = None
    try:
        leagues = [key_id for key_id in val['leagues'].keys()]
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


def get_playlist(league_id, user_id):
    fbplaylist = db.child(
        'Leagues/%s/users/%s' % (league_id, user_id)
    ).get()
    val = fbplaylist.val()

    if val in [True, False, None] or not hasattr(val, 'keys'):
        return None

    return [get_song(song_id) for song_id in val.keys()]


def get_song_stat(song_id, date_str):
    stats = db.child('SongStats')\
              .order_by_child('songId')\
              .start_at(song_id)\
              .end_at(song_id)\
              .get()
    for stat in stats.each():
        val = stat.val()
        if val['date'] == date_str:
            return SongStat(
                stat.key(),
                val['songId'],
                val['date'],
                val['popularity']
            )
    return None


def add_song_stat(song_id, popularity):
    date_str = datetime.now().date().strftime('%Y-%m-%d')
    data = {
        'songId': song_id,
        'date': date_str,
        'popularity': popularity
    }

    if not get_song_stat(song_id, date_str):
        db.child('SongStats').push(data)


def update_song_stats(spotify):
    for league in get_active_leagues():
        print league.name
        if league.users is not None:
            for user_id in league.users:
                songs = get_playlist(league.id, user_id)
                if songs:
                    print('  %s:' % (user_id))
                    for song in songs:
                        popularity = spotify.popularity(song.spotifyId)
                        print('    %s by %s (%s, popularity: %s)' % (
                            song.name,
                            song.artist,
                            song.spotifyId,
                            popularity
                        ))
                        add_song_stat(song.id, popularity)
