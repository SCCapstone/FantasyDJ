/**
 * Provider for popular songs from Spotify
 */
import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';

import { SpotifyTrack } from '../models/spotify-models';
import { SpotifyProvider } from './spotify-provider';

@Injectable()
export class PopularData {

  private fbPopularTracks: FirebaseListObservable<any[]>;
  private cachedSongs: any = {};

  constructor(private db: AngularFireDatabase,
              private spotify: SpotifyProvider) {
    this.fbPopularTracks = this.db.list('/Popular/tracks', {
      query: {
        orderByKey: true,
        limitToFirst: 25
      }
    });
  }

  /**
   * load the top tracks from Spotify that are stored in the db
   */
  public loadPopularTracks(): Observable<SpotifyTrack[]> {
  	return this.fbPopularTracks.map(items => {
        let tracks: SpotifyTrack[] = [];
        items.forEach(item => {
          this.spotify.loadTrack(item.$value)
            .then(track => {
              tracks.push(track);
              })
            .catch(error => {
              console.log(error);
            });
        });
        return tracks;
      });
  }

}
