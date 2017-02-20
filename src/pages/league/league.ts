import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { PlayerDetailsPage } from '../player-details/player-details';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/range';
import 'rxjs/add/observable/zip';
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
  scores: Observable<Score[]>;
  current: User = null;
  opponent: User;
  test: Object;
  source: Observable<{ id: number; total: number; }>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private leagueData: LeagueData,
              public alertCtrl: AlertController,
              private userData: UserData) {
    this.league = this.navParams.get('league');
    this.users = this.userData.loadUsers(this.league.id);
    this.scores = this.leagueData.loadPlaylistScores(this.league.id);
    this.userData.loadCurrentUser().then(user => {
    this.current = user;
    this.leagueData.getOpponent(user.id, this.league.id).then(opp =>{
      this.opponent = opp;
    }).catch(error => console.log(error));
    
    //this.playlist_scores = this.leagueData.loadPlaylistScores(this.league.id);
    

    console.log(this.users);
    console.log(this.scores);
    Observable
    .zip(this.users,
         this.scores,
         (id: number, total: number) => ({ id, total }))
    .subscribe(x => console.log(x));



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
}
