import { test as base } from "@playwright/test";

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.goto("http://localhost:5173");
    await page.waitForLoadState("networkidle");
    // Intentar Login E2E si aparece el modal
    const isLoginVisible = await page.locator('#auth-modal').isVisible({ timeout: 3000 }).catch(() => false);
    
    if (isLoginVisible) {
      const email = process.env.TEST_EMAIL || '';
      const password = process.env.TEST_PASSWORD || '';
      
      if (!email || !password) {
        console.error('⚠️ ATENCIÓN: Debes configurar TEST_EMAIL y TEST_PASSWORD en tu entorno para que los tests puedan iniciar sesión.');
      } else {
        const loginToggle = page.locator('button:has-text("¿Ya tienes cuenta?")');
        if (await loginToggle.isVisible().catch(() => false)) {
          await loginToggle.click();
        }

        await page.fill('#auth-email', email);
        await page.fill('#auth-password', password);
        await page.click('button[type="submit"]');

        await page.locator('#auth-modal').waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
      }
    }

    await page.waitForSelector("#topbar", { state: "visible", timeout: 15000 }).catch(() => {});
    await use(page);
  }
});
export { expect } from "@playwright/test";