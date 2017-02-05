import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';


import { Song } from '../models/fantasydj-models';


@Injectable()
export class SongData {

  private fbSongs: FirebaseListObservable<any[]>;

  constructor(private db: AngularFireDatabase) {
    this.fbSongs = this.db.list('/Songs');
  }

  /*private fbSongLeaguesUrl(songId: string,): string {
    let url = '/Songs/' + songId + '/leagues';
     return url;
  }*/

  loadSong(songId: string): Promise<Song> {
    return new Promise<Song>((resolve, reject) => {
      this.db.object('/Songs/' + songId)
        .map(this.mapFBSong)
        .subscribe(song => {
          if (! song) {
            reject('song does not exist');
          }
          resolve(song);
        });
    });
  }

  loadSongs(leagueId: string,
            userId: string): Observable<Song[]> {
    return this.db.list('/Leagues/' + leagueId + '/users/' + userId)
      .map(items => {
        let songs: Song[] = [];
        for (let item of items) {
          this.loadSong(item.$key)
            .then(song=> songs.push(song))
            .catch(error => console.log(error));
        }
        return songs;
      });
  }

  private mapFBSong(fbsong): Song {
    console.log('start mapFBSong');
    if ('$value' in fbsong && ! fbsong.$value) {
      console.log(fbsong, 'returning null');
      return null;
    }

    let song = <Song>{
      artist: fbsong.artist,
	    name: fbsong.name,
	    spotifyId: fbsong.spotifyId,
	    leagues: []
    };
    for (var key in fbsong.leagues) {
      song.leagues.push(key);
    }
      return song;
  }

  getKeyFromSpotifyId(spotifyId: string): any {
     this.db.list('Songs/', {
      query: {
        orderByChild: 'spotifyId',
        equalTo: spotifyId
      }}).subscribe(songs =>{
        console.log(songs);
        if(songs.length == 0){
          return null;
        }
        else{
          console.log('get key: ' + songs[0].$key);
          return songs[0].$key;
        }

    });
  }



}
