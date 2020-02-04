import { AppPage } from './app.po';
import { browser } from 'protractor';

describe('new App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  /*it('should display welcome message', () => {
    page.navigateTo('/login');
    browser.driver.sleep(7000);
    page.enterInputText('#email-input', 'tudofinal@gmail.com');
    page.enterInputText('#password-input', 'sofia1997');
    page.clickButton('#login-button');
    browser.driver.sleep(2000);
    expect(page.getPageTitle('#pet-sitter-title')).toEqual('Olá!');
  });*/
  it('displays an error message if the login fails', () => {
    page.navigateTo('/login');
    browser.driver.sleep(7000);
    page.enterInputText('#email-input', 'tudofinal');
    page.enterInputText('#password-input', 'sofia1997');
    page.clickButton('#login-button');
    page.waitForError();
    browser.driver.sleep(500);
    console.log(page.getErrorMessage());
    browser.driver.sleep(500);
    expect(page.getErrorMessage()).toEqual(
      'Error: Invalid E-mail!'
    );
  });
});
