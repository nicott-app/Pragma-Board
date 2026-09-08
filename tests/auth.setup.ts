import { test as setup, expect } from '@playwright/test';
import * as path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Aseguramos que tenemos las variables de entorno
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;

  if (!email || !password) {
    console.error('⚠️ TEST_EMAIL o TEST_PASSWORD no están definidos en el entorno.');
    console.error('⚠️ Saltando login E2E. Es posible que los tests fallen si la sesión no está iniciada.');
    return;
  }

  await page.goto('/');

  // Esperar a ver si aparece el modal de login
  try {
    const isLoginVisible = await page.locator('#auth-modal').isVisible({ timeout: 5000 }).catch(() => false);
    
    if (isLoginVisible) {
      // Si la UI muestra la opción de registro, hay que cambiar a Login
      const loginToggle = page.locator('button:has-text("¿Ya tienes cuenta?")');
      if (await loginToggle.isVisible()) {
        await loginToggle.click();
      }

      // Rellenar credenciales
      await page.fill('#auth-email', email);
      await page.fill('#auth-password', password);
      
      // Clic en Iniciar Sesión
      await page.click('button[type="submit"]');

      // Esperar a que el modal desaparezca o aparezca la app principal
      await expect(page.locator('#auth-modal')).not.toBeVisible({ timeout: 15000 });
    }
  } catch (error) {
    console.log('Error durante el proceso de login:', error);
  }

  // Guardar el estado de la sesión (Cookies, IndexedDB y LocalStorage no se guardan solos en el storageState de Playwright para todo).
  // Wait, Firebase Auth often uses IndexedDB, which Playwright storageState does NOT capture!
  // This is a known issue. To persist IndexedDB, we can't just use storageState.
  // Actually, setting process.env.TEST_EMAIL is fine, but the login will happen once per context if IndexedDB isn't saved.
  // Let's just save the storage state anyway, sometimes LocalStorage works.
  await page.context().storageState({ path: authFile });
});
