import { AppPage } from './app.po';
import { browser } from 'protractor';

describe('new App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  /*it('should display welcome message', async () => {
    page.navigateTo('/login');
    browser.driver.sleep(7000);
    page.enterInputText('#email-input', 'tudofinal@gmail.com');
    page.enterInputText('#password-input', 'sofia1997');
    page.clickButton('#login-button');
    browser.driver.sleep(5000);
    expect(await page.getPageTitle(browser)).toEqual('Olá!');
  });*/
  
  it('displays an error message if the login fails', async () => {
    page.navigateTo('/login');
    browser.driver.sleep(7000);
    page.enterInputText('#email-input', 'tudofinal');
    page.enterInputText('#password-input', 'sofia1997');
    page.clickButton('#login-button');
    await page.waitForError();
    browser.driver.sleep(1000);
    expect(await page.getErrorMessage(browser)).toEqual(
      'E-mail Inválido!'
    );
  });

  it('displays an error message if the field is missing', async () => {
    page.navigateTo('/login');
    browser.driver.sleep(7000);
    page.enterInputText('#email-input', 'tudofinal');
    page.enterInputText('#password-input', '');
    page.clickButton('#login-button');
    await page.waitForError();
    browser.driver.sleep(500);
    expect(await page.getErrorMessage(browser)).toEqual(
      'É necessário preencher os campos!'
    );
  });

  it('displays an error message if the pass of login is wrong', async () => {
    page.navigateTo('/login');
    browser.driver.sleep(7000);
    page.enterInputText('#email-input', 'tudofinal@gmail.com');
    page.enterInputText('#password-input', 'frtg');
    page.clickButton('#login-button');
    await page.waitForError();
    browser.driver.sleep(500);
    expect(await page.getErrorMessage(browser)).toEqual(
      'Password Errada'
    );
  });

  it('displays an error message if the user doesnt exit', async () => {
    page.navigateTo('/login');
    browser.driver.sleep(7000);
    page.enterInputText('#email-input', 'tud@gmail.com');
    page.enterInputText('#password-input', 'sofia1997');
    page.clickButton('#login-button');
    await page.waitForError();
    browser.driver.sleep(1000);
    expect(await page.getErrorMessage(browser)).toEqual(
      'Não há nenhum utilizador que corresponda ao inserido. Pode ter sido apagado.'
    );
  });

  it('should display error message if email is already in use on Register', async () => {
    page.navigateTo('/login');
    page.clickButton('#Registar');
    browser.driver.sleep(4000);
    page.enterInputText('#email-input1', 'tudofinal@gmail.com');
    page.enterInputText('#password-input2', 'sofia1997');
    page.enterInputText('#confirmpassword-input', 'sofia1997');
    page.clickButton('#Next');
    page.enterInputText('#nameuser', 'sofia');
    page.clickButton('#register-button');
    browser.driver.sleep(4000);
    expect(await page.getErrorMessage(browser)).toEqual(
      'E-mail já em uso!'
    );
  });

  it('should display error message if email is invalid on Register', async () => {
    page.navigateTo('/login');
    page.clickButton('#Registar');
    browser.driver.sleep(7000);
    page.enterInputText('#email-input1', 'tudofinal');
    page.enterInputText('#password-input2', 'sofia1997');
    page.enterInputText('#confirmpassword-input', 'sofia1997');
    page.clickButton('#Next');
    page.enterInputText('#nameuser', 'sofia');
    page.clickButton('#register-button');
    browser.driver.sleep(1000);
    expect(await page.getErrorMessage(browser)).toEqual(
      'E-mail Inválido!'
    );
  });



});
