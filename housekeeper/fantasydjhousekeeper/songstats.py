import logging
from datetime import datetime
from .entities import SongStat
from .util import str_from_date, get_date, EPOCH

logger = logging.getLogger(__name__)


class SongStatModel(object):

    def __init__(self, db):
        self.db = db

    def __query_song_stats(self, song_id, start_dt=None, end_dt=None):
        fbstats = self.db.child('SongStats')\
                  .order_by_child('songId')\
                  .start_at(str(song_id))\
                  .end_at(str(song_id))\
                  .get()
        if not start_dt:
            start_dt = EPOCH
        if not end_dt:
            end_dt = datetime.now()

        stats = []
        for fbstat in fbstats.each():
            val = fbstat.val()
            dt = get_date(val, 'date')
            if dt >= start_dt and dt <= end_dt:
                stats.append(fbstat)
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

    def get_song_stats(self, song_id, start_dt=None, end_dt=None):
        stats = [
            self.__stat_from_result(stat)
            for stat in self.__query_song_stats(song_id, start_dt, end_dt)
        ]
        stats.sort(key=lambda stat: stat.date)
        return stats

    def get_song_stat(self, song_id, date):
        for stat in self.__query_song_stats(
            song_id, date, date
        ).each():
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
