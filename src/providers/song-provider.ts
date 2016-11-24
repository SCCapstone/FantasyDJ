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

  private fbSongLeaguesUrl(songId: string,): string {
    let url = '/Songs/' + songId + '/leagues';
     return url;
  }

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

  private mapFBSong(fbsong): Song {
    console.log('start mapFBSong');
    if ('$value' in fbsong && ! fbsong.$value) {
      console.log(fbsong, 'returning null');
      return null;
    }

    let song = <song>{
      artist: fbsong.$key,
	  name: fbsong.name,
	  spotifyId: fbsong.spotifyId,
	  leagues: [];
    };
    for (var key in fbsong.leagues) {
      song.leagues.push(key);
    }
      return song;
  }