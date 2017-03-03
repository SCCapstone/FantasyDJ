import pyrebase
from .config import firebase_config
import logging
from .leagues import LeagueModel, calc_points, calc_winner
from .songs import SongModel
from .songstats import SongStatModel, generate_fake_stats
from .util import str_from_date
from .spotify import Spotify

logger = logging.getLogger(__name__)


firebase = pyrebase.initialize_app(firebase_config)
db = firebase.database()


class FantasyDJ(object):

    def __init__(self):
        self.league_model = LeagueModel(db)
        self.song_model = SongModel(db)
        self.stat_model = SongStatModel(db)
        self.spotify = Spotify()

    def print_song_stats(self, provided_song_id=None, spotify_track_id=None):
        if not provided_song_id and spotify_track_id:
            provided_song_id = self.song_model.get_song_by_spotify_id(
                spotify_track_id
            ).id
        for song_id, stats in self.stat_model.get_all_stats_grouped_by_song_id(
                provided_song_id
        ).iteritems():
            try:
                song = self.song_model.get_song(song_id)
                logger.debug('successfully got song %s' % (song_id))
                stats_str = [
                    '%s: %s' % (
                        str_from_date(stat.date),
                        stat.popularity
                    ) for stat in stats
                ]
                print(u'%s by %s (%s): %s' % (
                    song.name,
                    song.artist,
                    song.spotifyId,
                    stats_str
                )).encode('UTF-8')

            except:
                logger.debug('song %s may not exist' % (song_id))

    def __update_song_stats(self, song):
        popularity = self.spotify.popularity(
            song.spotifyId
        )
        logger.info(
            u'got popularity %s for song %s by %s (%s)' % (
                popularity,
                song.name,
                song.artist,
                song.spotifyId
            )
        )
        self.stat_model.add_song_stat(song.id, popularity)

    def __update_points(self, league, song, user_id, is_test=False):
        song_stats = None
        if is_test:
            song_stats = generate_fake_stats(
                song.id,
                league.startTime,
                league.endTime
            )
        else:
            song_stats = self.stat_model.get_song_stats(
                song.id,
                league.startTime,
                league.endTime
            )

        points = calc_points(song_stats)
        self.league_model.set_points(
            league.id,
            user_id,
            song.id,
            points
        )

        print(u'song %s by %s (%s), points: %s' % (
            song.name,
            song.artist,
            song.spotifyId,
            points
        )).encode('UTF-8')

        return points

    def __update_leagues(self, leagues, calc_winners=False, is_test=False):
        for orig_league in leagues:
            logger.info('entering unfinished league {}'.format(orig_league.name))
            league = orig_league
            if is_test:
                league = self.league_model.update_test_league(orig_league.id)
            if league.users is not None:
                points_by_song_by_user = {}
                for user_id in league.users:
                    points_by_song_by_user[user_id] = {}
                    songs = self.league_model.get_playlist(league.id, user_id)
                    if songs:
                        logger.info(
                            'entering playlist for user {}'.format(user_id)
                        )
                        for song in songs:
                            if not is_test:
                                self.__update_song_stats(song)
                            points_by_song_by_user[user_id][song.id] = \
                                self.__update_points(league,
                                                     song,
                                                     user_id,
                                                     is_test)

                if calc_winners:
                    self.league_model.set_winner(
                        league.id,
                        calc_winner(points_by_song_by_user)
                    )

    def update_active_leagues(self):
        self.__update_leagues(self.league_model.get_active_leagues())

    def update_unfinished_leagues(self):
        self.__update_leagues(self.league_model.get_unfinished_leagues(), True)

    def update_test_leagues(self):
        self.__update_leagues(
            self.league_model.get_new_test_leagues(), True, True
        )
