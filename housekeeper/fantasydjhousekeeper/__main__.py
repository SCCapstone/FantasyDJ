from . import spotify
import fantasydj

sp = spotify.Spotify()
print(sp.spotify.me())

fantasydj.update_song_stats(sp)
