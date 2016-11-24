export interface User {
  id?: string,
  leagues?: any[],
  dateCreated: Date
};

export interface League {
  id: string,
  name: string,
  users: any[],
  draftDate: Date,
  endTime: Date,
  winner: string;
};

export interface Song {
	artist: string,
	name: string,
	spotifyId: string,
	leagues: any[];
};
