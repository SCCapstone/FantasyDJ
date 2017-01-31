import { Observable } from 'rxjs/Observable';
import { SpotifyUser } from '../models/spotify-models';
import { User } from '../models/fantasydj-models';

export class UserDataMock {

  public static USERS: Array<User> = {
    <User>{
      id: '-Kbmc8uoSAlb8Tre-j1P',
      leagues: [],
      dateCreated: '2017-01-01',
    },
    <User>{
      id: '-KbmcRsJwNlhlMY4rb3Z',
      leagues: [],
      dateCreated: '2017-01-01',
    },
    <User>{
      id: '-KbmcVG486aR1Wp4m1gN',
      leagues: [],
      dateCreated: '2017-01-01',
    },
  };

  loadCurrentUser(): Promise<User> {
    return Promise.resolve(USERS[0]);
  }

  createUser(spotifyUser: SpotifyUser): Promise<User> {
    return Promise.resolve(USERS[0]);
  }

  loadUser(): Promise<User> {
    return Promise.resolve(USERS[0]);
  }

  loadUsers(leagueId: string) Observable<User[]> {
    return Observable.from(USERS);
  }

};
