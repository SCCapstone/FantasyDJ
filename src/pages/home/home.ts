import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { League } from '../league/league';

import { CreateLeague } from '../create-league/create-league';

import { AngularFire, FirebaseListObservable} from 'angularfire2';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  leaguePage = League;
  createLeaguePage = CreateLeague;

  // Refs
  leagues: FirebaseListObservable<any[]>;
  
  constructor(public navCtrl: NavController, public af: AngularFire) {
  	this.leagues = this.af.database.list('/Leagues');
  }

  goToLeague(league){
		this.navCtrl.push(League, {
      	league: league
    });
	}

}
