import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2';
import { Observable } from 'rxjs/Observable';

import { SpotifyUser } from '../models/spotify-models';
import { User } from '../models/fantasydj-models';

@Injectable()
export class UserData {

  constructor(private db: AngularFireDatabase) {}

  createUser(spotifyUser: SpotifyUser): Promise<User> {
    return new Promise<User>((resolve, reject) => {

      if (!spotifyUser || spotifyUser.id === undefined) {
        reject('no spotify user. unable to create user.');
        return;
      }

      this.db.object('/UserProfiles/' + spotifyUser.id).update({
        dateCreated: new Date()
      }).then(_ => {
        this.loadUser(spotifyUser.id).then(user => resolve(user));
      }).catch(err => reject(err));
    });
  }

  loadUser(userId: string): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.db.object('/UserProfiles/' + userId).map(fbuser => {

        if ('$value' in fbuser && ! fbuser.$value) {
          reject('user ' + userId + ' does not exist');
          return;
        }

        let user = <User>{
          id: fbuser.$key,
          leagues: [],
          dateCreated: fbuser.dateCreated
        };
        for (var key in fbuser.leagues) {
          user.leagues.push(key);
        }

        return user;
      }).subscribe(usr => resolve(usr));
    });
  }

  loadUsers(leagueId: string): Observable<User[]> {
    return this.db.list('/Leagues/' + leagueId + '/users')
      .map(items => {
        let users: User[] = [];
        for (let item of items) {
          this.loadUser(item.$key)
            .then(user => users.push(user))
            .catch(error => console.log(error));
        }
        return users;
      });
  }

};
