/**
 * Mock Song provider for testing. Implements all public
 * methods from song-provider.ts.
 */
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { Song } from '../models/fantasydj-models';
import { SpotifyTrack } from '../models/spotify-models';

export class SongDataMock {

  public loadSong(songId: string): Promise<Song> {
    return Promise.resolve(null);
  }

  public loadSongs(leagueId: string, userId: string): Observable<Song[]> {
    let songs: Song[] = [];
    return Observable.of(songs);
  }

  public loadSongBySpotifyId(spotifyTrackId: string): Promise<Song> {
    return Promise.resolve(null);
  }

  public createSong(track: SpotifyTrack): Promise<Song> {
    return Promise.resolve(null);
  }

  getSongName(songId: string): Promise<string> {
    return Promise.resolve(null);
  }

};
