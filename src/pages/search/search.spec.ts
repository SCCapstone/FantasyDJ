import { ComponentFixture, async } from '@angular/core/testing';
import { NavParams } from 'ionic-angular';
import { NavParamsMock } from '../../mocks';
import { TestUtils } from '../../test';
import { SearchPage } from './search';

let fixture: ComponentFixture<SearchPage> = null;
let instance: any = null;

describe('Search Page', () => {

  beforeEach(async(() => TestUtils.beforeEachCompiler(
    [SearchPage],
    [{provide: NavParams, useClass: NavParamsMock}]
  ).then(compiled => {
    fixture = compiled.fixture;
    instance = compiled.instance;
  })));

  afterEach(() => {
    fixture.destroy();
  });

  it('initializes', () => {
    expect(instance instanceof SearchPage).toBe(true);
  });
});
