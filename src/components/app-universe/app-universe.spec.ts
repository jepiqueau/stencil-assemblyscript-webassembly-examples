import { TestWindow } from '@stencil/core/testing';
import { AppUniverse } from './app-universe';

describe('app-app-universe', () => {
  it('should build', () => {
    expect(new AppUniverse()).toBeTruthy();
  });

  describe('rendering', () => {
    let element: HTMLAppUniverseElement;
    let testWindow: TestWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [AppUniverse],
        html: '<app-universe></app-universe>'
      });
    });

  });
});
