import logging
import csv
import urllib2
from .config import spotify_toptracks_url


logger = logging.getLogger(__name__)


def parse_track_ids(csvfile):
    cr = csv.reader(csvfile)
    track_ids = []

    skip = True # to skip first row, which is header
    for row in cr:
        if not skip:
            track_ids.append(row[4].split('/')[-1])
        else:
            skip = False

    return track_ids


class PopularModel(object):

    def __init__(self, db):
        self.db = db

    def update_popular(self):
        response = urllib2.urlopen(spotify_toptracks_url)
        track_ids = parse_track_ids(response)

        count = 1

        for track_id in track_ids:
            self.db.child('Popular/tracks/%s' % (count)).set(track_id)
            count += 1
