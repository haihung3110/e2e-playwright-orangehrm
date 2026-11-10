import type { Page } from '@playwright/test';

/** Locators belonging exclusively to the OrangeHRM login screen. */
export class LoginElements {
  readonly usernameInput;
  readonly passwordInput;
  readonly loginButton;
  readonly invalidCredentialsAlert;

  constructor(page: Page) {
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.invalidCredentialsAlert = page.getByText('Invalid credentials');
  }
}
