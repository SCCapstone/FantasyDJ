import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SpotifyProvider } from '../../providers/spotify-provider';

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


  ionViewDidLoad() {
    console.log('Landed on Search Page');
  }

  doSearch(val) {
  console.log(this.searchInput);
  this.spotify.search(this.searchInput).then(res => {
	 	this.tracks = res.tracks;
	    }, err => {
	      console.log('error searching spotify');
	    });
  }

}