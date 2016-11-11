import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PlayerDetailsPage } from '../player-details/player-details';

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

  playerDetailsPage = PlayerDetailsPage;

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello League Page');
  }

}
