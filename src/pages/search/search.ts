import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
<<<<<<< HEAD
=======
import { SpotifyProvider } from '../../providers/spotify-provider';
>>>>>>> 36ed5c13e7c3570171ae7c5d383dcc09cc2a16e7

import { SpotifyProvider } from '../../providers/spotify-provider';
import { SpotifySearchResult } from '../../models/spotify-models';

import { League, User } from '../../models/fantasydj-models';

import { LeagueData } from '../../providers/league-provider';

/*
  Generated class for the Search page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
public searchInput: any;
public tracks:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private spotify: SpotifyProvider) {
  	this.searchInput = "TEST";
  
  	console.log(this.searchInput);

  }

  user: User;
  league: League;
  query: string = "";
  results: SpotifySearchResult;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private spotify: SpotifyProvider,
              private leagueData: LeagueData) {
    this.league = this.navParams.get('league');
    this.user = this.navParams.get('user');
  }

  ionViewDidLoad() {
    console.log('Landed on Search Page');
  }



  search() {
    if (this.query.length > 0) {
      this.spotify.search(this.query)
        .then(results => this.results = results)
        .catch(error => console.log(error));
    } else {
      this.results = null;
    }
  }

  addSong(user, league, track) {
    this.leagueData.addSongToUser(
      user.id,
      league.id,
      track.id,
      track.name,
      track.album.artists[0].name
    ).then(song => {
      console.log('added song: ' + song.name);
      this.navCtrl.pop();
    }).catch(err => {
      console.log(err, 'error adding new song');
    });
  }

}

 

