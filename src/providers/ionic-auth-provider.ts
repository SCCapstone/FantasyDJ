import { Injectable } from '@angular/core';
import { Auth, User } from '@ionic/cloud-angular';
import { SpotifyProvider } from './spotify-provider';

const authOptions = {
  inAppBrowserSettings: {
    hidden: true
  }
};

@Injectable()
export class IonicAuth {

  constructor(private auth: Auth,
              private user: User,
              private spotify: SpotifyProvider) {}

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

};
