import { ComponentFixture, async } from '@angular/core/testing';
import { NavParams } from 'ionic-angular';
import { NavParamsMock } from '../../mocks';
import { TestUtils } from '../../test';
import { ProfilePage } from './profile';

let fixture: ComponentFixture<ProfilePage> = null;
let instance: any = null;

describe('Profile Page', () => {

  beforeEach(async(() => TestUtils.beforeEachCompiler(
    [ProfilePage],
    [{provide: NavParams, useClass: NavParamsMock}]
  ).then(compiled => {
    fixture = compiled.fixture;
    instance = compiled.instance;
  })));

  afterEach(() => {
    fixture.destroy();
  });

  it('initializes', () => {
    expect(instance instanceof ProfilePage).toBe(true);
  });
});
