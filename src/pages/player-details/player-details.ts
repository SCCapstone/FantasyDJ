import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { User } from '../../models/fantasydj-models';

/*
  Generated class for the PlayerDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-player-details',
  templateUrl: 'player-details.html'
})
export class PlayerDetailsPage {

  user: User;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.user = this.navParams.get('user');
  }

  ionViewDidLoad() {
    console.log('Hello PlayerDetails Page');
  }

}
