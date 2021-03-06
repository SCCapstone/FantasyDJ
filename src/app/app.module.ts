import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { AngularFireModule } from 'angularfire2';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { FantasyDjApp } from './app.component';

import { IntroPage } from '../pages/intro/intro';
import { AboutPage } from '../pages/about/about';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LeaguePage } from '../pages/league/league';
import { CreateLeaguePage } from '../pages/create-league/create-league';
import { SearchPage } from '../pages/search/search';
import { AnalyticsPage } from '../pages/analytics/analytics';
import { ProfilePage } from '../pages/profile/profile';
import { SongDetailPage } from "../pages/song-detail/song-detail";

import { IonicCloud } from '../providers/ionic-cloud-provider';
import { SpotifyProvider } from '../providers/spotify-provider';
import { UserData } from '../providers/user-provider';
import { LeagueData } from '../providers/league-provider';
import { SongData } from '../providers/song-provider';
import { SongStatData } from '../providers/songstat-provider';
import { PopularData } from '../providers/popular-provider';
import { MatchRequestData } from '../providers/matchrequest-provider';

export const cloudSettings: CloudSettings = {
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
    HomePage,
    TabsPage,
    IntroPage,
    LeaguePage,
    CreateLeaguePage,
    SearchPage,
    SongDetailPage,
    AnalyticsPage,
    ProfilePage
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
    HomePage,
    TabsPage,
    IntroPage,
    LeaguePage,
    CreateLeaguePage,
    SearchPage,
    SongDetailPage,
    AnalyticsPage,
    ProfilePage
  ],
  providers: [
    SpotifyProvider,
    IonicCloud,
    UserData,
    LeagueData,
    SongData,
    SongStatData,
    PopularData,
    MatchRequestData
  ]
})
export class AppModule {}
