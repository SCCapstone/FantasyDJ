import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { SpotifyProvider } from '../../providers/spotify-provider';
import { SpotifySearchResult } from '../../models/spotify-models';
import { League, User } from '../../models/fantasydj-models';

import { LeagueData } from '../../providers/league-provider';
import { SongData } from '../../providers/song-provider';

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



  user: User;
  league: League;
  opponent_id: string;
  query: string = "";
  results: SpotifySearchResult;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alert: AlertController,
              private spotify: SpotifyProvider,
              private leagueData: LeagueData,
              private songData: SongData) {
    this.league = this.navParams.get('league');
    this.user = this.navParams.get('user');
    this.opponent_id = this.navParams.get('opponent_id');
    this.alert = alert;
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

  do() {
  console.log('clicked card');
  }

  
  addSong(user, opponent_id, league, track) {

      if (this.leagueData.songAlreadyInLeague(this.songData.getKeyFromSpotifyId(track.id), league.id, 
                                              user.id, this.opponent_id) == true){
          this.showAlertPopup();
      }
    else{
    this.leagueData.addSong(
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

  showAlertPopup(){
    let popup = this.alert.create({
      title: 'That song has already been chosen. Please choose another.',
      buttons: ['Okay']
    });
    popup.present();
  }

}


