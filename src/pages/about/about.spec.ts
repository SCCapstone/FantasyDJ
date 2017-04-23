import { async, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from 'ionic-angular';
import { FantasyDjApp } from '../../app/app.component';
import { AboutPage } from './about';

describe('FantasyDjApp Component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FantasyDjApp,
        AboutPage
      ],
      imports: [
        IonicModule.forRoot(FantasyDjApp),
      ],
      providers: [
        NavController
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutPage);
    component = fixture.componentInstance;
  });

  it ('should be created', () => {
    expect(component instanceof AboutPage).toBe(true);
  });

});
