import logging
from .entities import Song
from .util import get_val


logger = logging.getLogger(__name__)


class SongModel(object):

    def __init__(self, db):
        self.db = db

    def __song_from_result(self, fbsong):
        val = fbsong.val()

        if val is None:
            raise ValueError('value of song result is None')

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

    def get_song(self, song_id):
        return self.__song_from_result(
            self.db.child('Songs/%s' % song_id).get()
        )

    def get_song_by_spotify_id(self, track_id):
        res = self.db.child('Songs')\
              .order_by_child('spotifyId')\
              .start_at(track_id)\
              .end_at(track_id)\
              .get()
        for fbsong in res.each():
            return self.__song_from_result(fbsong)
        return None
