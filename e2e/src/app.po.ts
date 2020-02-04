import { browser, by, element, ExpectedConditions, until, ProtractorBrowser, WebElement } from 'protractor';

export class AppPage {
  navigateTo(url) {
    return browser.get(url);
  }

  async getPageTitle(browser : ProtractorBrowser) {
    return (await browser.driver.findElement(by.css('ion-title#pet-sitter-title'))).getText()
  }
  waitForError() {
    return browser.wait(
      until.elementLocated(by.css('ion-toast') as any),
      10000
    );
  }
  async getErrorMessage( browser : ProtractorBrowser ) {
    const element = await browser.driver.findElement( by.css('ion-toast') );

    const root = await browser.driver.executeScript<WebElement>("return arguments[0].shadowRoot", element );

    return (await root.findElement( by.css('.toast-message') )).getText();
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
