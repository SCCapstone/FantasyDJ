import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Draft page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-draft',
  templateUrl: 'draft.html'
})
export class Draft {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello Draft Page');
  }

}
