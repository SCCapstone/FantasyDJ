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
  apiKey: "AIzaSyC4Xau60ozT0UheZIqPGPw5aJCvprWk_lw",
  authDomain: "expenses-test-3b15f.firebaseapp.com",
  databaseURL: "https://expenses-test-3b15f.firebaseio.com",
  storageBucket: "expenses-test-3b15f.appspot.com",
  messagingSenderId: "636757877321"
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
