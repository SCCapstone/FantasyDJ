/**
* Provider for users
*/
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2';
import { Observable } from 'rxjs/Observable';

import { SpotifyProvider } from './spotify-provider';

import { SpotifyUser } from '../models/spotify-models';
import { User, Song } from '../models/fantasydj-models';
import { SongData } from '../providers/song-provider';


@Injectable()
export class UserData {

  constructor(private db: AngularFireDatabase,
              private spotify: SpotifyProvider,
              private songData: SongData) {}

  loadCurrentUser(): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.spotify.loadCurrentUser().then(spotifyUser => {
        // since we have a spotify user, try to load
        // fantasy-dj user
        let encoded_id = UserData.encodeUsername(spotifyUser.id);
        this.loadUser(encoded_id)
          .then(user => resolve(user))
          .catch(error => {
            // no fantasy-dj user, so let's create one
            this.createUser(spotifyUser)
              .then(user => resolve(user))
              .catch(error => reject(error));
          });
      }).catch(error => {
        reject(error);
      });
    });
  }

  /** 
  * Create a new user from their spotify account
  */
  createUser(spotifyUser: SpotifyUser): Promise<User> {
    return new Promise<User>((resolve, reject) => {

      if (!spotifyUser || spotifyUser.id === undefined) {
        reject('no spotify user. unable to create user.');
        return;
      }
      let encoded_id = UserData.encodeUsername(spotifyUser.id);
      console.log('/UserProfiles/'+ encoded_id);
      this.db.object('/UserProfiles/' + encoded_id).update({
        dateCreated: new Date(),
        userEmail: spotifyUser.email
      }).then(_ => {
        this.loadUser(encoded_id).then(user => resolve(user));
      }).catch(err => reject(err));
    });
  }

  /** 
  * Load a user from the database given their id
  * It is neccessary to encode/decode usernames to prevent
  * symbols such as "/" which aren't allowed in firebase
  */
  loadUser(userId: string): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.db.object('/UserProfiles/' + userId).map(fbuser => {

        if ('$value' in fbuser && ! fbuser.$value) {
          reject('user ' + userId + ' does not exist');
          return;
        }
        console.log(UserData.decodeUsername(fbuser.$key));
        let user = <User>{
          id: UserData.decodeUsername(fbuser.$key),
          email: fbuser.userEmail,
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

  /** 
  * Load both users in a league
  */
  loadUsers(leagueId: string): Observable<User[]> {
    return this.db.list('/Leagues/' + leagueId + '/users')
      .map(items => {
        let users: User[] = [];
        for (let item of items) {
          this.loadUser(item.$key)
            .then(user => {
              //user.songs = this.songData.loadSongs(leagueId, user.id);
              return user;
            })
            .then(user => users.push(user))
            .catch(error => console.log(error));
        }
        return users;
      });
  }

  /**
  * Encode and decode functions are neccessary to prevent 
  * the symbols that aren't allowed as firebase keys
  */
  public static encodeUsername(userId: string): string{
    let dict = {'.': '2E%', '/': '3E%', '$':'4E%', '[':'5E%', ']': '6E%', '#':'7E%'};
    let result: string = '';
    for(var x = 0, c=''; c = userId.charAt(x); x++){
      if(c in dict){
        result = result + dict[c];
      }
      else result = result + c;
    }
    return result;
  }

  public static decodeUsername(userId: string): string{
    userId= userId.replace(/2E%/g, '.');
    userId= userId.replace(/3E%/g, '/');
    userId= userId.replace(/4E%/g, '$');
    userId= userId.replace(/5E%/g, '[');
    userId= userId.replace(/6E%/g, ']');
    userId= userId.replace(/7E%/g, '#');
    return userId;
  }

};
