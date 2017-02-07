import { ComponentFixture, async } from '@angular/core/testing';
import { TestUtils } from '../../test'
import { AboutPage } from './about'

let fixture: ComponentFixture<AboutPage> = null;
let instance: any = null;

describe('Pages: About', () => {
  beforeEach(async(() =>
    TestUtils.beforeEachCompiler([AboutPage]).then(compiled => {
      fixture = compiled.fixture;
      instance = compiled.instance;
    })));

    it('should create about page', async(() => {
      expect(instance).toBeTruthy();
    }));
});
