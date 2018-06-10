import { TestWindow } from '@stencil/core/testing';
import { AppIntOperators } from './app-int-operators';

describe('app-int-operators', () => {
  it('should build', () => {
    expect(new AppIntOperators()).toBeTruthy();
  });

  describe('rendering', () => {
    let element: HTMLAppIntOperatorsElement;
    let testWindow: TestWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [AppIntOperators],
        html: '<app-int-operators></app-int-operators>'
      });
    });

  });
});
