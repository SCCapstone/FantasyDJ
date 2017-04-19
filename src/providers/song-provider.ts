import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';

import { Song } from '../models/fantasydj-models';
import { SpotifyTrack } from '../models/spotify-models';
import { SpotifyProvider } from './spotify-provider';
import { SongStatData } from './songstat-provider';


@Injectable()
export class SongData {

  private fbSongs: FirebaseListObservable<any[]>;
  private cachedSongs: any = {};

  constructor(private db: AngularFireDatabase,
              private spotify: SpotifyProvider,
              private statData: SongStatData) {
    this.fbSongs = this.db.list('/Songs');
  }

  /** load a song from db based on key and
      map the untyped json object from firebase
      to a song object */
  public loadSong(songId: string): Promise<Song> {
    return new Promise<Song>((resolve, reject) => {
      this.db.object('/Songs/' + songId)
        .map(this.mapFBSong)
        .map(song => {
          if (song) {
            this.spotify.loadTrack(song.spotifyId)
              .then(track => {
                song.artwork = track.album.images[0].url;
                song.preview = track.preview_url;
              })
              .catch(error => console.log(error));
          }
          return song;
        })
        .subscribe(song => {
          if (! song) {
            reject('song does not exist');
          }
          resolve(song);
        });
    });
  }

  /** load an observable song array of all of a user's songs in a league */
  public loadSongs(leagueId: string,
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

  /** load a song from spotify id
     uses angularfire query to search songs for one that has 
     correct spotify id */
  public loadSongBySpotifyId(spotifyTrackId: string): Promise<Song> {
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

  /** create a new song in the db from a spotify track */
  public createSong(track: SpotifyTrack): Promise<Song> {
    return new Promise<Song>((resolve, reject) => {
      this.loadSongBySpotifyId(track.id).then(song => {
        resolve(song);
      }).catch(err => {
        let songId = this.db.list('/Songs').push({
          spotifyId: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          preview: track.preview_url
        }).key;
        if (songId) {
          this.loadSong(songId)
            .then(song => {
              let date = new Date();
              date.setUTCHours(0, 0, 0, 0);
              this.statData.addSongStat(songId, date, track.popularity)
                .then(songStat => {
                  console.log(`added songstat for song ${songId} on ${date}`);
                })
                .catch(error => console.log(error));
              resolve(song);
            })
            .catch(error => {
              reject(error);
            });
        }
        else {
          reject('song creation error');
        }
      });
    });
  }

  /** create a song object from a untyped json object from firebase */
  private mapFBSong(fbsong: any): Song {
    if ('$value' in fbsong && ! fbsong.$value) {
      console.log(fbsong, 'returning null');
      return null;
    }

    let song = <Song>{
      id: fbsong.$key,
      artist: fbsong.artist,
      album: fbsong.album,
      name: fbsong.name,
      spotifyId: fbsong.spotifyId,
      leagues: [],
      preview: fbsong.preview_url
    };
    for (var key in fbsong.leagues) {
      song.leagues.push(key);
    }
    return song;
  }

  /** return the name of a song from its key */
  getSongName(songId: string): Promise<string>{
    return new Promise<string>((resolve, reject) => {
      this.loadSong(songId).then(song => {
        resolve(song.name);
      });
    });
  }
}
