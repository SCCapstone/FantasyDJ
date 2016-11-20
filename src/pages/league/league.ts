import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PlayerDetailsPage } from '../player-details/player-details';

import { League } from '../../models/fantasydj-models';
import { LeagueData } from '../../providers/league-provider';

/*
  Generated class for the League page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-league',
  templateUrl: 'league.html'
})
export class LeaguePage {

  league = null;
  playerDetailsPage = PlayerDetailsPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.league = this.navParams.get('league');
  }

  ionViewDidLoad() {
    console.log('Hello League Page');
  }



}
