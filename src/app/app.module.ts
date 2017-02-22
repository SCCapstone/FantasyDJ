import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { FantasyDjApp } from './app.component';
import { ChartsModule } from "ng2-charts/ng2-charts";

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

import { IonicCloud } from '../providers/ionic-cloud-provider';
import { OAuthService } from '../providers/oauth-service';
import { SpotifyProvider } from '../providers/spotify-provider';
import { UserData } from '../providers/user-provider';
import { LeagueData } from '../providers/league-provider';
import { SongData } from '../providers/song-provider';

import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

const cloudSettings: CloudSettings = {
  'core': {
     'app_id': '1001d482'
  },
  'push': {
    'sender_id': '385737243579',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#343434'
      }
    }
  }
};

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
    CloudModule.forRoot(cloudSettings),
    AngularFireModule.initializeApp(firebaseConfig),
    ChartsModule
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
    IonicCloud,
    UserData,
    LeagueData,
    SongData
  ]
})
export class AppModule {}
