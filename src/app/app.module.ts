import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { FantasyDjApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LeaguePage } from '../pages/league/league';
import { PlayerDetailsPage } from '../pages/player-details/player-details';
import { CreateLeaguePage } from '../pages/create-league/create-league';
import { SearchPage } from '../pages/search/search';

import { AngularFireModule } from 'angularfire2';

export const firebaseConfig = {
  apiKey: "AIzaSyB9Zq_1L_j0AR3aiMphTPUbDqVAWxe9yiE",
  authDomain: "fantasydj-cb3b4.firebaseapp.com",
  databaseURL: "https://fantasydj-cb3b4.firebaseio.com",
  storageBucket: "fantasydj-cb3b4.appspot.com"
};


@NgModule({
  declarations: [
    FantasyDjApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LeaguePage,
    PlayerDetailsPage,
    CreateLeaguePage,
    SearchPage
  ],
  imports: [
    IonicModule.forRoot(FantasyDjApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    FantasyDjApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LeaguePage,
    PlayerDetailsPage,
    CreateLeaguePage,
    SearchPage
  ],
  providers: []
})
export class AppModule {}
