from .fantasydj import FantasyDJ
import ioniccloud
import argparse

parser = argparse.ArgumentParser(
    description='FantasyDJ nightly housekeeping process'
)
parser.add_argument(
    '-T',
    '--testdata',
    action='store_true',
    help='update test leagues with fake stat data'
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
parser.add_argument(
    '-p',
    '--push',
    help='send push notification. use in conjunction with --user'
)
parser.add_argument(
    '-u',
    '--user',
    help='user to receive push notification specified with --push'
)
args = parser.parse_args()

fantasydj = FantasyDJ()

if args.alltracks:
    fantasydj.print_song_stats()

elif args.track is not None:
    fantasydj.print_song_stats(spotify_track_id=args.track)

elif args.push is not None:
    if args.user is not None:
        result = ioniccloud.send_push(args.user, args.push)
        print result
    else:
        print('No user specified to receive push notification')

elif args.testdata:
    fantasydj.update_test_leagues()

else:
    fantasydj.update_active_leagues()
    fantasydj.update_unfinished_leagues()
