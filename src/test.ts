import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { getTestBed, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { App, Config, Form, IonicModule, Keyboard, AlertController, DeepLinker, DomController, GestureController, MenuController, NavController, Platform } from 'ionic-angular';
import { ConfigMock, PlatformMock } from './mocks';

import { IonicCloud } from './providers/ionic-cloud-provider';
import { IonicCloudMock } from './providers/ionic-cloud-provider.mock';
import { LeagueData } from './providers/league-provider';
import { LeagueDataMock } from './providers/league-provider.mock';
import { MatchRequestData } from './providers/matchrequest-provider';
import { MatchRequestDataMock } from './providers/matchrequest-provider.mock';
import { PopularData } from './providers/popular-provider';
import { PopularDataMock } from './providers/popular-provider.mock';
import { SongData } from './providers/song-provider';
import { SongDataMock } from './providers/song-provider.mock';
import { SpotifyProvider } from './providers/spotify-provider';
import { SpotifyProviderMock } from './providers/spotify-provider.mock';
import { UserData } from './providers/user-provider';
import { UserDataMock } from './providers/user-provider.mock';

export class TestUtils {

  public static beforeEachCompiler(components: Array<any>, providers?: Array<any>): Promise<{fixture: any, instance: any}> {
    return TestUtils.configureIonicTestingModule(components, providers)
      .compileComponents().then(() => {
        let fixture: any = TestBed.createComponent(components[0]);
        return {
          fixture: fixture,
          instance: fixture.debugElement.componentInstance,
        };
      });
  }

  public static configureIonicTestingModule(components: Array<any>, providers?: Array<any>): typeof TestBed {
    let provs = [
      App, Form, Keyboard, AlertController, DomController, GestureController, MenuController, NavController,
      {provide: Platform, useClass: PlatformMock},
      {provide: Config, useClass: ConfigMock},
      {provide: IonicCloud, useClass: IonicCloudMock},
      {provide: LeagueData, useClass: LeagueDataMock},
      {provide: MatchRequestData, useClass: MatchRequestDataMock},
      {provide: PopularData, useClass: PopularDataMock},
      {provide: SongData, useClass: SongDataMock},
      {provide: SpotifyProvider, useClass: SpotifyProviderMock},
      {provide: UserData, useClass: UserDataMock}
    ];
    if (providers) {
      provs = provs.concat(providers);
    }
    return TestBed.configureTestingModule({
      declarations: [
        ...components,
      ],
      imports: [
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        ChartsModule
      ],
      providers: provs,
    });
  }

  // http://stackoverflow.com/questions/2705583/how-to-simulate-a-click-with-javascript
  public static eventFire(el: any, etype: string): void {
    if (el.fireEvent) {
      el.fireEvent('on' + etype);
    } else {
      let evObj: any = document.createEvent('Events');
      evObj.initEvent(etype, true, false);
      el.dispatchEvent(evObj);
    }
  }
}
