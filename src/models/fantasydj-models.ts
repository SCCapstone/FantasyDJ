export interface User {
  id?: string,
  email?: string,
  leagues?: any[],
  dateCreated: Date
};

export interface League {
  id: string,
  name: string,
  creator: string,
  users: any[],
  draftDate: Date,
  startTime: Date,
  endTime: Date,
  winner: string
};

export interface Song {
  id: string,
	artist: string,
  album: string,
	name: string,
	spotifyId: string,
	leagues: any[],
  artwork?: string
};

export interface SongStat {
  id: string,
  songId: string,
  date: Date,
  popularity: number
};

export interface Score {
  key: string,
  scores: any[],
  total: number
};
