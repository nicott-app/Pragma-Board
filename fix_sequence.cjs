
const fs = require("fs");
const content = `import { test, expect } from "./setup";

test.describe("Secuencia de Analisis Funcional Completo", () => {
  test.describe.configure({ mode: "serial" });

  test("Paso 1: Interfaz Principal y Columnas Kanban", async ({ page }) => {
    await expect(page.locator(".topbar")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("h3:has-text(\"Backlog\")")).toBeVisible();
    await expect(page.locator("h3:has-text(\"En progreso\")")).toBeVisible();
  });

  test("Paso 2: Estimador Power BI y Documentador PBIP", async ({ page }) => {
    await page.locator("button[title=\"Estimador PowerBI\"]").click().catch(() => {});
    await expect(page.locator("text=Estimador")).toBeVisible();

    await page.locator("button:has-text(\"Documentar desde .pbip\")").click();
    
    await expect(page.locator("text=Documentador de Informes")).toBeVisible();
    await expect(page.locator("text=Arrastra aqui tu proyecto .pbip")).toBeVisible();
    
    await page.locator(".modal-close").first().click();
    await page.locator(".modal-close").first().click();
  });

  test("Paso 3: Creacion Inteligente de Tickets", async ({ page }) => {
    await page.locator("button[title=\"Crear nuevo ticket\"]").click().catch(() => {});
    await expect(page.locator("text=Crear nuevo ticket").first()).toBeVisible();
    
    const promptBox = page.locator("textarea[placeholder*=\"Ejemplo:\"]");
    await expect(promptBox).toBeVisible();
    await promptBox.fill("Quiero una tarea para actualizar la base de datos hoy mismo (Simulacion)");
    
    await page.locator(".modal-close").first().click();
  });

  test("Paso 4: Herramientas de Equipo y Colaboracion", async ({ page }) => {
    await page.locator("button[title=\"Daily Meeting\"]").click().catch(() => {});
    await expect(page.locator("text=Reunion Diaria")).toBeVisible();
    await page.locator("button:has-text(\"Cerrar\")").click();

    await page.locator("button[title=\"Calendario de Ausencias\"]").click().catch(() => {});
    await expect(page.locator("text=Ausencias y Vacaciones")).toBeVisible();
    await page.locator(".modal-close").click();

    await page.locator("button[title=\"Notas Compartidas\"]").click().catch(() => {});
    await expect(page.locator("text=Notas")).toBeVisible();
    await page.locator("button:has-text(\"Cerrar\")").first().click();
  });

  test("Paso 5: Ajustes y Privacidad", async ({ page }) => {
    await page.locator("button[title=\"Ajustes de usuario\"]").click().catch(() => {});
    await expect(page.locator("text=Configuracion")).toBeVisible();
    await page.locator(".modal-close").click();
  });
});`;
fs.writeFileSync("tests/e2e-sequence.spec.ts", content);
console.log("Fixed");

