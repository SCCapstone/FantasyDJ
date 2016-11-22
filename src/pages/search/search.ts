import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SpotifyProvider } from '../../providers/spotify-provider';

import { SpotifyProvider } from '../../providers/spotify-provider';
import { SpotifySearchResult } from '../../models/spotify-models';

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

  query: string = "";
  results: SpotifySearchResult;

  constructor(public navCtrl: NavController,
              private spotify: SpotifyProvider) {}


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

}

