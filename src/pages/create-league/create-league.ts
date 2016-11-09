import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the CreateLeague page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-create-league',
  templateUrl: 'create-league.html'
})
export class CreateLeague {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello CreateLeague Page');
  }

}
