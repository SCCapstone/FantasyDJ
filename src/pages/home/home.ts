import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import { LeaguePage } from '../league/league';
import { CreateLeaguePage } from '../create-league/create-league';
import { SearchPage } from '../search/search';

import { Observable } from 'rxjs/Observable';

import { User, League } from '../../models/fantasydj-models';

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

  // Refs
  leagues: Observable<League[]>;

  constructor(public navCtrl: NavController,
              private platform: Platform,
              private ionicCloud: IonicCloud,
              private spotify: SpotifyProvider,
              private userData: UserData,
              private leagueData: LeagueData) {
    this.init();
  }

  private init() {
    if (this.spotify.token) {
      this.userData.loadCurrentUser().then(user => {
        this.ionicCloud.login().then(ionicUser => {
          console.log('login to ionic cloud success: ' + ionicUser);
        }).catch(error => {
          console.log('error logging into ionic cloud');
        });
        this.currentUser = user;
        this.leagues = this.leagueData.loadLeagues(user.id);
      }).catch(error => console.log(error));
    }
  }

  login() {
    this.spotify.login().then(token => {
      this.init();
    }).catch(error => {
      console.log(error);
    });
  }

  goToLeague(league, currentUser) {
    this.navCtrl.push(LeaguePage, {
      league: league,
      currentUser : currentUser
    });
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
