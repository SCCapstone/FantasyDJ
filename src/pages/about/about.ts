import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { IntroPage } from '../intro/intro';

@Component({
  selector: 'page-about',
  templateUrl: './about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController) {}

  goToTutorial() {
    this.navCtrl.setRoot(IntroPage);
  }

}
