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
import {SongDetailPage} from "../song-detail/song-detail";

/*
 PlayerDetails page shows information about the playlist (songs selected) as well as information such
  as who is winning or losing the match
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
  song:any
  users: FirebaseListObservable<any[]>;
  opp_songs: Observable<Song[]>;
  opponent: User;
  dates: Date[];
  analytics_flag = false;


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
    });
    this.songs = this.songData.loadSongs(this.league.id, this.user.id);
    this.leagueData.getOpponent(this.user.id, this.league.id).then(opp =>{
      console.log(opp);
      this.opponent = opp;
      this.opp_songs = this.songData.loadSongs(this.league.id, this.opponent.id);
      console.log("opponent_id: " + this.opponent.id);
    });

    this.leagueData.getLeagueData(this.league.id, this.user.id).then(data => {
      if( data.length > 0 ){
        this.analytics_flag = true;
      }
    });

  }

  ionViewDidLoad() {
    console.log('Hello PlayerDetails Page');
    console.log(this.league);
    console.log(this.user);
  }

  // takes the user to the search page
  goToSearch(user, league) {
    this.navCtrl.push(SearchPage, {
      league: league,
      user : user
    });
  }

  // takes user to the song detail page
  goToSong(user, league, song) {
    console.log("This is the instance of song" ,song)
    console.log("Going to song", song.id)
    this.navCtrl.push(SongDetailPage, {
      song: song,
      league: league,
      user : user
    });
    console.log(this.song);

  }

  // returns the score for a particular song
  getScore(leagueId, userId, songId) {
    return this.leagueData.getSongScore(leagueId, userId, songId);
  }

  // takes user to the analytics page for the selected song
  goToAnalytics(user, league) {
    this.navCtrl.push(AnalyticsPage, {
      league: league,
      user : user
    });
  }
}
