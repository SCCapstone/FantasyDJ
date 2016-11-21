import { Component } from '@angular/core';
import { NavController, NavParams  } from 'ionic-angular';
import { AngularFire, FirebaseListObservable} from 'angularfire2';
import { OAuthService } from '../../providers/oauth-service';

import { User} from '../../models/fantasydj-models';
import { LeagueData } from '../../providers/league-provider';
import { UserData } from '../../providers/user-provider';


/*
  Generated class for the CreateLeague page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-create-league',
  templateUrl: 'create-league.html'
})
export class CreateLeaguePage {
  leagues: FirebaseListObservable<any>;
  currentUser: User = null
  constructor(public navCtrl: NavController, 
              public af:AngularFire,
              public navParams: NavParams,
              private authService: OAuthService,
              private userData: UserData,
              private leagueData: LeagueData) {
  	this.leagues = af.database.list('/Leagues');
    //this.user = this.navParams.get('currentUser');
    if (this.authService.token) {
      this.userData.loadCurrentUser().then(user => {
        this.currentUser = user;
      }).catch(error => console.log(error));
    }
  }
  
ionViewDidLoad() {
    console.log('Hello CreateLeague Page');
  }

createLeague(name, opponent){
  this.leagueData.createLeague(name, this.currentUser.id, opponent).then(league => {
          console.log(league.name);
          this.navCtrl.pop();
        }, err => {
          console.log(err);
          console.log('error creating new league');
        });
 }
}
