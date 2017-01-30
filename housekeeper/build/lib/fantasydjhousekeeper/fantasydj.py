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


def __song_from_result(fbsong):
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


def get_song(song_id):
    return __song_from_result(db.child('Songs/%s' % song_id).get())


def get_song_by_spotify_id(track_id):
    res = db.child('Songs')\
          .order_by_child('spotifyId')\
          .start_at(track_id)\
          .end_at(track_id)\
          .get()
    for fbsong in res.each():
        return __song_from_result(fbsong)
    return None


def get_playlist(league_id, user_id):
    fbplaylist = db.child(
        'Leagues/%s/users/%s' % (league_id, user_id)
    ).get()
    val = fbplaylist.val()

    if val in [True, False, None] or not hasattr(val, 'keys'):
        return None

    return [get_song(song_id) for song_id in val.keys()]


def __query_song_stats(song_id):
    stats = db.child('SongStats')\
              .order_by_child('songId')\
              .start_at(str(song_id))\
              .end_at(str(song_id))\
              .get()
    return stats


def get_all_stats_grouped_by_song_id(song_id=None):
    stats_by_song = {}

    query = db.child('SongStats').order_by_child('songId')

    if song_id:
        query.start_at(str(song_id)).end_at(str(song_id))

    stats = query.get()
    for fbstat in stats.each():
        stat = __stat_from_result(fbstat)
        if not stats_by_song.has_key(stat.songId):
            stats_by_song[stat.songId] = []
        stats_by_song[stat.songId].append(stat)

    for key in stats_by_song.keys():
        stats_by_song[key].sort(key=lambda stat: stat.date)

    return stats_by_song


def __stat_from_result(stat):
    val = stat.val()
    return SongStat(
        stat.key(),
        val['songId'],
        get_date(val, 'date'),
        val['popularity']
    )


def get_song_stats(song_id):
    res = __query_song_stats(song_id)
    return [__stat_from_result(stat) for stat in res.each()]


def get_song_stat(song_id, date_str):
    for stat in __query_song_stats(song_id).each():
        if stat.val()['date'] == date_str:
            return __stat_from_result(stat)
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


def print_song_stats(provided_song_id=None):
    for song_id, stats in get_all_stats_grouped_by_song_id(provided_song_id).iteritems():
        try:
            song = get_song(song_id)
            print(u'%s by %s (%s):' % (song.name, song.artist, song.spotifyId)).encode('UTF-8')
        except TypeError:
            print('song %s may not exist' % (song_id))

        for stat in stats:
            print('  %s: %s' % (stat.date, stat.popularity))


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
                        print(u'    %s by %s (%s, popularity: %s)' % (
                            song.name,
                            song.artist,
                            song.spotifyId,
                            popularity
                        )).encode('UTF-8')
                        add_song_stat(song.id, popularity)

