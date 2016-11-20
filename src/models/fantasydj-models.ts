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
