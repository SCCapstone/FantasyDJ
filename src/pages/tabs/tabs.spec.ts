import { TabsPage } from './tabs';
import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { ProfilePage } from '../profile/profile';
import { SpotifyProviderMock } from '../../providers/spotify-provider.mock';

let instance: TabsPage = null;

describe('Tabs Page', () => {

  beforeEach(() => {
    instance = new TabsPage((<any> new SpotifyProviderMock));
  });


  it('initializes with three tabs', () => {
    expect(instance.tab1Root).toBeTruthy();
    expect(instance.tab2Root).toBeTruthy();
    expect(instance.tab3Root).toBeTruthy();
  });
});
