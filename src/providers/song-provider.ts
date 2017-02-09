import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';

import { Song } from '../models/fantasydj-models';


@Injectable()
export class SongData {

  private fbSongs: FirebaseListObservable<any[]>;
  private cachedSongs: any = {};

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

  loadSongBySpotifyId(spotifyTrackId: string): Promise<Song> {
    return new Promise<Song>((resolve, reject) => {
      console.log("loadSongBySpotifyId called");

      if (this.cachedSongs[spotifyTrackId]) {
        this.loadSong(this.cachedSongs[spotifyTrackId]).then(song => {
          console.log('song ' + song.id + ' loaded via cached id');
          resolve(song);
        });
      }
      else {
        let songs = this.db.list('Songs', {
          query: {
            orderByChild: 'spotifyId',
            equalTo: spotifyTrackId,
            limitToFirst: 1
          }
        }).map(items => {
          if (items != null && items.length > 0) {
            return this.mapFBSong(items[0]);
          }
          else {
            return null;
          }
        }).subscribe(song => {
          console.log(song);
          if (song) {
            console.log('song ' + song.id + ' loaded via spotifyId query');
            this.cachedSongs[spotifyTrackId] = song.id;
            resolve(song);
          }
          else {
            reject('song not found by spotifyTrackId ' + spotifyTrackId);
          }
        });
      }
    });
  }

  createSong(spotifyTrackId: string,
             songName: string,
             songArtist: string): Promise<Song> {
    return new Promise<Song>((resolve, reject) => {
      this.loadSongBySpotifyId(spotifyTrackId).then(song => {
        resolve(song);
      }).catch(err => {
        let songId = this.db.list('/Songs').push({
          spotifyId: spotifyTrackId,
          name: songName,
          artist: songArtist
        }).key;
        if (songId) {
          resolve(this.loadSong(songId));
        }
        else {
          reject('song creation error');
        }
      });
    });
  }

  private mapFBSong(fbsong: any): Song {
    if ('$value' in fbsong && ! fbsong.$value) {
      console.log(fbsong, 'returning null');
      return null;
    }

    let song = <Song>{
      id: fbsong.$key,
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




}
