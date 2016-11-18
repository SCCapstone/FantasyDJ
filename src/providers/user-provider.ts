import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';

import { SpotifyUser } from '../models/spotify-models';
import { User } from '../models/fantasydj-models';

@Injectable()
export class UserData {

  constructor(private af: AngularFire) {}

  createUser(spotifyUser: SpotifyUser): Promise<User> {
    return new Promise<User>((resolve, reject) => {

      if (!spotifyUser || spotifyUser.id === undefined) {
        reject('no spotify user. unable to create user.');
        return;
      }

      this.af.database.object('/UserProfiles/' + spotifyUser.id).update({
        dateCreated: new Date()
      }).then(_ => {
        this.loadUser(spotifyUser.id).then(user => resolve(user));
      }).catch(err => reject(err));
    });
  }

  loadUser(userId: string): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.af.database.object('/UserProfiles/' + userId).map(fbuser => {

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

};
