import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { League, User, Score, Song } from '../../models/fantasydj-models';
import { LeagueData } from '../../providers/league-provider';
import { UserData } from '../../providers/user-provider';
import { SongData } from '../../providers/song-provider';
import {OpponentDetailsPage} from "../opponent-details/opponent-details";
import { AnalyticsPage } from '../analytics/analytics';
import { SearchPage } from '../search/search';
import {SongDetailPage} from "../song-detail/song-detail";


/*
 Generated class for the League page.
 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-league',
  templateUrl: 'league.html'
})
export class LeaguePage {

  league: League;
  users: Observable<User[]>;
  creator: boolean;
  current: User = null;
  opponent: User;
  winner_flag = null;
  songs: Observable<Song[]>;
  opp_songs: Observable<Song[]>;
  analytics_flag = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private leagueData: LeagueData,
              public alertCtrl: AlertController,
              private userData: UserData,
              private songData: SongData) {

    this.league = this.navParams.get('league');
    this.current = this.navParams.get('currentUser');
    this.opponent = this.navParams.get('opponent');

    // load current user, their songs, and set flag for if they won or not
    // if league hasn't ended, winner flag is null
    this.userData.loadCurrentUser().then(user => {
      this.current = user;
      this.songs = this.songData.loadSongs(this.league.id, this.current.id);
      this.leagueData.getWinner(this.league.id).then(winner => {
      if(winner != null){
        console.log('winner: ' + winner.id);
        if(winner.id == this.current.id){
          this.winner_flag = true;
        }
        else this.winner_flag = false;
      }
    });

    // get the creator of the league
    // this determines who chooses a song first
    this.leagueData.getCreator(this.league.id).then(user => {
      if(user.id == this.current.id) {
        this.creator = true;
      }
      else {
        this.creator = false;
      }
    });

    // get the opponent and their songs
    this.leagueData.getOpponent(user.id, this.league.id).then(opp =>{
        this.opponent = opp;
        this.opp_songs = this.songData.loadSongs(this.league.id, this.opponent.id);
      }).catch(error => console.log(error));
    }).catch(error => console.log(error));

    // check if their is enough data to begin drawing analytics
    this.leagueData.getLeagueData(this.league.id, this.current.id).then(data => {
      if( data.length > 0 ){
        this.analytics_flag = true;
      }
    });

  }

  ionViewDidLoad() {
    console.log('Hello League page');

  }

  goToSong(user, league, song) {
    console.log("This is the instance of song" ,song)
    console.log("Going to song", song.id)
    this.navCtrl.push(SongDetailPage, {
      song: song,
      league: league,
      user : user
    });
  }

  deleteThisLeague() {
    let confirm = this.alertCtrl.create({
      title: 'Delete League',
      message: 'Do you really want to delete this league?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.leagueData.deleteLeague(this.league.id)
              .then(() => this.navCtrl.pop())
              .catch(err => console.log(err));
            console.log('Yes clicked');
          }
        }
      ]
    });
    confirm.present();
  }

  getScore(leagueId, userId){
    return this.leagueData.getPlaylistScore(leagueId, userId);
  }

  getSongScore(leagueId, userId, songId) {
    return this.leagueData.getSongScore(leagueId, userId, songId);
  }

  goToAnalytics(user, league, opponent) {
    this.navCtrl.push(AnalyticsPage, {
      league: league,
      user : user,
      opponent: opponent
    });
  }

  goToSearch(user, league) {
    this.navCtrl.push(SearchPage, {
      league: league,
      user : user
    });
  }

  // transform the date from ISO 8601 format
  transformDate(date){
    var year = date.slice(0,4);
    var month = this.monthDict[date.slice(5,7)];
    var day = date.slice(8,10);
    var hour = date.slice(11,13);
    var minute = date.slice(14,16);
    return hour + ':' + minute + ' on ' + month + ' '
            + day + ', ' + year;
  }

  public monthDict = {'01': 'Jan',
                      '02': 'Feb',
                      '03': 'Mar',
                      '04': 'Apr',
                      '05': 'May',
                      '06': 'Jun',
                      '07': 'Jul',
                      '08': 'Aug',
                      '09': 'Sep',
                      '10': 'Oct',
                      '11': 'Nov',
                      '12': 'Dec'};

}
