import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SearchPage } from '../search/search';
import { Observable } from 'rxjs/Observable';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2';
import { User, League, Song } from '../../models/fantasydj-models';

import { SongData } from '../../providers/song-provider';
import { UserData } from '../../providers/user-provider';
import { LeagueData } from '../../providers/league-provider';

/*
  Generated class for the PlayerDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-player-details',
  templateUrl: 'player-details.html'
})
export class PlayerDetailsPage {
  searchPage = SearchPage;
  user: User;
  league: League;
  creator: boolean;
  songs: Observable<Song[]>;
  users: FirebaseListObservable<any[]>;
  opp_songs: Observable<Song[]>;
  opponent_id: string;

  constructor(public navCtrl: NavController, 
              private db: AngularFireDatabase,
              public navParams: NavParams,
              private songData: SongData,
              private userData: UserData,
              private leagueData: LeagueData) {
    this.user = this.navParams.get('user');
    this.league = this.navParams.get('league');
    if (this.leagueData.getCreatorId(this.league.id) == this.user.id){
      this.creator = true;
    } 
    else this.creator = false;
    this.songs = this.songData.loadSongs(this.league.id, this.user.id);
    this.opponent_id = this.leagueData.getOpponentId(this.user.id, this.league.id);
    this.opp_songs = this.songData.loadSongs(this.league.id, this.opponent_id);
  }

  ionViewDidLoad() {
    console.log('Hello PlayerDetails Page');
  }

  goToSearch(user, opponent_id, league) {
    this.navCtrl.push(SearchPage, {
      league: league,
      user : user,
      opponent_id: opponent_id
    });
  }

}
