import { ComponentFixture, async } from '@angular/core/testing';
import { NavParams } from 'ionic-angular';
import { TestUtils } from '../../test';
import { AnalyticsPage } from './analytics';
import { User, League } from '../../models/fantasydj-models';

let fixture: ComponentFixture<AnalyticsPage> = null;
let instance: any = null;

let navParamsData: any = {
  user: <User>{
    id: '-Kuser',
    dateCreated: new Date(),
    email: 'a@b.c'
  },
  league: <League>{
    id: '-Kleague'
  },
  opponent: <User>{
    id: '-Kopponent',
    dateCreated: new Date(),
    email: 'a@b.c'
  }
}

class NavParamsMock {

  public get(parameter: string): any {
    return navParamsData[parameter];
  }

}

describe('Analytics Page', () => {

  beforeEach(async(() => TestUtils.beforeEachCompiler(
    [AnalyticsPage],
    [{provide: NavParams, useClass: NavParamsMock}]
  ).then(compiled => {
    fixture = compiled.fixture;
    instance = compiled.instance;
  })));

  afterEach(() => {
    fixture.destroy();
  });

  it('initializes', () => {

    expect(instance instanceof AnalyticsPage).toBe(true);
  });
});
