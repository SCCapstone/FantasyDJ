import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2';
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
  private fbLeagues: FirebaseListObservable<any[]>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private leagueData: LeagueData,
              public alertCtrl: AlertController,
              private db: AngularFireDatabase,
              private userData: UserData) {
    this.league = this.navParams.get('league');

    console.log('Got league from navs league:' + this.league);


    console.log(this.league)

    this.users = this.userData.loadUsers(this.league.id);
    console.log('Current league: ' + this.league.id)
    this.fbLeagues = this.db.list('/Leagues')
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
            this.db.object('/Leagues/' + this.league.id)
              .remove()
              .then(() => this.navCtrl.pop())
              .catch(err => console.log(err));

            console.log('Yes clicked');
          }
        }
      ]
    });
    confirm.present();
    console.log('Are you sure you want to delete this league?');
  }
}
