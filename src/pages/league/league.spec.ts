import { ComponentFixture, async } from '@angular/core/testing';
import { TestUtils } from '../../test';
import { LeaguePage } from './league';

let fixture: ComponentFixture<LeaguePage> = null;
let instance: any = null;

describe('League Page', () => {

  beforeEach(async(() => TestUtils.beforeEachCompiler([LeaguePage]).then(compiled => {
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
