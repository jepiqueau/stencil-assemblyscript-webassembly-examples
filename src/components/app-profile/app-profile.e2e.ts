import { newE2EPage } from '@stencil/core/testing';

describe('app-profile', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<app-profile></app-profile>');

    const element = await page.find('app-profile');
    expect(element).toHaveClass('hydrated');
  });

  it('displays the specified name', async () => {
    const page = await newE2EPage({ url: '/profile/Joseph' });

    const profileElement = await page.find('app-root >>> app-profile');
    const element = profileElement.shadowRoot.querySelector('div');
    expect(element.textContent).toContain('Hello! My name is Joseph. My name was passed in through a route param!');
  });

});
