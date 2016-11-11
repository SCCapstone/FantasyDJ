import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LeaguePage } from '../league/league';
import { CreateLeaguePage } from '../create-league/create-league';
import { SearchPage } from '../search/search';

import { AngularFire, FirebaseListObservable} from 'angularfire2';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  leaguePage = LeaguePage;
  createLeaguePage = CreateLeaguePage;
  searchPage = SearchPage;


  // Refs
  leagues: FirebaseListObservable<any[]>;
  
  constructor(public navCtrl: NavController, public af: AngularFire) {
  	this.leagues = this.af.database.list('/Leagues');
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
