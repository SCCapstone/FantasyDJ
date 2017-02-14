import { Injectable } from '@angular/core';
import { Auth, User } from '@ionic/cloud-angular';
import { SpotifyProvider } from './spotify-provider';
import { Http, Request, RequestOptions, Headers } from '@angular/http';

const authOptions = {
  inAppBrowserSettings: {
    hidden: true
  }
};

@Injectable()
export class IonicCloud {

  private _headers: Headers;
  private _apiPushUrl = 'https://api.ionic.io/push/notifications';
  private _token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
    'eyJqdGkiOiJmNmRlY2MzYS1mZDczLTRiOTEtODBiZS1mYTJkYmY5NzUyY' +
    'zMifQ.NlKK-MsTaIs6ioZpdnsYDTacZUGfry7Zj6Nw6u9ckwc'

  constructor(private auth: Auth,
              private user: User,
              private spotify: SpotifyProvider,
              private http: Http) {}

  public login(): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.spotify.loadCurrentUser().then(spotifyUser => {
        this.auth.login(
          'custom',
          {spotifyId: spotifyUser.id},
          authOptions
        ).then(result => {
          resolve(this.user);
        }).catch(error => {
          reject(error);
        });
      }).catch(error => {
        reject(error);
      });
    });
  }

  private get headers(): Headers {
    if (! this._headers) {
      this._headers = new Headers({
        'Authorization': 'Bearer ' + this._token,
        'Content-Type': 'application/json'
      });
    }
    return this._headers;
  }

  public sendPush(externalId: string,
                  message: string): Promise<any> {
    let data = {
      'external_ids': [ externalId ],
      'profile': 'push',
      'notification': {
        'message': message
      }
    };

    let options = new RequestOptions({
      headers: this.headers,
    });

    return new Promise<any>((resolve, reject) => {
      this.http.post(this._apiPushUrl, data, options)
        .map(res => {
          let body = res.json()
          return body.data || { };
        })
        .subscribe(
          obj => {
            console.log(obj);
            resolve(obj);
          },
          error => reject(error),
          () => console.log('IonicCloud api call complete')
        );
    });
  }

};
