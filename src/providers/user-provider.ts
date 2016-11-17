import { Injectable } from '@angular/core';

import { SpotifyUser } from '../models/spotify-models';
import { User, League } from '../models/fantasydj-models';

export interface FBUser {
  leagues: any,
  dateCreated: Date
}

@Injectable()
export class UserData {

  private db: firebase.database.Database;

  constructor() {
    this.db = firebase.database();
  }

  create(spotifyUser: SpotifyUser): Promise<User> {
    return new Promise<User>(resolve => {
      let date = new Date();
      this.db.ref('/UserProfiles/' + spotifyUser.id).update({
        leagues: null,
        dateCreated: date
      }).then(_ => {
        resolve(<User>{
          id: spotifyUser.id,
          leagues: [],
          dateCreated: date
        });
      }).catch(error => console.log(error));
    });
  }

  loadUser(userId: string): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.db.ref('/UserProfiles/' + userId).on('value', snap => {
        if (snap.val()) {
          let user = <User>{
            id: userId,
            leagues: [],
            dateCreated: snap.val().dateCreated
          };
          snap.child('Leagues').forEach(leagueRef => {
            user.leagues.push(leagueRef.key);
            return false;
          });
          resolve(user);
        }
        reject('not found');
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  addLeague(userId: string, leagueId: string): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.db.ref('/UserProfiles/' + userId + '/Leagues' + leagueId)
        .set(true)
        .then(_ => resolve(true))
        .catch(error => console.log(error));
    });
  }

  removeLeague(userId: string, leagueId: string): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.db.ref('/UserProfiles/' + userId + '/Leagues' + leagueId)
        .remove()
        .then(_ => resolve(true))
        .catch(error => console.log(error));
    });
  }

};
