import { browser, by, element, ExpectedConditions } from 'protractor';

export class AppPage {
  navigateTo(url) {
    return browser.get(url);
  }

  getPageTitle(sel: string) {
    console.log(sel)
    return element(by.css(`${sel} ion-title`)).getText();
  }
  waitForError() {
    browser.wait(
      ExpectedConditions.presenceOf(element(by.css('.toast-message'))),
      3000
    );
  }
  getErrorMessage() {
    return element(by.css('.error')).getText();
  }

  enterInputText(sel: string, text: string) {
    const el = element(by.css(`${sel}`));
    const inp = el.element(by.css('input'));
    inp.sendKeys(text);
  }

  clickButton(sel: string) {
    const el = element(by.css(`${sel}`));
    browser.wait(ExpectedConditions.elementToBeClickable(el));
    el.click();
  }

  waitUntilVisible(sel: string) {
    const el = element(by.css(`${sel}`));
    browser.wait(ExpectedConditions.visibilityOf(el), 20000);
  }
}
