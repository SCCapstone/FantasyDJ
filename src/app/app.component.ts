import { Component } from '@angular/core';
import { Platform} from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import { IntroPage } from '../pages/intro/intro';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class FantasyDjApp {
  rootPage: any = TabsPage;

  constructor(platform: Platform) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      if (localStorage.getItem('tutorial_shown') === 'true') {
        this.rootPage = TabsPage;
      } else {
        this.rootPage = IntroPage;
        localStorage.setItem('tutorial_shown', 'true');
      }

      StatusBar.styleDefault();
      Splashscreen.hide();
    });

  }

}

