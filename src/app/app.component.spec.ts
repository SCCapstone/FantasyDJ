import { FantasyDjApp } from './app.component';
import { PlatformMock } from '../mocks';

let instance: FantasyDjApp = null;

describe('FantasyDjApp', () => {
  beforeEach(() => {
    instance = new FantasyDjApp((<any> new PlatformMock))
  });

  it ('initalizes with a root page', () => {
    expect(instance.rootPage).not.toBeNull();
  });

});

