import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SearchPage } from '../search/search';

import { User, League } from '../../models/fantasydj-models';

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
  searchPage = SearchPage;
  user: User;
  league: League;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.user = this.navParams.get('user');
    this.league = this.navParams.get('league');
    console.log('Got league from navs play:' + this.league);
  }

  ionViewDidLoad() {
    console.log('Hello PlayerDetails Page');
  }

  goToSearch(user, league) {
    this.navCtrl.push(SearchPage, {
      league: league,
      user : user
    });
  }

}
