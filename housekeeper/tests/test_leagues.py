from fantasydjhousekeeper import leagues, util
from fantasydjhousekeeper.entities import SongStat
import pytest


TMPL_KEY = '-K{}'
TMPL_DT = '2017-01-0{}'
TMPL_SONG_ID = '-Ksong{}'


def __create_stats(*popularities, **kwargs):
    day = 1

    sg_idx = kwargs['sg_idx'] if kwargs.has_key('sg_idx') else 0

    stats = []
    for popularity in popularities:
        stat = SongStat(
            TMPL_KEY.format(day),
            TMPL_SONG_ID.format(sg_idx),
            util.date_from_str(TMPL_DT.format(day)),
            popularity
        )
        print(
            'stat: id={}, songId={}, date={}, popularity={}'.format(
                stat.id, stat.songId, stat.date, stat.popularity
            )
        )
        stats.append(stat)
        day += 1

    return stats


def __assert_day_points(points, day, expected):
    assert points[TMPL_DT.format(day)] == expected


def test_calc_points():
    points = leagues.calc_points(None)
    assert points is True

    points = leagues.calc_points(__create_stats())
    assert points is True

    points = leagues.calc_points(__create_stats(90))
    assert points is True

    points = leagues.calc_points(__create_stats(90, 90))
    __assert_day_points(points, 2, 0)

    points = leagues.calc_points(__create_stats(90, 91))
    __assert_day_points(points, 2, 1)

    points = leagues.calc_points(__create_stats(90, 89))
    __assert_day_points(points, 2, -1)


def __create_points():
    pass


def test_calc_winner():
    with pytest.raises(ValueError):
        leagues.calc_winner(None)
