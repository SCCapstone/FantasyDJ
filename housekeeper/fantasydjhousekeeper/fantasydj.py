import pyrebase
from .config import firebase_config
import logging
from .leagues import LeagueModel
from .songs import SongModel
from .songstats import SongStatModel
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

    def update_song_stats(self):
        for league in self.league_model.get_active_leagues():
            logger.info('entering league %s' % (league.name))
            if league.users is not None:
                for user_id in league.users:
                    songs = self.league_model.get_playlist(league.id, user_id)
                    if songs:
                        logger.info(
                            'entering playlist for user %s:' % (user_id)
                        )
                        for song in songs:
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
