import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import { LeaguePage } from '../league/league';
import { CreateLeaguePage } from '../create-league/create-league';
import { SearchPage } from '../search/search';

import { Observable } from 'rxjs/Observable';

import { User, League } from '../../models/fantasydj-models';

import { OAuthService } from '../../providers/oauth-service';
import { SpotifyProvider } from '../../providers/spotify-provider';
import { IonicCloud } from '../../providers/ionic-cloud-provider';
import { UserData } from '../../providers/user-provider';
import { LeagueData } from '../../providers/league-provider';


@Component({
  selector: 'page-home',
  templateUrl: './home.html'
})
export class HomePage {

  leaguePage = LeaguePage;
  createLeaguePage = CreateLeaguePage;
  searchPage = SearchPage;
  currentUser: User = null;
  index: number = null;
  flag: string = 'current';

  // Refs
  leagues: Observable<League[]>;
  currentLeagues: Observable<League[]>;
  pastLeagues: Observable<League[]>;

  constructor(public navCtrl: NavController,
              private platform: Platform,
              private authService: OAuthService,
              private ionicCloud: IonicCloud,
              private spotify: SpotifyProvider,
              private userData: UserData,
              private leagueData: LeagueData) {
    this.init();
  }

  private init() {
    if (this.authService.token) {
      this.userData.loadCurrentUser().then(user => {
        this.ionicCloud.login().then(ionicUser => {
          console.log('login to ionic cloud success: ' + ionicUser);
        }).catch(error => {
          console.log('error logging into ionic cloud');
        });
        this.currentUser = user;
        this.leagues = this.leagueData.loadLeagues(user.id);
        this.currentLeagues = this.leagueData.loadCurrentLeagues(user.id);
        this.pastLeagues = this.leagueData.loadPastLeagues(user.id);
      }).catch(error => console.log(error));
    }
  }

  login() {
    this.platform.ready().then(() => {
      this.authService.loginToSpotify()
        .then(token => {
          this.init();
        });
    }).catch(error => {
      console.log(error);
    });
  }

  goToLeague(league, currentUser) {
    this.leagueData.getOpponent(currentUser, league.id).then(opp =>{
      this.navCtrl.push(LeaguePage, {
        league: league,
        currentUser : currentUser,
        opponent: opp
    });
      }).catch(error => console.log(error));
  }

  newLeague(){
    this.navCtrl.push(CreateLeaguePage);
  }

  getScore(leagueId, userId){
    return this.leagueData.getPlaylistScore(leagueId, userId);
  }

  isCreator(leagueId, userId){
    return this.leagueData.isCreator(leagueId, userId);
  }

  isWinner(leagueId, userId){
    return this.leagueData.isWinner(leagueId, userId);
  }

};
