import { expect, type Page } from '@playwright/test';
import { BasePage } from '../../../core/BasePage.js';
import { LoginElements } from '../elements/LoginElements.js';

export class LoginPage extends BasePage {
  readonly elements: LoginElements;

  constructor(page: Page) {
    super(page);
    this.elements = new LoginElements(page);
  }

  async open(): Promise<void> {
    await this.visit('/web/index.php/auth/login');
  }

  async expectForm(): Promise<void> {
    await this.expectVisible(this.elements.usernameInput);
    await this.expectVisible(this.elements.passwordInput);
    await this.expectVisible(this.elements.loginButton);
  }

  async submitCredentials(username: string, password: string): Promise<void> {
    await this.elements.usernameInput.fill(username);
    await this.elements.passwordInput.fill(password);
    await this.elements.loginButton.click();
  }

  async expectInvalidCredentials(): Promise<void> {
    await expect(this.elements.invalidCredentialsAlert).toBeVisible();
  }
}
