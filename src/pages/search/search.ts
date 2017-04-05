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




  user: User;
  league: League;
  opponent_id: string;
  query: string = "";
  results: SpotifySearchResult;
  playing: boolean = true;
  currentTrack: any;
  stream:any;
  promise:any;
  song:any;
  url:any;
  running:boolean;



  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alert: AlertController,
              private spotify: SpotifyProvider,
              private leagueData: LeagueData,
              private songData: SongData) {
    this.league = this.navParams.get('league');
    this.user = this.navParams.get('user');
    this.alert = alert;
    this.stream = new Audio(this.url);
    this.url = "x";
    this.running = false;
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


  songPick(track) {
    if(this.running){
      this.pause()
    }

    this.currentTrack = track.id
    console.log("current track: ",this.currentTrack);
    this.song = this.spotify.loadTrack(this.currentTrack).then(song => {
      console.log('song ' + song.preview_url + ' songpick success');
      this.url = song.preview_url;
      this.stream = new Audio(this.url);
      this.running = true;
      this.stream.play();
      this.promise = new Promise((resolve,reject) => {
        this.stream.addEventListener('playing', () => {
          resolve(true);
        });

        this.stream.addEventListener('error', () => {
          reject(false);
        });
      });

      return this.promise;
    });
  }

  pause() {
    this.stream.pause();
  };

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
