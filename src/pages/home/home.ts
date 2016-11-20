import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import { LeaguePage } from '../league/league';
import { CreateLeaguePage } from '../create-league/create-league';
import { SearchPage } from '../search/search';

import { AngularFire } from 'angularfire2';
import { Observable } from 'rxjs/Observable';

import { User, League } from '../../models/fantasydj-models';

import { OAuthService } from '../../providers/oauth-service';
import { SpotifyProvider } from '../../providers/spotify-provider';
import { UserData } from '../../providers/user-provider';
import { LeagueData } from '../../providers/league-provider';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  leaguePage = LeaguePage;
  createLeaguePage = CreateLeaguePage;
  searchPage = SearchPage;
  currentUser: User = null;

  // Refs
  leagues: Observable<League[]>;

  constructor(public navCtrl: NavController,
              public af: AngularFire,
              private platform: Platform,
              private authService: OAuthService,
              private spotify: SpotifyProvider,
              private userData: UserData,
              private leagueData: LeagueData) {
    if (this.authService.token) {
      this.userData.loadCurrentUser().then(user => {
        this.currentUser = user;
        this.leagues = this.leagueData.loadLeagues(user.id);
      }).catch(error => console.log(error));
    }
  }

  login() {
    this.platform.ready().then(() => {
      this.authService.loginToSpotify();
    }, (error) => {
      console.log(error);
    });
  }

  searchSpotify(query: string) {
    this.spotify.search(query).then(res => {
      for (var item of res.tracks.items) {
        this.spotify.loadTrack(item.id).then(track => {
          console.log(track.name);
          console.log(track.popularity);
        }, err => {
          console.log('error loading track from spotify');
        });
      }
    }, err => {
      console.log('error searching spotify')
    });
  }

  goToLeague(league, currentUser) {
    this.navCtrl.push(LeaguePage, {
      league: league,
      currentUser : currentUser
    });
  }

  newLeague(currentUser){
    this.navCtrl.push(CreateLeaguePage,{
      user: currentUser
    });
  }

};
