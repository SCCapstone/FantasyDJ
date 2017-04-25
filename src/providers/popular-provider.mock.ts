/**
 * Mock popular track provider for testing. Implements all
 * public methods from popular-provider.ts.
 */
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { SpotifyTrack } from '../models/spotify-models';

export class PopularDataMock {

  public loadPopularTracks(): Observable<SpotifyTrack[]> {
    let tracks: SpotifyTrack[] = [];
    return Observable.of(tracks);
  }

};
