from . import spotify
import fantasydj
import argparse

parser = argparse.ArgumentParser(description='FantasyDJ nightly housekeeping process')
parser.add_argument('-t', '--track', help="the spotify track id of a song for which you wish to get stats")
parser.add_argument('-a', '--alltracks', action="store_true", help="get all stats, grouped by song")
args = parser.parse_args()

if args.alltracks:
    fantasydj.print_song_stats()

elif args.track is not None:
    song = fantasydj.get_song_by_spotify_id(args.track)
    if song is not None:
        fantasydj.print_song_stats(song.id)
    else:
        print("No song returned for %s" % args.track)

else:
    sp = spotify.Spotify()
    fantasydj.update_song_stats(sp)
