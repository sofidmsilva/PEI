import { browser, by, element, ExpectedConditions } from 'protractor';

export class AppPage {
  navigateTo(url) {
    return browser.get(url);
  }

  getPageTitle(sel: string) {
    return element(by.css(`${sel}`)).getText();
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
    browser.wait(ExpectedConditions.visibilityOf(el), 3000);
  }
}
