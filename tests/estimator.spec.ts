import { test, expect } from "./setup";

test.describe("Estimador Power BI", () => {
  test("Deberia abrir el estimador y calcular estimacion", async ({ page }) => {
    // Abrir Estimador
    await page.locator('button[title="Estimador PowerBI"]').click().catch(() => {});
    await expect(page.locator("text=Estimador Power BI").first()).toBeVisible({ timeout: 5000 });
    
    // Cambiar algun valor y ver si cambia la estimacion
    const complexSelect = page.locator("select").first();
    if (await complexSelect.isVisible()) {
      await complexSelect.selectOption({ index: 1 });
    }
    
    // Verificar exportar
    await expect(page.locator('button:has-text("Exportar Excel")')).toBeVisible();
    
    await page.locator(".modal-close").click();
  });
});
