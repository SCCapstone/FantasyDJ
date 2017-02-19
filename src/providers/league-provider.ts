import { Injectable } from '@angular/core';
import { AngularFireDatabase,
         FirebaseListObservable,
         FirebaseObjectObservable} from 'angularfire2';

import { Observable } from 'rxjs/Observable';

import { IonicCloud } from './ionic-cloud-provider';
import { SongData } from './song-provider';
import { UserData } from './user-provider';
import { League, User, Song } from '../models/fantasydj-models';
import { SpotifyTrack } from '../models/spotify-models';
import 'rxjs/add/operator/take';

@Injectable()
export class LeagueData {

  private fbLeagues: FirebaseListObservable<any[]>;

  constructor(private db: AngularFireDatabase,
              private songData: SongData,
              private userData: UserData,
              private ionicCloud: IonicCloud) {
    this.fbLeagues = this.db.list('/Leagues');
  }

  loadLeague(leagueId: string): Promise<League> {
    return new Promise<League>((resolve, reject) => {
      this.db.object('/Leagues/' + leagueId)
        .map(this.mapFBLeague)
        .subscribe(league => {
          if (! league) {
            reject('league does not exist');
          }
          resolve(league);
        });
    });
  }


  loadLeagues(userId: string): Observable<League[]> {
    return this.db.list(this.fbUserLeaguesUrl(userId))
      .map(items => {
        let leagues: League[] = [];
        for (let item of items) {
          this.loadLeague(item.$key)
            .then(league => leagues.push(league))
            .catch(error => {
              console.log(error);
            });
        }
        return leagues;
      });
  }

  createLeague(name: string,
               creatorId: string,
               opponentId: string): Promise<League> {
    return new Promise<League>((resolve, reject) => {
      let usersRef = {};
      usersRef[creatorId] = true;
      usersRef[opponentId] = false;
      // usersRef["members"] = [creatorId];

      let leagueId: string = this.fbLeagues.push({
        name: name,
        creator: creatorId,
        users: usersRef
      }).key;

      if (leagueId) {
        console.log(leagueId);
        this.loadLeague(leagueId).then(league => {
            this.db.object(this.fbUserLeaguesUrl(creatorId, leagueId))
              .set(true)
              .then(_ => {
                this.db.object(this.fbUserLeaguesUrl(opponentId, leagueId))
                  .set(false)
                  .then(_ => {
                    this.ionicCloud.sendPush(
                      opponentId,
                      creatorId +
                        ' has invited you to league ' +
                        league.name
                    )
                    .then(_ => resolve(league))
                    .catch(err => reject(err));
                  })
                  .catch(error => reject(error));
              })
              .catch(error => reject(error));
          }).catch(error => reject(error));
      }
      else {
        reject('no leagueId generated');
      }
    });
  }

  private fbUserLeaguesUrl(userId: string, leagueId?: string): string {
    let url = '/UserProfiles/' + userId + '/leagues';
    if (leagueId) {
      url += '/' + leagueId;
    }
    return url;
  }

  private dbObj(...pathElems: string[]): FirebaseObjectObservable<any> {
    return this.db.object('/' + pathElems.join('/'));
  }

  private mapFBLeague(fbleague): League {
    console.log('start mapFBLeague');
    if ('$value' in fbleague && ! fbleague.$value) {
      console.log(fbleague, 'returning null');
      return null;
    }

    let league = <League>{
      id: fbleague.$key,
      name: fbleague.name,
      users: [],
      draftDate: fbleague.draftDate,
      startTime: fbleague.startTime,
      endTime: fbleague.endTime,
      winner: fbleague.winner || null
    };
    for (var key in fbleague.users) {
      league.users.push(key);
    }

    return league;
  }

