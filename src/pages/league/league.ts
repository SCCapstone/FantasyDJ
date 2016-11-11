import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PlayerDetails } from '../player-details/player-details';

/*
  Generated class for the League page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-league',
  templateUrl: 'league.html'
})
export class League {

  league = null;
  playerDetailsPage = PlayerDetails;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.league = this.navParams.get('league');
  }

  ionViewDidLoad() {
    console.log('Hello League Page');
  }

}
