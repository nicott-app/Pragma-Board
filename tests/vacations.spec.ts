import { test, expect } from "./setup";

test.describe("Vacaciones", () => {
  test("Deberia abrir el panel de vacaciones", async ({ page }) => {
    await page.locator('button[title="Calendario de Ausencias"]').click().catch(() => {});
    await expect(page.locator("text=Ausencias y Vacaciones").first()).toBeVisible({ timeout: 5000 });
    await page.locator(".modal-close").click();
  });
});
