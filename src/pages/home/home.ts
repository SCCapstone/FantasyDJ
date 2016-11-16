import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LeaguePage } from '../league/league';
import { CreateLeaguePage } from '../create-league/create-league';
import { SearchPage } from '../search/search';
import 'rxjs/add/operator/map';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  leaguePage = LeaguePage;
  createLeaguePage = CreateLeaguePage;
  searchPage = SearchPage;
  //get current user, but for now we will say
  user = "UserID";
  testLeagues = [];

  // Refs
  leagues: FirebaseListObservable<any[]>;
  usersLeagues: FirebaseListObservable<any[]>;
  league: FirebaseObjectObservable<any>;
  
  constructor(public navCtrl: NavController, public af: AngularFire) {
    this.user = this.user;
    //get all user's leagues
    this.usersLeagues = this.af.database.list('/UserProfiles/'+this.user+'/Leagues');
    //this.league = this.af.database.object('/Leagues/{$LeagueID}');
    this.leagues = af.database.list('/Leagues',{
      query:{
        orderByChild:'Name',
        equalTo:"AnotherLeague"
      }
    });

    this.testLeagues.push(this.af.database.list('/UserProfiles/'+this.user+'/Leagues').forEach(function(item)
      {
        console.log("here");
        console.log(af.database.object('Leagues/'+item[0].$key));
        return af.database.object('Leagues/'+item[0]);
      }));

    this.leagues = this.af.database.list('/Leagues/LeagueID' || '/League/LeagueID2');
    //console.log(this.usersLeagues);
    /**this.leagues = this.usersLeagues.map(function(item){
        return item[0].$key;
        //this.leagues = af.database.list('/Leagues/' + item[0].$key);
          
    }, );**/

    //this.leagues = af.database.list('/Leagues/' + item[0].$key); 

    //console.log(this.leagues);

    //
  
  }

  goToLeague(league){
		this.navCtrl.push(LeaguePage, {
      	league: league
    });
	}

newLeague(){
  this.navCtrl.push(CreateLeaguePage);
  }

}
