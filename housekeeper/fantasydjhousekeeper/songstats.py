import logging
from datetime import datetime
from .entities import SongStat
from .util import str_from_date, get_date

logger = logging.getLogger(__name__)


class SongStatModel(object):

    def __init__(self, db):
        self.db = db

    def __query_song_stats(self, song_id):
        stats = self.db.child('SongStats')\
                  .order_by_child('songId')\
                  .start_at(str(song_id))\
                  .end_at(str(song_id))\
                  .get()
        return stats

    def get_all_stats_grouped_by_song_id(self, song_id=None):
        stats_by_song = {}

        query = self.db.child('SongStats').order_by_child('songId')

        if song_id:
            query.start_at(str(song_id)).end_at(str(song_id))

        stats = query.get()
        for fbstat in stats.each():
            stat = self.__stat_from_result(fbstat)
            if stat.songId not in stats_by_song:
                stats_by_song[stat.songId] = []
            stats_by_song[stat.songId].append(stat)

        for key in stats_by_song.keys():
            stats_by_song[key].sort(key=lambda stat: stat.date)

        return stats_by_song

    def __stat_from_result(self, stat):
        val = stat.val()
        return SongStat(
            stat.key(),
            val['songId'],
            get_date(val, 'date'),
            val['popularity']
        )

    def get_song_stats(self, song_id):
        res = self.__query_song_stats(song_id)
        return [self.__stat_from_result(stat) for stat in res.each()]

    def get_song_stat(self, song_id, date_str):
        for stat in self.__query_song_stats(song_id).each():
            if stat.val()['date'] == date_str:
                return self.__stat_from_result(stat)
        return None

    def add_song_stat(self, song_id, popularity):
        date_str = str_from_date(datetime.now().date())
        data = {
            'songId': song_id,
            'date': date_str,
            'popularity': popularity
        }

        if not self.get_song_stat(song_id, date_str):
            self.db.child('SongStats').push(data)
