import { ComponentFixture, async} from '@angular/core/testing';
import { TestUtils } from '../../test';
import { HomePage } from './home';
import { By } from '@angular/platform-browser/src/dom/debug/by';

let fixture: ComponentFixture<HomePage> = null;
let instance: HomePage = null;

describe('Pages: Home', () => {
  beforeEach(async(() => {
    TestUtils.beforeEachCompiler([HomePage]).then(compiled => {
      fixture = compiled.fixture;
      instance = compiled.instance;
    });
  }));

  it('should create home page', async(() => {
    expect(instance).toBeTruthy();
  }));

  it('should start out logged out', async(() => {
    expect(fixture.componentInstance.currentUser).toBeNull();
  }));

  // it('should log in', async(() => {
  //   fixture.whenStable().then(() => {
  //     fixture.debugElement.query(By.css('#btn-login')).click();
  //     fixture.detectChanges();
  //     fixture.whenStable().then(() => {
  //       expect(instance.currentUser).not.toBeNull();
  //     });
  //   });
  // }));

  // it('should have leagues', async(() => {
  //   instance.login();
  //   fixture.detectChanges();
  //   fixture.whenStable().then(() => {
  //     instance.leagues.subscribe(leagues => {
  //       expect(leagues.length).toEqual(3);
  //     });
  //   });
  // }));

});
