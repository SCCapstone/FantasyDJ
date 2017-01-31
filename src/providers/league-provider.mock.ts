import { Observable } from 'rxjs/Observable';
import { League } from '../models/fantasydj-models';

export class LeagueDataMock {

  public static LEAGUES: Array<League> = [
    <League>{
      id: '-KbmR7uWBQKMzbRSyeN5',
      name: 'Test League 1',
      users: [],
      draftDate: null,
      endTime: null,
      winner: null
    },
    <League>{
      id: '-KbmRcx2VDzbUbujLSYZ',
      name: 'Test League 2',
      users: [],
      draftDate: null,
      endTime: null,
      winner: null
    },
    <League>{
      id: '-KbmRgI3WVFkNexx0fr3',
      name: 'Test League 3',
      users: [],
      draftDate: null,
      endTime: null,
      winner: null
    },
  ];

  public loadLeague(leagueId: string): Promise<League> {
    return Promise.resolve(LEAGUES[0]);
  }

  public loadLeagues(userId: string): Observable<League[]> {
    return Observable.from(LEAGUES);
  }

  public createLeague(name: string,
                      creatorId: string,
                      opponentId: string): Promise<League> {
    return Promise.resolve(LEAGUES[0]);
  }

  public addSong(userId: string,
                 leagueId: string,
                 songId: string,
                 songName: string,
                 songArtist: string): Promise<League> {
    return loadLeague(leagueId);
  }

  public deleteLeague(leagueId: string): Promise<boolean> {
    return Promise.resolve(true);
  }

};
