import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the PlayerDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-player-details',
  templateUrl: 'player-details.html'
})
export class PlayerDetails {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello PlayerDetails Page');
  }

}
