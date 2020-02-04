import { AppPage } from './app.po';

describe('new App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo('/login');
    page.enterInputText('#email-input', 'tudofinal@gmail.com');
    page.enterInputText('#password-input', 'sofia1997');
    page.clickButton('#login-button');
    page.waitUntilVisible('#pet_sitter')
    expect(page.getPageTitle('#pet-sitter-title')).toBe('Olá!');
  });
});
