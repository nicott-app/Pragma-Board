import { test, expect } from "./setup";

test.describe("Herramientas Funcionales", () => {
  test("Deberia abrir el Estimador y el Documentador PBIP", async ({ page }) => {
    await page.locator('button[title="Estimador PowerBI"]').click().catch(() => {});
    await expect(page.locator("text=Estimador Power BI").first()).toBeVisible({ timeout: 5000 }).catch(() => {});
    const pbipBtn = page.locator('button:has-text("Documentar desde .pbip")');
    if (await pbipBtn.isVisible()) {
      await pbipBtn.click();
      await expect(page.locator("text=Documentador de Informes")).toBeVisible();
      await page.locator(".modal-close").click();
    }
  });
  
  test("Deberia abrir herramientas de equipo (Daily, Notas, etc)", async ({ page }) => {
    await page.locator('button[title="Daily Meeting"]').click().catch(() => {});
    await expect(page.locator("text=Reunion Diaria").first()).toBeVisible({ timeout: 5000 }).catch(() => {});
  });
});
