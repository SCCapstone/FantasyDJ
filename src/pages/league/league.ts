import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { PlayerDetailsPage } from '../player-details/player-details';
//import 'rxjs/add/Observable/zipArray';
import { League, User, Score } from '../../models/fantasydj-models';
import { LeagueData } from '../../providers/league-provider';
import { UserData } from '../../providers/user-provider';
import {OpponentDetailsPage} from "../opponent-details/opponent-details";

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
  current: User = null;
  opponent: User;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private leagueData: LeagueData,
              public alertCtrl: AlertController,
              private userData: UserData) {
    this.league = this.navParams.get('league');
    this.users = this.userData.loadUsers(this.league.id);
    this.userData.loadCurrentUser().then(user => {
    this.current = user;
    this.leagueData.getOpponent(user.id, this.league.id).then(opp =>{
      this.opponent = opp;
    }).catch(error => console.log(error));
    }).catch(error => console.log(error));   
}

  ionViewDidLoad() {
    console.log('Hello League page');

  }

  goToPlayer(user, league) {
    console.log("user: " + user.id);
    if(this.current.id == user.id){
      this.navCtrl.push(PlayerDetailsPage, {
        user: user,
        league: league
      });
    }
    else {
      this.navCtrl.push(OpponentDetailsPage, {
        user: user,
        league: league
      });
    }
  }

  deleteThisLeague() {
    let confirm = this.alertCtrl.create({
      title: 'Delete League',
      message: 'Do you really want to delete this league?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.leagueData.deleteLeague(this.league.id)
              .then(() => this.navCtrl.pop())
              .catch(err => console.log(err));
            console.log('Yes clicked');
          }
        }
      ]
    });
    confirm.present();
  }

  getScore(leagueId, userId){
    return this.leagueData.getPlaylistScore(leagueId, userId);
  }


}
