import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SongData } from '../../providers/song-provider';
import { LeagueData } from '../../providers/league-provider';
import { Observable } from 'rxjs/Observable';
import {Platform} from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';
declare var window: any;
declare var cordova: any;


import { User, League, Song } from '../../models/fantasydj-models';


/*
  Song Detail page, shows infor about the song and allows user to preview it
*/
@Component({
  selector: 'page-song-detail',
  templateUrl: 'song-detail.html',

})
export class SongDetailPage {
  user: User;
  league: League;
  songs: Observable<Song[]>;
  stream:any;
  promise:any;
  url:any;
  songFire:any;
  song:any;





  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private songData: SongData,
              private platform: Platform,
              private leagueData: LeagueData)
  {
    this.user = this.navParams.get('user');
    this.league = this.navParams.get('league');
    this.songFire = navParams.get("song");
    this.song = this.songData.loadSong(this.songFire);
    this.url = this.song.preview;
    this.stream = new Audio(this.songFire.preview);}

  ionViewDidLoad() {
    console.log('SONG-DETAIL');
  }
  // launches the spotify preview in a in-app web browser
  launchUrl(url) {
    this.platform.ready().then(() => {
      let ref = new InAppBrowser(url,
        '_blank');
      ref.on('exit').subscribe(() => {
        console.log('Exit In-App Browser');
      });
    });
    }

  // pauses the stream if user leaves page
  ionViewDidLeave() {
    this.stream.pause();
  }

  // initiates playing of stream
  play() {
    console.log("song ID ", this.songFire)
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
  };

  pause() {
    this.stream.pause();
  };

}
