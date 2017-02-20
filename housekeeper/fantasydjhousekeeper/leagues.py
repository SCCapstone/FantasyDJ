import logging
from .entities import League
from .songs import SongModel
from .util import get_val, get_date, str_from_date, now

logger = logging.getLogger(__name__)


def calc_points(stats):
    if stats and len(stats) > 1:
        prev_pop = None
        points_per_day = {}

        for stat in stats:
            cur_pop = stat.popularity

            if prev_pop:
                change = cur_pop - prev_pop
                points_per_day[str_from_date(stat.date)] = change

            prev_pop = cur_pop

        return points_per_day

    return True


def calc_winner(points_by_song_by_user):
    if points_by_song_by_user is None:
        raise ValueError('points_by_song_by_user cannot be null')

    # collapse points by song down to totals per user
    score_user_tups = [
        (sum(points.values()), user_id)
        for user_id, points in points_by_song_by_user
    ]

    # group users by their scores to determine if ties
    # have occurred
    users_by_score = {}
    for tup in score_user_tups:
        if not users_by_score.has_key(tup[0]):
            users_by_score[tup[0]] = []
        users_by_score[tup[0]].append(tup[1])

    # sort scores to find biggest
    scores = sorted(users_by_score.keys(), reverse=True)
    if len(users_by_score[scores[0]]) > 1:
        # there was a tie. no one won. yet?
        return False
    else:
        # there is a clear winner
        return users_by_score[scores[0]][0]


class LeagueModel(object):

    def __init__(self, db):
        self.db = db
        self.song_model = SongModel(db)

    def __league_from_result(self, fbleague):
        val = fbleague.val()

        if val is None:
            raise ValueError('value of league result is None')

        users = val['users'] if 'users' in val else {}
        league = League(
            fbleague.key(),
            val['name'],
            [key_id for key_id in users.keys()],
            get_date(val, 'draftDate'),
            get_date(val, 'endTime'),
            get_val(val, 'winner')
        )
        return league

    def get_league(self, league_id):
        return self.__league_from_result(
            self.db.child('Leagues/%s' % (league_id)).get()
        )

    def __get_leagues(self):
        fbleagues = self.db.child('Leagues').get()
        leagues = [
            self.__league_from_result(fbleague)
            for fbleague in fbleagues.each()
        ]
        return leagues

    def get_active_leagues(self):
        right_now = now()
        return [
            league for league in self.__get_leagues()
            if league.winner is None
            and league.endTime is not None
            and league.endTime > right_now
        ]

    def get_unfinished_leagues(self):
        right_now = now()
        return [
            league for league in self.__get_leagues()
            if league.winner is None
            and league.endTime is not None
            and league.endTime < right_now
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

    def set_points(self, league_id, user_id, song_id, points):
        self.db.child(
            'Leagues/%s/users/%s/%s' % (league_id, user_id, song_id)
        ).set(points)

    def set_winner(self, league_id, user_id):
        self.db.child('Leagues/%s/winner').set(user_id)
