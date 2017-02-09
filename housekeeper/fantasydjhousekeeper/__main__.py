from .fantasydj import FantasyDJ
import argparse

parser = argparse.ArgumentParser(
    description='FantasyDJ nightly housekeeping process'
)
parser.add_argument(
    '-t',
    '--track',
    help='the spotify track id of a song for which you wish to get stats'
)
parser.add_argument(
    '-a',
    '--alltracks',
    action='store_true',
    help='get all stats, grouped by song'
)
args = parser.parse_args()

fantasydj = FantasyDJ()

if args.alltracks:
    fantasydj.print_song_stats()

elif args.track is not None:
    fantasydj.print_song_stats(spotify_track_id=args.track)

else:
    fantasydj.update_song_stats()
