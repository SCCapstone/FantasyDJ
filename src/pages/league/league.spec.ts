import { ComponentFixture, async } from '@angular/core/testing';
import { NavParams } from 'ionic-angular';
import { TestUtils } from '../../test';
import { LeaguePage } from './league';
import { User, League } from '../../models/fantasydj-models';

let fixture: ComponentFixture<LeaguePage> = null;
let instance: any = null;

let navParamsData: any = {
  currentUser: <User>{
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
describe('League Page', () => {

  beforeEach(async(() => TestUtils.beforeEachCompiler(
    [LeaguePage],
    [{provide: NavParams, useClass: NavParamsMock}]
  ).then(compiled => {
    fixture = compiled.fixture;
    instance = compiled.instance;
  })));

  afterEach(() => {
    fixture.destroy();
  });

  it('initializes', () => {
    expect(instance instanceof LeaguePage).toBe(true);
  });
});
