import { browser, by, element } from 'protractor';

export class HomePage {
  navigateTo() {
    return browser.get('/home');
  }

  getHeading() {
    return element(by.css('app-home-page h1')).getText();
  }
}
