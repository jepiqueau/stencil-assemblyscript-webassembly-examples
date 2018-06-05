import { TestWindow } from '@stencil/core/testing';
import { AppAdd } from './app-add';

describe('app-add', () => {
  it('should build', () => {
    expect(new AppAdd()).toBeTruthy();
  });

  describe('rendering', () => {
    let element: HTMLAppAddElement;
    let testWindow: TestWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [AppAdd],
        html: '<app-add></app-add>'
      });
    });

  });
});
