/**
 * Mock SpotifyProvider for testing. Implements all public
 * methods from spotify-provider.ts.
 */
import { Headers } from '@angular/http';

import { SpotifyUser,
         SpotifyArtist,
         SpotifyAlbum,
         SpotifyTrack,
         SpotifySearchType,
         SpotifySearchResult } from '../models/spotify-models';

export class SpotifyProviderMock {

  public login(): Promise<void> {
    return Promise.resolve();
  }

  public logout(): void {
    return;
  }

  get accessToken(): string {
    return null;
  }

  get refreshToken(): string {
    return null;
  }

  get headers(): Headers {
    return null;
  }

  loadCurrentUser(): Promise<SpotifyUser> {
    return Promise.resolve(null);
  }

  loadArtist(artistId: string): Promise<SpotifyArtist> {
    return Promise.resolve(null);
  }

  loadAlbum(albumId: string): Promise<SpotifyAlbum> {
    return Promise.resolve(null);
  }

  loadTrack(trackId: string): Promise<SpotifyTrack> {
    return Promise.resolve(null);
  }

  search(query: string,
         types?: SpotifySearchType[],
         limit?: number,
         offset?: number): Promise<SpotifySearchResult> {
    return Promise.resolve(null);
  }

};
