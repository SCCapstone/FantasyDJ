import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

declare var window: any;

const spotifyTokenKey = 'spotify-token';

/**
 * A weird and highly confusing bastardization of these two examples, just to make sure
 * that OAuth works for not only Cordova (mobile) but also browser (ionic serve):
 *
 * https://www.thepolyglotdeveloper.com/2016/01/using-an-oauth-2-0-service-within-an-ionic-2-mobile-app/
 * https://forum.ionicframework.com/t/how-to-implement-google-oauth-in-an-ionic-2-app/47038
 */
@Injectable()
export class OAuthService {

  private _token: any;
  private _url: string;
  private callback: string;
  private browserTarget: string;

  constructor (private platform: Platform) {
    this.callback = this.platform.is('android') ? 'http://localhost/callback' : 'http://localhost:8100/';
    this.browserTarget = this.platform.is('core') ? '_self' : '_blank';

    if (window.location.hash.match(/^#access_token/) && ! this.token) {
      this.parseToken(window.location.href);
    }

    if (this.token) {
      console.log('found token: ' + this.token);
    }
    else {
      console.log('token not found');
    }
  }

  get url(): string {
    if (!this._url) {
      var authBase = 'https://accounts.spotify.com/authorize';
      var authParams = {
        client_id: 'be9a8fc1e71c45edb1cbf4d69759d6d3',
        response_type: 'token',
        redirect_uri: this.callback,
        scope: [
          'user-read-private',
          'user-read-email',
          'playlist-read-private',
          'playlist-modify-private',
          'playlist-modify-public',
          'playlist-read-collaborative'
        ].join(' ')
      };
      var params = [];
      for (var k in authParams) {
        params.push(k + '=' + authParams[k]);
      }
      this._url = authBase + '?' + params.join('&');
    }
    return this._url;
  }

  public get token(): string {
    if (! this._token) {
      this._token = localStorage.getItem(spotifyTokenKey);
    }
    return this._token;
  }

  private parseToken(url: string): any {
    var responseParameters = (url.split('#')[1]).split('&');
    var parsedResponse = {};
    for (var i = 0; i < responseParameters.length; i++) {
      parsedResponse[responseParameters[i].split('=')[0]] = responseParameters[i].split('=')[1];
    }
    if (parsedResponse['access_token'] !== undefined && parsedResponse['access_token'] !== null) {
      this._token = parsedResponse['access_token'];
      localStorage.setItem(spotifyTokenKey, this.token);
      console.log('token parsed: ' + this.token);
    }
    else {
      console.log('token not parsed');
    }
  }

  public loginToSpotify(): Promise<any> {
    var self = this; // a little trick to not lose track of 'this' inside of function references
    return new Promise(function(resolve, reject) {
      var browserRef = self.platform.is("core") ?
        window.open(self.url, self.browserTarget) :
        window.cordova.InAppBrowser.open(self.url,
                                         self.browserTarget,
                                         'location=no,clearsessioncache=yes,clearcache=yes');
      browserRef.addEventListener('loadstart', (event) => {
        if ((event.url).indexOf(self.callback) === 0) {
          browserRef.removeEventListener('exit', (event) => {});
          browserRef.close();
          self.parseToken(event.url);
          if (self.token) {
            resolve(self.token);
          }
          else {
            reject('Problem authenticating with Spotify');
          }
        }
      });
      browserRef.addEventListener('exit', (event) => {
        reject('The Spotify sign-in flow was cancelled');
      });
    });
  }
};
