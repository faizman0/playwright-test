// pages/LoginPage.js

import { expect } from '@playwright/test';

export class LoginPage {
    
    // Inisiasi: Page Object harus menerima objek 'page' Playwright
    constructor(page) {
        this.page = page;
        
        // --- Selectors ---d
        this.usernameInputSelector = 'input[name="username"]';
        this.passwordInputSelector = 'input[name="password"]';
        this.loginButtonSelector = 'button[type="submit"]';
        this.errorMessageSelector = '.alert.alert-danger'; 
        this.forgotPasswordLinkSelector = 'a[href*="/password/reset"]';
        this.dashboardElementSelector = 'nav.main-header'; // Selector untuk elemen yang hanya ada di Dashboard
        this.logoutButtonSelector = 'a[href*="/logout"]';
    }

    // --- METODE INTERAKSI (ASYNC) ---

    async usernameInput(username) {
        // Menggunakan .fill() untuk input teks
        await this.page.locator(this.usernameInputSelector).fill(username);
    }

    async passwordInput(password) {
        await this.page.locator(this.passwordInputSelector).fill(password);
    }

    async loginButton() {
        await this.page.locator(this.loginButtonSelector).click();
    }

    async forgotPasswordLink() {
        await this.page.locator(this.forgotPasswordLinkSelector).click();
    }
    
    async logout() {
        // Lakukan klik logout
        await this.page.locator(this.logoutButtonSelector).click();
    }

    // --- METODE VERIFIKASI (ASYNC) ---

    async verifyLoginSuccess() {
        // Verifikasi: URL menuju dashboard, dan elemen dashboard terlihat
        await expect(this.page).toHaveURL(/dashboard/);
        await expect(this.page.locator(this.dashboardElementSelector)).toBeVisible();
    }

    async verifyLoginError() {
        // Verifikasi: Pesan error muncul dan terlihat
        const errorMessage = this.page.locator(this.errorMessageSelector);
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toContainText('Kredensial ini tidak cocok'); 
    }
    
    async verifyRequiredMessage() {
        // Verifikasi: Tidak terjadi navigasi, dan URL masih di /login
        await expect(this.page).toHaveURL(/login/);

        // Tambahan: Playwright bisa memeriksa pesan error validasi HTML5
        // Misalnya, memeriksa apakah input memiliki properti required
        // const usernameInput = this.page.locator(this.usernameInputSelector);
        // await expect(usernameInput).toBeRequired(); 
    }
}