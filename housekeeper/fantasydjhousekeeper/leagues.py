import logging
from .entities import League
from .songs import SongModel
from .util import get_val, get_date


logger = logging.getLogger(__name__)


class LeagueModel(object):

    def __init__(self, db):
        self.db = db
        self.song_model = SongModel(db)

    def get_active_leagues(self):
        leagues = []
        fbleagues = self.db.child('Leagues').get()
        for fbleague in fbleagues.each():
            val = fbleague.val()
            loaded = League(
                fbleague.key(),
                val['name'],
                [key_id for key_id in val['users'].keys()],
                get_date(val, 'draftDate'),
                get_date(val, 'endTime'),
                get_val(val, 'winner')
            )
            leagues.append(loaded)

        # now = datetime.now()
        return [
            league for league in leagues
            if league.winner is None
            # and league.draftDate is not None
            # and league.draftDate < now
        ]

    def get_playlist(self, league_id, user_id):
        fbplaylist = self.db.child(
            'Leagues/%s/users/%s' % (league_id, user_id)
        ).get()
        val = fbplaylist.val()

        if val in [True, False, None] or not hasattr(val, 'keys'):
            return None

        songs = [self.song_model.get_song(song_id) for song_id in val.keys()]

        return [song for song in songs if song is not None]
