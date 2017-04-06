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
    this.fbPopularTracks = this.db.list('/Popular/tracks');
  }

  public loadPopularTracks(): Observable<SpotifyTrack[]> {
  	return this.fbPopularTracks.map(items => {
        let tracks: SpotifyTrack[] = [];
        let counter = 0;
        for (let item of items) {
          console.log('Counter: ' + counter);
          if(counter < 25){
            this.spotify.loadTrack(item.$value)
              .then(track => {
                tracks.push(track);
                })
              .catch(error => {
                console.log(error);
              });
            counter = counter + 1;
        }}
        return tracks;
      });
  }

}