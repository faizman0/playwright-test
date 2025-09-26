import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage'; // Lokasi Page Object di folder 'pages'
import loginData from '../data/loginData.json'; // Lokasi data di folder 'data'

// Definisikan baseURL di playwright.config.js atau di sini:
const BASE_URL = 'http://127.0.0.1:8000/login';

test.describe('Login Test Suite (Playwright)', () => {
    let loginPage;

    // Menjalankan inisiasi sebelum setiap tes
    test.beforeEach(async ({ page }) => {
        // Inisiasi Page Object dengan passing fixture 'page'
        loginPage = new LoginPage(page);
        
        // Mengunjungi halaman login
        await page.goto(BASE_URL);
    });

    test('TC_001 - Login dengan username dan password benar', async ({ page }) => {
        await loginPage.usernameInput(loginData.validUser);
        await loginPage.passwordInput(loginData.validPass);
        await loginPage.loginButton();

        // Verifikasi berhasil login dengan mengecek URL Dashboard
        await loginPage.verifyLoginSuccess();
    });

    test('TC_002 - Login dengan username tidak terdaftar', async ({ page }) => {
        await loginPage.usernameInput(loginData.invalidUser);
        await loginPage.passwordInput(loginData.validPass);
        await loginPage.loginButton();

        // Verifikasi munculnya pesan error
        await loginPage.verifyLoginError();
    });
    
    test('TC_003 - Login dengan password salah', async ({ page }) => {
        await loginPage.usernameInput(loginData.validUser);
        await loginPage.passwordInput(loginData.invalidPass);
        await loginPage.loginButton();

        // Verifikasi munculnya pesan error
        await loginPage.verifyLoginError();
    });

    test('TC_004 - Login dengan username dan password kosong', async ({ page }) => {
        // Langsung klik tombol login
        await loginPage.loginButton();

        // Playwright memeriksa validasi klien atau pesan error
        await loginPage.verifyRequiredMessage();
    });

    test('TC_005 - Login dengan tombol enter', async ({ page }) => {
        await loginPage.usernameInput(loginData.validUser);
        
        // Menggunakan press('Enter') pada input password
        await page.locator(loginPage.passwordInputSelector).fill(loginData.validPass);
        await page.locator(loginPage.passwordInputSelector).press('Enter');

        await loginPage.verifyLoginSuccess();
    });

    test('TC_006 - Menggunakan fitur lupa password', async ({ page }) => {
        await loginPage.forgotPasswordLink();

        // Verifikasi URL berubah
        await expect(page).toHaveURL(/password\/reset/);
    });

    test('TC_007 - Logout', async ({ page }) => {
        // 1. Login terlebih dahulu
        await loginPage.usernameInput(loginData.validUser);
        await loginPage.passwordInput(loginData.validPass);
        await loginPage.loginButton();
        await loginPage.verifyLoginSuccess(); // Verifikasi login sukses

        // 2. Lakukan Logout
        await loginPage.logout();

        // Verifikasi berhasil kembali ke halaman login
        await expect(page).toHaveURL(/login/);
    });
});