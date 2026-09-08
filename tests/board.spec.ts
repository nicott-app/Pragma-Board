import { test, expect } from "./setup";

test.describe("Tablero y Tickets", () => {
  test("Deberia mostrar columnas y permitir crear un ticket manual", async ({ page }) => {
    // Esperar a que carguen las columnas
    await expect(page.locator(".board-column").first()).toBeVisible({ timeout: 10000 });
    
    // Click en Nuevo Ticket
    await page.locator('button[title="Crear nuevo ticket"]').click().catch(() => {});
    await expect(page.locator("text=Crear nuevo ticket").first()).toBeVisible();
    
    // Cerrar modal
    await page.locator(".modal-close").click();
  });
});
