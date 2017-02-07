import logging
from .entities import League
from .songs import SongModel
from .util import get_val, get_date


logger = logging.getLogger(__name__)


class LeagueModel(object):

    def __init__(self, db):
        self.db = db
        self.song_model = SongModel(db)

    def __league_from_result(self, fbleague):
        val = fbleague.val()

        if val is None:
            raise ValueError('value of league result is None')

        league = League(
            fbleague.key(),
            val['name'],
            [key_id for key_id in val['users'].keys()],
            get_date(val, 'draftDate'),
            get_date(val, 'endTime'),
            get_val(val, 'winner')
        )
        return league

    def get_active_leagues(self):
        fbleagues = self.db.child('Leagues').get()
        leagues = [
            self.__league_from_result(fbleague)
            for fbleague in fbleagues.each()
        ]

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

        songs = []
        for song_id in val.keys():
            try:
                songs.append(self.song_model.get_song(song_id))
            except:
                logger.debug('song %s may not exist' % (song_id))
                pass

        return songs

