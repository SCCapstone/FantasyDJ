import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Http, Request, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';


import { Spotify } from 'ng2-cordova-oauth/provider/spotify';
import { Oauth } from 'ng2-cordova-oauth/oauth';
import { OauthBrowser } from 'ng2-cordova-oauth/platform/browser';
import { OauthCordova } from 'ng2-cordova-oauth/platform/cordova';

import {
  GrantType,
  GrantTypes,
  AuthSuccess,
  AuthError,
  TokenRequestBody,
  TokenResponse } from '../models/spotify-auth-models';

import {
  SpotifyUser,
  SpotifyArtist,
  SpotifyAlbum,
  SpotifyTrack,
  SpotifySearchResult,
  SpotifySearchType,
  DEFAULT_SEARCH_TYPES } from '../models/spotify-models';

declare const Buffer;

/**
 * Spotify API client credentials for FantasyDJ
 */
const CLIENT_ID = 'be9a8fc1e71c45edb1cbf4d69759d6d3';
const CLIENT_SECRET = '9b25b58435784d3cb34c048879e77aeb';

/**
 * keys for accessing tokens in localstorage
 */
const KEY_ACCESSTOKEN = 'access_token';
const KEY_ACCESSTOKEN_EXPDT = 'access_token_expires';
const KEY_REFRESHTOKEN = 'refresh_token';

@Injectable()
export class SpotifyProvider {

  private oauth: Oauth;
  private spotifyOauthProvider: Spotify;
  private _apiUrl: string;
  private encodedCredentials: string;

  constructor(private http: Http,
              private platform: Platform) {
    this._apiUrl = this.platform.is('core') ?
      '/spotify' :
      'https://api.spotify.com/v1';
    this.oauth = this.platform.is('core') ? new OauthBrowser() : new OauthCordova();
    this.spotifyOauthProvider = new Spotify({
      clientId: CLIENT_ID,
      redirectUri: this.platform.is('android') ?
        'http://localhost/callback' : 'http://localhost:8100/',
      appScope: [
        'user-read-private',
        'user-read-email'
      ],
      responseType: 'code'
    });
    this.encodedCredentials = new Buffer(
      CLIENT_ID + ':' + CLIENT_SECRET
    ).toString('base64');
  }

  public loggedIn(logInIfNot: boolean): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.loadCurrentUser().then(_ => {
        resolve();
      }).catch(error => {
        if (logInIfNot) {
          this.login()
            .then(() => resolve())
            .catch(error => reject(error));
        }
        else {
          reject(error);
        }
      });
    });
  }

  public login(): Promise<void> {
    return new Promise((resolve, reject) =>  {
      this.platform.ready().then(() => {
        return this.oauth.logInVia(this.spotifyOauthProvider, {
          clearsessioncache: 'no'
        });
      }).then(success => {
        return this.requestTokens(GrantTypes.authorization_code, (<AuthSuccess>success).code);
      }).then(response => {
        localStorage.setItem(KEY_ACCESSTOKEN, response.access_token);
        this.setAccessTokenExpiresAt(response.expires_in);
        localStorage.setItem(KEY_REFRESHTOKEN, response.refresh_token);
        resolve();
      }).catch(error => reject(error));
    });
  }

  private refreshAccessToken(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.requestTokens(GrantTypes.refresh_token).then(response => {
        localStorage.setItem(KEY_ACCESSTOKEN, response.access_token);
        this.setAccessTokenExpiresAt(response.expires_in);
        resolve();
      }).catch(error => reject(error));
    });
  }

  private requestTokens(grantType: GrantType, code?: string): Promise<TokenResponse> {
    return new Promise<TokenResponse>((resolve, reject) => {
      this.http.request(this.getAuthRequest(grantType, code))
        .map(success => <TokenResponse>(success.json()))
        .subscribe(
          response => resolve(response),
          error => reject(error),
          () => console.log('requestTokens completed')
        );
    });
  }

  private getAuthRequest(grantType: GrantType, code?: string) {
    let body: TokenRequestBody = {
      grant_type: grantType,
      code: code || null,
      redirect_uri: (grantType === GrantTypes.authorization_code ?
                     this.spotifyOauthProvider.options.redirectUri : null),
      refresh_token: (grantType === GrantTypes.refresh_token ?
                      this.refreshToken : null)
    };
    let bodyStr = Object.keys(body).map(k => {
      return encodeURIComponent(k) + '=' + encodeURIComponent(body[k]);
    }).join('&');

    let reqOpts = {
      url: 'https://accounts.spotify.com/api/token',
      method: 'post',
      body: bodyStr,
      headers: new Headers({
        'Authorization': 'Basic ' + this.encodedCredentials,
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    console.log('request options: ' + JSON.stringify(reqOpts));

    return new Request(reqOpts);
  }

  private setAccessTokenExpiresAt(seconds: number) {
    localStorage.setItem(
      KEY_ACCESSTOKEN_EXPDT,
      new Date(new Date().getTime() + seconds*1000).toISOString()
    );
  }

  get accessToken(): string {
    return localStorage.getItem(KEY_ACCESSTOKEN);
  }

  get refreshToken(): string {
    return localStorage.getItem(KEY_REFRESHTOKEN);
  }

  get accessTokenExpires(): Date {
    let dateStr = localStorage.getItem(KEY_ACCESSTOKEN_EXPDT);
    if (dateStr) {
      return new Date(dateStr);
    }
    else {
      return null;
    }
  }

  get headers(): Headers {
    return new Headers({
      'Authorization': 'Bearer ' + this.accessToken
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
