import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Http, Request, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
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

  private api(loc: string): Observable<Response> {
    let req = new Request({
      url: this._apiUrl + loc,
      method: 'get',
      headers: this.headers
    });
    console.log(JSON.stringify(req));
    return this.http.request(req);
  }

  loadCurrentUser(): Promise<SpotifyUser> {
    return new Promise<SpotifyUser>((resolve, reject) => {
      this.api('/me')
        .map(response => <SpotifyUser>(response.json()))
        .subscribe(user => resolve(user),
                   error => reject(error),
                   () => console.log('spotify loadCurrentUser complete'));
    });
  }

  loadArtist(artistId: string): Promise<SpotifyArtist> {
    return new Promise<SpotifyArtist>((resolve, reject) => {
      this.api('/artists/' + artistId)
        .map(response => <SpotifyArtist>(response.json()))
        .subscribe(artist => resolve(artist),
                   error => reject(error),
                   () => console.log('spotify load artist complete'));
    });
  }

  loadAlbum(albumId: string): Promise<SpotifyAlbum> {
    return new Promise<SpotifyAlbum>((resolve, reject) => {
      this.api('/albums/' + albumId)
        .map(response => <SpotifyAlbum>(response.json()))
        .subscribe(album => resolve(album),
                   error => reject(error),
                   () => console.log('spotify load album complete'));
    });
  };

  loadTrack(trackId: string): Promise<SpotifyTrack> {
    return new Promise<SpotifyTrack>((resolve, reject) => {
      this.api('/tracks/' + trackId)
        .map(response => <SpotifyTrack>(response.json()))
        .subscribe(track => resolve(track),
                   error => reject(error),
                   () => console.log('spotify loadTrack complete'));
    });
  }

  search(query: string,
         types?: SpotifySearchType[],
         limit?: number,
         offset?: number): Promise<SpotifySearchResult> {
    let searchParams = { q: query }

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

    return new Promise<SpotifySearchResult>((resolve, reject) => {
      this.api('/search?' + params.join('&'))
        .map(response => <SpotifySearchResult>(response.json()))
        .subscribe(result => resolve(result),
                   error => reject(error),
                   () => console.log('spotify search complete'));
    });
  }

};
