import { HomePage } from './app.po';

describe('trackforever-web Home Page', () => {
  let page: HomePage;

  beforeEach(() => {
    page = new HomePage();
    console.log(page.getHeading());
  });
});
