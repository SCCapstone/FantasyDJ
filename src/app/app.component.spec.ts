import { async, TestBed } from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';
import { FantasyDjApp } from './app.component';

describe('FantasyDjApp Component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FantasyDjApp],
      imports: [
        IonicModule.forRoot(FantasyDjApp)
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FantasyDjApp);
    component = fixture.componentInstance;
  });

  it ('should be created', () => {
    expect(component instanceof FantasyDjApp).toBe(true);
  });

  it ('should have rootPage', () => {
    expect((<FantasyDjApp>component).rootPage).toBeTruthy();
  });

});
