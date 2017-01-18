class User(object):

  def __init__(self, id, leagues, dateCreated):
    self.id = id
    self.leagues = leagues
    self.dateCreated = dateCreated


class League(object):

  def __init__(self, id, name, users, draftDate, endTime, winner):
    self.id = id
    self.name = name
    self.users = users
    self.draftDate = draftDate
    self.endTime = endTime
    self.winner = winner


class Song(object):

  def __init__(self, id, artist, name, spotifyId, leagues):
    self.id = id
    self.artist = artist
    self.name = name
    self.spotifyId = spotifyId
    self.leagues = leagues


class SongStat(object):

  def __init__(self, id, songId, date, popularity):
    self.id = id
    self.songId = songId
    self.date = date
    self.popularity = popularity

