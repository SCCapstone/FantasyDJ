import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Http, Request, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { Spotify } from 'ng2-cordova-oauth/provider/spotify';
import { Oauth } from 'ng2-cordova-oauth/oauth';
import { OauthBrowser } from 'ng2-cordova-oauth/platform/browser';
import { OauthCordova } from 'ng2-cordova-oauth/platform/cordova';

import {
  SpotifyUser,
  SpotifyArtist,
  SpotifyAlbum,
  SpotifyTrack,
  SpotifySearchResult,
  SpotifySearchType,
  DEFAULT_SEARCH_TYPES } from '../models/spotify-models';

const KEY_ACCESSTOKEN = 'access_token';
const KEY_REFRESHTOKEN = 'refresh_token';

@Injectable()
export class SpotifyProvider {

  private oauth: Oauth;
  private spotifyOauthProvider: Spotify;
  private _apiUrl: string;

  constructor(private http: Http,
              private platform: Platform) {
    this._apiUrl = this.platform.is('core') ?
      '/spotify' :
      'https://api.spotify.com/v1';
    this.oauth = this.platform.is('core') ? new OauthBrowser() : new OauthCordova();
    this.spotifyOauthProvider = new Spotify({
      clientId: 'be9a8fc1e71c45edb1cbf4d69759d6d3',
      redirectUri: this.platform.is('android') ?
        'http://localhost/callback' : 'http://localhost:8100/',
      appScope: [
        'user-read-private',
        'user-read-email'
      ],
      responseType: 'code'
    });
  }

  public loggedIn(logInIfNot: boolean): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.loadCurrentUser().then(_ => {
        resolve();
      }).catch(error => {
        if (logInIfNot) {
          this.login().then(token => {
            resolve();
          }).catch(error => reject(error));
        }
        else {
          reject(error);
        }
      });
    });
  }

  public login(): Promise<string> {
    return new Promise((resolve, reject) =>  {
      this.platform.ready().then(() => {
        return this.oauth.logInVia(
          this.spotifyOauthProvider,
          {
            clearsessioncache: 'no'
          }
        );
      }).then(success => {
        let token = success[KEY_ACCESSTOKEN];
        localStorage.setItem(KEY_ACCESSTOKEN, token);
        resolve(token);
      }, error => {
        console.log('error: ' + error);
        reject(error);
      });
    });
  }

  get token(): string {
    return localStorage.getItem(KEY_ACCESSTOKEN);
  }

  get headers(): Headers {
    return new Headers({
      'Authorization': 'Bearer ' + this.token
    });
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
              this.login()
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
