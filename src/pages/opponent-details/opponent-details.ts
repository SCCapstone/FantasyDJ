import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SearchPage } from '../search/search';
import { Observable } from 'rxjs/Observable';


import { User, League, Song } from '../../models/fantasydj-models';

import { SongData } from '../../providers/song-provider';

/*
 Generated class for the PlayerDetails page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-opponent-details',
  templateUrl: 'opponent-details.html'
})
export class OpponentDetailsPage {
  searchPage = SearchPage;
  user: User;
  league: League;
  songs: Observable<Song[]>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private songData: SongData) {
    this.user = this.navParams.get('user');
    this.league = this.navParams.get('league');
    this.songs = this.songData.loadSongs(this.league.id, this.user.id);
  }

  ionViewDidLoad() {
    console.log('Hello OpponentPlayerDetails Page');
    console.log(this.league)
    console.log(this.user)
  }

  // goToSearch(user, league) {
  //   this.navCtrl.push(SearchPage, {
  //     league: league,
  //     user : user
  //   });
  // }

}
