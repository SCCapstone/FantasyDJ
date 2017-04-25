import { ComponentFixture, async } from '@angular/core/testing';
import { NavParams } from 'ionic-angular';
import { NavParamsMock } from '../../mocks';
import { TestUtils } from '../../test';
import { CreateLeaguePage } from './create-league';

let fixture: ComponentFixture<CreateLeaguePage> = null;
let instance: any = null;

describe('Create League Page', () => {

  beforeEach(async(() => TestUtils.beforeEachCompiler(
    [CreateLeaguePage],
    [{provide: NavParams, useClass: NavParamsMock}]
  ).then(compiled => {
    fixture = compiled.fixture;
    instance = compiled.instance;
  })));

  afterEach(() => {
    fixture.destroy();
  });

  it('initializes', () => {
    expect(instance instanceof CreateLeaguePage).toBe(true);
  });
});
