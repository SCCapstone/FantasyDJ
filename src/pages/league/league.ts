import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { PlayerDetailsPage } from '../player-details/player-details';

import { League, User } from '../../models/fantasydj-models';
import { LeagueData } from '../../providers/league-provider';
import { UserData } from '../../providers/user-provider';

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

  league: League;
  playerDetailsPage = PlayerDetailsPage;
  users: Observable<User[]>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private leagueData: LeagueData,
              private userData: UserData) {
    this.league = this.navParams.get('league');

    console.log('Got league from navs league:' + this.league);


    console.log(this.league)

    this.users = this.userData.loadUsers(this.league.id);
  }

  ionViewDidLoad() {
    console.log('Hello League Page');
  }

  goToPlayer(user, league) {
    this.navCtrl.push(PlayerDetailsPage, {
      user: user,
      league: league
    });
  }
  
  deleteThisLeague() {
    console.log('Are you sure you want to delete this league?');
  } 
}
