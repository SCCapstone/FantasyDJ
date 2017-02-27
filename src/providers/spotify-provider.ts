import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Http, Request, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import {
  SpotifyUser,
  SpotifyArtist,
  SpotifyAlbum,
  SpotifyTrack,
  SpotifySearchResult,
  SpotifySearchType,
  DEFAULT_SEARCH_TYPES } from '../models/spotify-models';

import { OAuthService } from './oauth-service';

@Injectable()
export class SpotifyProvider {

  private _apiUrl: string;
  private _headers: Headers;

  constructor(private http: Http,
              private platform: Platform,
              private authService: OAuthService) {
    this._apiUrl = this.platform.is('core') ?
      '/spotify' :
      'https://api.spotify.com/v1';
  }

  get headers(): Headers {
    if (! this._headers) {
      this._headers = new Headers({
        'Authorization': 'Bearer ' + this.authService.token
      });
      console.log(JSON.stringify(this._headers));
    }
    return this._headers;
  }

  private api<T>(loc: string): Promise<T> {
    let req = new Request({
      url: this._apiUrl + loc,
      method: 'get',
      headers: this.headers
    });
    console.log(JSON.stringify(req));

    return new Promise<T>((resolve, reject) => {
      this.http.request(req)
        .map(response => <T>(response.json()))
        .subscribe(
          obj => resolve(obj),
          error => {
            if (error.status && error.status === 401) {
              this.authService.loginToSpotify()
                .then(_ => {
                  window.location.reload();
                })
                .catch(err => reject(err));
            }

            reject(error)
          },
          () => console.log('spotify api call complete'));
    });
  }

  loadCurrentUser(): Promise<SpotifyUser> {
    return this.api('/me');
  }

  loadArtist(artistId: string): Promise<SpotifyArtist> {
    return this.api('/artists/' + artistId);
  }

  loadAlbum(albumId: string): Promise<SpotifyAlbum> {
    return this.api('/albums/' + albumId);
  }

  loadTrack(trackId: string): Promise<SpotifyTrack> {
    return this.api('/tracks/' + trackId);
  }

  search(query: string,
         types?: SpotifySearchType[],
         limit?: number,
         offset?: number): Promise<SpotifySearchResult> {
    let searchParams = { q: encodeURIComponent(query) }

    searchParams['type'] = types ? types.join(',') : DEFAULT_SEARCH_TYPES;

    if (limit) {
      searchParams['limit'] = limit;
    }

    if (offset) {
      searchParams['offset'] = offset;
    }

    let params = [];
    for (let key in searchParams) {
      params.push(key + '=' + searchParams[key]);
    }

    return this.api('/search?' + params.join('&'));
  }

};
