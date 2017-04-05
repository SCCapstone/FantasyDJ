from fantasydjhousekeeper import popular
import os
import pytest

def test_parse_track_ids():
    dirname = os.path.dirname(os.path.abspath(__file__))

    track_ids = popular.parse_track_ids(open(
        '{}/regional-us-daily-latest.csv'.format(dirname)
    ))

    count = 1
    for track_id in track_ids:
        if count == 1:
            assert track_id == '5mCPDVBb16L4XQwDdbRUpz'
        elif count == 23:
            assert track_id == '41eiwHEX8iegmqmS2cf7oX'
        elif count == 200:
            assert track_id == '6yr8GiTHWvFfi4o6Q5ebdT'
        count += 1
