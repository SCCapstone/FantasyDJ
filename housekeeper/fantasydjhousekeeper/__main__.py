from . import spotify
import fantasydj

sp = spotify.auth()
print(sp.me())

for league in fantasydj.get_active_leagues():
  print league.name
  if league.users is not None:
    for user_id in league.users:
      songs = fantasydj.get_playlists(league.id, user_id)
      if songs:
        print('%s: %s' % (user_id, songs))


