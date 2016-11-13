import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import { LeaguePage } from '../league/league';
import { CreateLeaguePage } from '../create-league/create-league';
import { SearchPage } from '../search/search';
import { LoginPage } from '../login/login';

import { AngularFire, FirebaseListObservable} from 'angularfire2';

import { OAuthService } from '../../providers/oauth-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  leaguePage = LeaguePage;
  createLeaguePage = CreateLeaguePage;
  searchPage = SearchPage;
  loginPage = LoginPage;

  // Refs
  leagues: FirebaseListObservable<any[]>;

  constructor(public navCtrl: NavController,
              public af: AngularFire,
              private platform: Platform,
              private authService: OAuthService) {
    this.leagues = this.af.database.list('/Leagues');
  }

  login() {
    this.platform.ready().then(() => {
      this.authService.loginToSpotify();
    }, (error) => {
      console.log(error);
    });
  }

  isLoggedIn(): boolean {
    return this.authService.token !== null;
  }

  goToLeague(league) {
    this.navCtrl.push(LeaguePage, {
      league: league
    });
  }

};
