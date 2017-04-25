import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

import { IonicCloud } from '../../providers/ionic-cloud-provider';
import { SpotifyProvider } from '../../providers/spotify-provider';
import { UserData } from '../../providers/user-provider';

import { User } from '../../models/fantasydj-models';

/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  user: User;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private ionicCloud: IonicCloud,
              private spotify: SpotifyProvider,
              private userData: UserData) {
    Observable.fromPromise(this.userData.loadCurrentUser())
      .subscribe(user => {
        this.user = user
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  // log out from FantasyDJ
  logout() {
    this.spotify.logout();
    this.ionicCloud.logout();
    window.location.reload();
  }

}
