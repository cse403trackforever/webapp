import { HomePage } from './app.po';

describe('trackforever-web Home Page', () => {
  let page: HomePage;

  beforeEach(() => {
    page = new HomePage();
  });

  it('should display a heading', () => {
    page.navigateTo();
    expect(page.getHeading()).toEqual('My Projects');
  });
});
