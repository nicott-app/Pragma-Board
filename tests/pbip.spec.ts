import { test, expect } from "./setup";

test.describe("Documentador PBIP", () => {
  test("Deberia abrir el modal y mostrar zona drag and drop", async ({ page }) => {
    await page.locator('button[title="Estimador PowerBI"]').click().catch(() => {});
    await page.locator('button:has-text("Documentar desde .pbip")').click().catch(() => {});
    
    await expect(page.locator("text=Documentador de Informes")).toBeVisible();
    await expect(page.locator("text=Arrastra aqui tu proyecto .pbip")).toBeVisible();
    await expect(page.locator("text=Generar documentacion")).not.toBeVisible(); // Solo visible tras parsear
    
    await page.locator(".modal-close").click();
  });
});
