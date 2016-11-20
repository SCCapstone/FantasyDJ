import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import { LeaguePage } from '../league/league';
import { CreateLeaguePage } from '../create-league/create-league';
import { SearchPage } from '../search/search';

import { AngularFire } from 'angularfire2';
import { Observable } from 'rxjs/Observable';

import { SpotifyUser } from '../../models/spotify-models';
import { League } from '../../models/fantasydj-models';

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
  spotifyUser: SpotifyUser;

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
      this.getSpotifyUser();
      //this.searchSpotify('lady gaga');
    }
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

  getSpotifyUser() {
    this.spotify.loadCurrentUser().then(res => {
      this.spotifyUser = res;
      console.log(this.spotifyUser);
    }).then(res => {
      this.userData.loadUser(this.spotifyUser.id).then(user => {
        console.log(user);
      }, err => {
        console.log('load user fail, creating');
        this.userData.createUser(this.spotifyUser).then(user => {
          console.log('created user: ' + JSON.stringify(user));
        }).catch(error => console.log(error));
      }).then(() => {
        this.leagues = this.leagueData.loadLeagues(this.spotifyUser.id);
        // this.leagueData.createLeague(this.spotifyUser.id, 'My League')
        //   .then(league => console.log(league, 'created league'))
        //   .catch(error => console.log(error, 'could not create league'));
      }).catch(err => console.log(err));
    }).catch(err => {
      console.log(err, 'create user fail');
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

  goToLeague(league) {
    this.navCtrl.push(LeaguePage, {
      league: league
    });
  }

  newLeague(){
    this.navCtrl.push(CreateLeaguePage);
  }

};
