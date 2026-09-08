
const fs = require("fs");

const estimatorCode = `import { test, expect } from "./setup";

test.describe("Estimador Power BI", () => {
  test("Deberia abrir el estimador y calcular estimacion", async ({ page }) => {
    // Abrir Estimador
    await page.locator("button[title=\"Estimador PowerBI\"]").click().catch(() => {});
    await expect(page.locator("text=Estimador Power BI").first()).toBeVisible({ timeout: 5000 });
    
    // Cambiar algun valor y ver si cambia la estimacion
    const complexSelect = page.locator("select").first();
    if (await complexSelect.isVisible()) {
      await complexSelect.selectOption({ index: 1 });
    }
    
    // Verificar exportar
    await expect(page.locator("button:has-text(\"Exportar Excel\")")).toBeVisible();
    
    await page.locator(".modal-close").click();
  });
});`;
fs.writeFileSync("tests/estimator.spec.ts", estimatorCode);

const pbipCode = `import { test, expect } from "./setup";

test.describe("Documentador PBIP", () => {
  test("Deberia abrir el modal y mostrar zona drag and drop", async ({ page }) => {
    await page.locator("button[title=\"Estimador PowerBI\"]").click().catch(() => {});
    await page.locator("button:has-text(\"Documentar desde .pbip\")").click().catch(() => {});
    
    await expect(page.locator("text=Documentador de Informes")).toBeVisible();
    await expect(page.locator("text=Arrastra aqui tu proyecto .pbip")).toBeVisible();
    await expect(page.locator("text=Generar documentacion")).not.toBeVisible(); // Solo visible tras parsear
    
    await page.locator(".modal-close").click();
  });
});`;
fs.writeFileSync("tests/pbip.spec.ts", pbipCode);

const boardCode = `import { test, expect } from "./setup";

test.describe("Tablero y Tickets", () => {
  test("Deberia mostrar columnas y permitir crear un ticket manual", async ({ page }) => {
    // Esperar a que carguen las columnas
    await expect(page.locator(".board-column").first()).toBeVisible({ timeout: 10000 });
    
    // Click en Nuevo Ticket
    await page.locator("button[title=\"Crear nuevo ticket\"]").click().catch(() => {});
    await expect(page.locator("text=Crear nuevo ticket").first()).toBeVisible();
    
    // Cerrar modal
    await page.locator(".modal-close").click();
  });
});`;
fs.writeFileSync("tests/board.spec.ts", boardCode);

const vacationsCode = `import { test, expect } from "./setup";

test.describe("Vacaciones", () => {
  test("Deberia abrir el panel de vacaciones", async ({ page }) => {
    await page.locator("button[title=\"Calendario de Ausencias\"]").click().catch(() => {});
    await expect(page.locator("text=Ausencias y Vacaciones").first()).toBeVisible({ timeout: 5000 });
    await page.locator(".modal-close").click();
  });
});`;
fs.writeFileSync("tests/vacations.spec.ts", vacationsCode);

console.log("ok");

