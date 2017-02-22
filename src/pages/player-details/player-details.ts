import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SearchPage } from '../search/search';
import { AnalyticsPage } from '../analytics/analytics';
import { Observable } from 'rxjs/Observable';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2';
import { User, League, Song, Score } from '../../models/fantasydj-models';

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
  opponent: User;
  dates: Date[];


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private songData: SongData,
              private userData: UserData,
              private leagueData: LeagueData) {
    this.user = this.navParams.get('user');
    this.league = this.navParams.get('league');
    this.leagueData.getCreator(this.league.id).then(user => {
      if(user.id == this.user.id) {
        this.creator = true;
      }
      else {
        this.creator = false;
      }
      console.log("this.creator: " + this.creator);
    });  
  
    this.songs = this.songData.loadSongs(this.league.id, this.user.id);
    this.leagueData.getOpponent(this.user.id, this.league.id).then(opp =>{
      console.log(opp);
      this.opponent = opp;
      this.opp_songs = this.songData.loadSongs(this.league.id, this.opponent.id);
      console.log("opponent_id: " + this.opponent.id);
    });
     
  }

  ionViewDidLoad() {
    console.log('Hello PlayerDetails Page');
    console.log(this.league)
    console.log(this.user)
  }

  goToSearch(user, league) {
    this.navCtrl.push(SearchPage, {
      league: league,
      user : user
    });
  }

  getScore(leagueId, userId, songId){
    return this.leagueData.getSongScore(leagueId, userId, songId);
  }

  goToAnalytics() {
    this.navCtrl.push(AnalyticsPage);
  }
}