  private leagueHasSong(leagueId: string, songId:string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.dbObj('Songs', songId, 'leagues', leagueId)
        .take(1)
        .subscribe(snapshot => {
          if (snapshot.$value == true) {
            resolve(true);
          }
          else {
            resolve(false);
          }
        });
    });
  }

  private leagueIsFull(leagueId: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      let size: number = 0;

      this.dbObj('Leagues', leagueId, 'users')
        .take(1)
        .forEach(usersRef => {
          for (let userId in usersRef) {
            if (! userId.startsWith('$')) {
              for (let songId in usersRef[userId]) {
                size++;
              }
            }
          }
        })
        .then(() => {
          resolve(size >= 6);
        })
        .catch(error => reject(error));
    });
  }

  public updatePlaylist(userId: string,
                        leagueId: string,
                        spotifyTrack: SpotifyTrack): Promise<Song> {
    return new Promise<Song>((resolve, reject) => {
      let song: Song = null;
      let league: League = null;
      let message: string = null;
      let recipients: Array<string> = [];

      this.songData.createSong(spotifyTrack.id,
                               spotifyTrack.name,
                               spotifyTrack.artists[0].name)
        .then(songResult => {
          song = songResult;
          return this.leagueHasSong(leagueId, songResult.id);
        })
        .then(leagueHasSong => {
          if (leagueHasSong) {
            throw new Error('song already in league');
          }
          return this.loadLeague(leagueId);
        })
        .then(leagueResult => {
          league = leagueResult;
        })
        .then(() => {
          return this.dbObj(
            'Leagues', leagueId, 'users', userId, song.id
          ).set(true);
        })
        .then(() => {
          return this.dbObj(
            'Songs', song.id, 'leagues', leagueId
          ).set(true);
        })
        .then(() => {
          return this.getOpponent(userId, leagueId);
        })
        .then(opponent => {
          recipients.push(opponent.id);
          return this.leagueIsFull(leagueId);
        })
        .then(full => {
          if (! full) {
            message = `It is your turn to choose a song for league ${league.name}`;
          }
          else {
            recipients.push(userId);
            message = `All songs in league ${league.name} have been chosen.`;
          }
          return this.setLeagueDatesIfFull(leagueId, full);
        })
        .then(_ => {
          for (let recipient of recipients) {
            console.log(`sending message to ${recipient}: ${message}`);
            this.ionicCloud.sendPush(recipient, message)
              .then(res => {
                console.log('sendPush for league turn success');
              })
              .catch(err => {
                console.log('sendPush for league turn failure', err);
              });
          }
        })
        .then(() => resolve(song))
        .catch(error => reject(error));
    });
  }

  private setLeagueDatesIfFull(leagueId: string, full: boolean): Promise<League> {
    if (full) {
      return new Promise<League>((resolve, reject) => {
          let startTime: Date = new Date();
          let endTime: Date = new Date(
            startTime.getTime() + (1 * 24 * 60 * 60 * 1000)
          );
          let dates = {
            startTime: startTime,
            endTime: endTime
          };

          this.dbObj('Leagues', leagueId).update(dates)
            .then(() => {
              return this.loadLeague(leagueId);
            })
            .then(league => {
              resolve(league);
            })
            .catch(error => reject(error));
      });
    }
    else {
      return this.loadLeague(leagueId);
    }
  }

  deleteLeague(leagueId: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      console.log('removing league ' + leagueId);
      this.loadLeague(leagueId).then(league => {
        for (let userId of league.users) {
          this.db.object('/Leagues/' + leagueId + '/users/' + userId)
            .forEach(userRef => {
              console.log(userRef);
              for (let songId in userRef) {
                if (! songId.startsWith('$')) {
                  console.log('songId: ' + songId);
                  this.db.object('/Songs/' + songId + '/leagues/' + leagueId)
                    .remove()
                    .then(() => {
                      console.log('league '
                                  + leagueId
                                  + ' removed from song '
                                  + songId);
                    })
                    .catch(err => {
                      console.log('error removing league '
                                  + leagueId
                                  + ' from song '
                                  + songId);
                    });
                }
              }
            });

          this.db.object('/UserProfiles/' + userId + '/leagues/' + leagueId)
            .remove()
            .then(() => {
              console.log('league '
                          + leagueId
                          + ' removed from user '
                          + userId);
            })
            .catch(err => {
              console.log('error removing league '
                          + leagueId
                          + ' from user '
                          + userId);
            });
        }
      }).then(() => {
        this.db.object('/Leagues/' + leagueId)
          .remove()
          .then(() => resolve(true))
          .catch(err => reject(err));
      }).catch(err => reject(err));
    });
  }

getOpponent(userId: string, leagueId: string): Promise<User> {
  return new Promise<User>((resolve, reject) => {
  this.db.list('/Leagues/'+leagueId+'/users/').subscribe(user=>{
      if (user.length > 0){
        for(var i = 0; i < user.length; i++){
          if (user[i].$key != userId){
            console.log('user[i].$key: ' + user[i].$key);
            this.userData.loadUser(user[i].$key).then(user =>
              resolve(user))
              .catch(err => reject(err));
          }
        }
      }
    });
    });
}

getCreator(leagueId: string): Promise<User> {
  return new Promise<User>((resolve, reject) => {
  this.db.object('/Leagues/' + leagueId + '/creator',
    {preserveSnapshot: true}).subscribe(snapshot => {
      console.log(snapshot.val());
      this.userData.loadUser(snapshot.val()).then(user =>
        resolve(user))
        .catch(err => reject(err));
    });
  });
}

}
