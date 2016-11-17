import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import { LeaguePage } from '../league/league';
import { CreateLeaguePage } from '../create-league/create-league';
import { SearchPage } from '../search/search';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';

import { SpotifyUser } from '../../models/spotify-models';

import { OAuthService } from '../../providers/oauth-service';
import { SpotifyProvider } from '../../providers/spotify-provider';
import { UserData, FBUser } from '../../providers/user-provider';

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
  leagues: FirebaseListObservable<any[]>;

  constructor(public navCtrl: NavController,
              public af: AngularFire,
              private platform: Platform,
              private authService: OAuthService,
              private spotify: SpotifyProvider,
              private userData: UserData) {
    this.leagues = this.af.database.list('/Leagues');
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
        this.userData.create(this.spotifyUser).then(user => {
          console.log('created user: ' + JSON.stringify(user));
        });
      });
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