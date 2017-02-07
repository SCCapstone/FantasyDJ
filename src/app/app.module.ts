import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { FantasyDjApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LeaguePage } from '../pages/league/league';
import { PlayerDetailsPage } from '../pages/player-details/player-details';
import { OpponentDetailsPage } from '../pages/opponent-details/opponent-details';
import { CreateLeaguePage } from '../pages/create-league/create-league';
import { SearchPage } from '../pages/search/search';
import { AnalyticsPage } from '../pages/analytics/analytics';

import { AngularFireModule } from 'angularfire2';

import { OAuthService } from '../providers/oauth-service';
import { SpotifyProvider } from '../providers/spotify-provider';
import { UserData } from '../providers/user-provider';
import { LeagueData } from '../providers/league-provider';
import { SongData } from '../providers/song-provider';

export const firebaseConfig = {
  apiKey: "AIzaSyB9Zq_1L_j0AR3aiMphTPUbDqVAWxe9yiE",
  authDomain: "fantasydj-cb3b4.firebaseapp.com",
  databaseURL: "https://fantasydj-cb3b4.firebaseio.com",
  storageBucket: "fantasydj-cb3b4.appspot.com",
  messagingSenderId: "385737243579"};

@NgModule({
  declarations: [
    FantasyDjApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LeaguePage,
    PlayerDetailsPage,
    OpponentDetailsPage,
    CreateLeaguePage,
    SearchPage,
    AnalyticsPage
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
    OpponentDetailsPage,
    CreateLeaguePage,
    SearchPage,
    AnalyticsPage
  ],
  providers: [
    OAuthService,
    SpotifyProvider,
    UserData,
    LeagueData,
    SongData
  ]
})
export class AppModule {}
