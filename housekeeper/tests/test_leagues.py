from fantasydjhousekeeper import leagues, util
from fantasydjhousekeeper.entities import SongStat


TMPL_KEY = '-K{}'
TMPL_DT = '2017-01-0{}'
SONG_ID = '-Ksong'


def __create_data(*popularities):
    day = 1

    stats = []
    for popularity in popularities:
        stat = SongStat(
            TMPL_KEY.format(day),
            SONG_ID,
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

    points = leagues.calc_points(__create_data())
    assert points is True

    points = leagues.calc_points(__create_data(90))
    assert points is True

    points = leagues.calc_points(__create_data(90, 90))
    __assert_day_points(points, 2, 0)

    points = leagues.calc_points(__create_data(90, 91))
    __assert_day_points(points, 2, 1)

    points = leagues.calc_points(__create_data(90, 89))
    __assert_day_points(points, 2, -1)
