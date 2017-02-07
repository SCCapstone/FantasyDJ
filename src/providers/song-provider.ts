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

loadSongFromSpotifyId(songId): Promise<Song> {
    return new Promise<Song>((resolve, reject) => {
    console.log('loading song from spotify Id');
    this.db.list('/Songs/', {
        query: {
          orderByChild: 'spotifyId',
          equalTo: songId,
          limitToFirst: 1
        }
      }).map(items => {
        for (let item of items) {
          console.log(item);
          this.loadSong(item.$key)
            .then(song => {
              resolve(song);
              console.log(song);})
            .catch(error => reject(error));
        }
      });
  });
}

  addSong(spotifyId: string, 
          userId: string, 
          leagueId: string, 
          songName: string,
          songArtist: string ): Promise<boolean>{
    return new Promise<boolean>((resolve, reject) => {
      console.log('adding song: ' + songName);
      console.log(this.loadSongFromSpotifyId(spotifyId));
      this.loadSongFromSpotifyId(spotifyId).then(song => {
        console.log(song);
        console.log(song.leagues);
        resolve(true);
      }).catch(err => reject(err));
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

  getKey(spotifyId: string): string{
    this.getSong(spotifyId).subscribe(song =>{
      console.log('SONG' + song);
    });
    return 'true';
  }

  getSong(spotifyId: string): FirebaseListObservable<any[]> {
    return this.db.list('Songs/', {
      query: {
        orderByChild: 'spotifyId',
        equalTo: spotifyId
      }});
  }



}
