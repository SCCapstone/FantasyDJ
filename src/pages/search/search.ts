import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { SpotifyProvider } from '../../providers/spotify-provider';
import { SpotifySearchResult, SpotifyTrack } from '../../models/spotify-models';
import { League, User } from '../../models/fantasydj-models';


import { LeagueData } from '../../providers/league-provider';
import { SongData } from '../../providers/song-provider';
import { PopularData } from '../../providers/popular-provider';

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
  popular_tracks: Observable<SpotifyTrack[]>;
  results: SpotifySearchResult;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alert: AlertController,
              private spotify: SpotifyProvider,
              private leagueData: LeagueData,
              private songData: SongData,
              private popularData: PopularData) {
    this.league = this.navParams.get('league');
    this.user = this.navParams.get('user');
    this.alert = alert;
    this.popular_tracks = this.popularData.loadPopularTracks();
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

  addSong(user, league, track) {
    console.log(league);
    this.leagueData.updatePlaylist(
      user.id,
      league.id,
      track
    ).then(song => {
      console.log('added song: ' + song.name);
      console.log("Track id: " + track.id)
      this.navCtrl.pop();
    }).catch(err => {
      this.showAlertPopup(err);
      console.log(err, 'error adding new song');
    });
  }

  showAlertPopup(message){
    let popup = this.alert.create({
      title: message,
      buttons: ['Okay']
    });
    popup.present();
  }

}
