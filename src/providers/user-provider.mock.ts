import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { SpotifyUser } from '../models/spotify-models';
import { User } from '../models/fantasydj-models';

export class UserDataMock {

  public static USERS: Array<User> = [
    <User>{
      id: '-Kbmc8uoSAlb8Tre-j1P',
      leagues: <Array<string>>[],
      dateCreated: new Date('2017-01-01')
    },
    <User>{
      id: '-KbmcRsJwNlhlMY4rb3Z',
      leagues: <Array<string>>[],
      dateCreated: new Date('2017-01-01')
    },
    <User>{
      id: '-KbmcVG486aR1Wp4m1gN',
      leagues: <Array<string>>[],
      dateCreated: new Date('2017-01-01')
    }
  ];

  private getMock(key: number): Promise<User> {
    return Promise.resolve(UserDataMock.USERS[0]);
  }

  loadCurrentUser(): Promise<User> {
    return this.getMock(0);
  }

  createUser(spotifyUser: SpotifyUser): Promise<User> {
    return this.getMock(0);
  }

  loadUser(): Promise<User> {
    return this.getMock(0);
  }

  loadUsers(leagueId: string): Observable<User[]> {
    return Observable.of(UserDataMock.USERS);
  }

};
