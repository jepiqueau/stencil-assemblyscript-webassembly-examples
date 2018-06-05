import { TestWindow } from '@stencil/core/testing';
import { AppGameoflife } from './app-gameoflife';

describe('app-gameoflife', () => {
  it('should build', () => {
    expect(new AppGameoflife()).toBeTruthy();
  });

  describe('rendering', () => {
    let element: HTMLAppUniverseElement;
    let testWindow: TestWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [AppGameoflife],
        html: '<app-gameoflife></app-gameoflife>'
      });
    });

  });
});
