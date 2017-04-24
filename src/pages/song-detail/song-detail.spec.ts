import { ComponentFixture, async } from '@angular/core/testing';
import { NavParams } from 'ionic-angular';
import { TestUtils } from '../../test';
import { SongDetailPage } from './song-detail';
import { User, League, Song } from '../../models/fantasydj-models';

let fixture: ComponentFixture<SongDetailPage> = null;
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
  song: <Song>{
    id: '-Ksong'
  }
}

class NavParamsMock {

  public get(parameter: string): any {
    return navParamsData[parameter];
  }

}
describe('Song Detail Page', () => {

  beforeEach(async(() => TestUtils.beforeEachCompiler(
    [SongDetailPage],
    [{provide: NavParams, useClass: NavParamsMock}]
  ).then(compiled => {
    fixture = compiled.fixture;
    instance = compiled.instance;
  })));

  afterEach(() => {
    fixture.destroy();
  });

  it('initializes', () => {
    expect(instance instanceof SongDetailPage).toBe(true);
  });
});
