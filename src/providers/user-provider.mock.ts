/**
 * Mock User Provider for testing. Implements all public
 * methods user-provider.ts.
 */
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { User } from '../models/fantasydj-models';
import { SpotifyUser } from '../models/spotify-models';

export class UserDataMock {

  loadCurrentUser(): Promise<User> {
    return Promise.resolve(null);
  }

  createUser(spotifyUser: SpotifyUser): Promise<User> {
    return Promise.resolve(null);
  }

  loadUser(userId: string): Promise<User> {
    return Promise.resolve(null);
  }

  loadUsers(leagueId: string): Observable<User[]> {
    let users: User[] = [];
    return Observable.of(users);
  }

};
