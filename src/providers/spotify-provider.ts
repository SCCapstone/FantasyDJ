import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Http, Request, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { SpotifyUser, SpotifyTrack, SpotifySearchResult } from '../models/spotify-models';
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
    return new Promise<SpotifyUser>(resolve => {
      this.api('/me')
        .map(response => <SpotifyUser>(response.json()))
        .subscribe(user => resolve(user),
                   error => resolve(error),
                   () => console.log('spotify loadCurrentUser complete'));
    });
  }

  loadTrack(trackId: string): Promise<SpotifyTrack> {
    return new Promise<SpotifyTrack>(resolve => {
      this.api('/tracks/' + trackId)
        .map(response => <SpotifyTrack>(response.json()))
        .subscribe(track => resolve(track),
                   error => resolve(error),
                   () => console.log('spotify loadTrack complete'));
    });
  }

  search(query: string): Promise<SpotifySearchResult> {
    return new Promise<SpotifySearchResult>(resolve => {
      this.api('/search?q=' + query + '&type=artist,album,track')
        .map(response => <SpotifySearchResult>(response.json()))
        .subscribe(result => resolve(result),
                   error => resolve(error),
                   () => console.log('spotify search complete'));
    });
  }

};
