import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { League } from '../league/league';

import { CreateLeague } from '../create-league/create-league';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  leaguePage = League;
  createLeaguePage = CreateLeague;
  
  constructor(public navCtrl: NavController) {

  }

}
