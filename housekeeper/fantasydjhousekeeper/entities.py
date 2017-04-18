class User(object):

    def __init__(self, id, leagues, dateCreated):
        self.id = id
        self.leagues = leagues
        self.dateCreated = dateCreated


class League(object):

    def __init__(self, id, name, users, startTime, endTime, winner, isTest):
        self.id = id
        self.name = name
        self.users = users
        self.startTime = startTime
        self.endTime = endTime
        self.winner = winner
        self.isTest = isTest


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


class Request(object):

    def __init__(self, id, user, created, fulfilled):
        self.id = id
        self.user = user
        self.created = created
        self.fulfilled = fulfilled
