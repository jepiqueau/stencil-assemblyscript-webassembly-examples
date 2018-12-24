import { newE2EPage } from '@stencil/core/testing';

describe('app-home', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<app-home></app-home>');

    const element = await page.find('app-home');
    expect(element).toHaveClass('hydrated');
  });

  it('contains a "Profile Page" button', async () => {
    const page = await newE2EPage();
    await page.setContent('<app-home></app-home>');

    const element = await page.find('app-home >>> #profile-button');
    expect(element.textContent).toEqual('Profile page');
  });

  it('contains a "Add Numbers" button', async () => {
    const page = await newE2EPage();
    await page.setContent('<app-home></app-home>');

    const element = await page.find('app-home >>> #add-numbers-button');
    expect(element.textContent).toEqual('Add Numbers');
  });
  it('contains a "Int Operators" button', async () => {
    const page = await newE2EPage();
    await page.setContent('<app-home></app-home>');

    const element = await page.find('app-home >>> #int-operators-button');
    expect(element.textContent).toEqual('Int Operators');
  });
  it('contains a "Draw Universe" button', async () => {
    const page = await newE2EPage();
    await page.setContent('<app-home></app-home>');

    const element = await page.find('app-home >>> #draw-universe-button');
    expect(element.textContent).toEqual('Draw Universe');
  });
  it('contains a "Play Game of Life" button', async () => {
    const page = await newE2EPage();
    await page.setContent('<app-home></app-home>');

    const element = await page.find('app-home >>> #gameoflife-button');
    expect(element.textContent).toEqual('Play Game of Life');
  });
});
