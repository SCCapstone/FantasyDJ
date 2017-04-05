import { Injectable } from '@angular/core';
import { Auth, User, Push, PushToken } from '@ionic/cloud-angular';
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

  private subscribed: boolean = false;

  constructor(private auth: Auth,
              private user: User,
              private push: Push,
              private spotify: SpotifyProvider,
              private http: Http) {}

  public login(): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.spotify.loadCurrentUser()
        .then(spotifyUser => {
          return this.auth.login(
            'custom',
            {spotifyId: spotifyUser.id},
            authOptions
          );
        })
        .then(result => resolve(this.user))
        .catch(error => reject(error))
        .then(() => {
          return this.initializePush();
        })
        .then(token => console.log('push notifications registered after login'))
        .catch(error => console.log('error registering push notifications after login: ', error));
    });
  }

  public initializePush(): Promise<PushToken> {
    return new Promise<PushToken>((resolve, reject) => {
      this.push.register()
        .then(token => {
          return this.push.saveToken(token);
        })
        .then(token => {
          console.log('then after saving token');
          if (! this.subscribed) {
            console.log('was not subscribed to push notifications. subscribing');
            this.push.rx.notification()
              .subscribe(msg => {
                console.log('should be displaying message: ' + msg.text);
                alert(msg.title + ': ' + msg.text);
              });
            this.subscribed = true;
          }
          resolve(token);
        })
        .catch(error => reject(error));
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
