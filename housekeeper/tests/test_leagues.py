from fantasydjhousekeeper import leagues, util
from fantasydjhousekeeper.entities import SongStat
import pytest


TMPL_KEY = '-K{}'
TMPL_DT = '2017-01-0{}'
TMPL_SONG_ID = '-Ksong{}'


def __create_stats(*popularities, **kwargs):
    day = 1

    sg_idx = kwargs['sg_idx'] if 'sg_idx' in kwargs else 0
    koffset = kwargs['koffset'] if 'koffset' in kwargs else 0

    stats = []
    for popularity in popularities:
        stat = SongStat(
            TMPL_KEY.format(day + koffset),
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


def __create_user_points(*poplists, **kwargs):
    sg_idx = kwargs['sg_idx'] if 'sg_idx' in kwargs else 0
    koffset = kwargs['koffset'] if 'koffset' in kwargs else 0

    songs = {}
    for poplist in poplists:
        stats = __create_stats(*poplist, sg_idx=sg_idx, koffset=koffset)
        songId = stats[0].songId
        points = leagues.calc_points(stats)
        songs[songId] = points
        sg_idx += 1
        koffset += len(poplist)

    return songs


TMPL_USERNAME = 'u{}'


def __create_points(*poplistslists):
    usr_idx = 0
    sg_idx = 0
    sg_idx_dx = len(poplistslists[0])
    koffset = 0
    koffset_dx = len(poplistslists[0][0]) * sg_idx_dx
    points = {}
    for poplistslist in poplistslists:
        points[TMPL_USERNAME.format(usr_idx)] = \
            __create_user_points(
                *poplistslist,
                sg_idx=sg_idx,
                koffset=koffset
            )
        sg_idx += sg_idx_dx
        koffset += koffset_dx
        usr_idx += 1
    return points


def test_calc_winner():
    with pytest.raises(ValueError):
        leagues.calc_winner(None)

    points = __create_points([
        [0], [0], [0]
    ], [
        [0], [0], [0]
    ])
    assert leagues.calc_winner(points) is None

    points = __create_points([
        [0, 0], [0, 0], [0, 0]
    ], [
        [0, 0], [0, 0], [0, 0]
    ])
    assert leagues.calc_winner(points) is False

    points = __create_points([
        [0, 0], [0, 0], [0, 1]
    ], [
        [0, 0], [0, 0], [0, 0]
    ])
    assert leagues.calc_winner(points) == 'u0'

    points = __create_points([
        [0, 0], [0, 0], [0, -1]
    ], [
        [0, 0], [0, 0], [0, 0]
    ])
    assert leagues.calc_winner(points) == 'u1'
