
const fs = require("fs");
const sequenceCode = `import { test, expect } from "./setup";

test.describe("Secuencia de Analisis Funcional Completo", () => {
  // Configurar para que los tests corran en estricto orden secuencial
  test.describe.configure({ mode: "serial" });

  test("Paso 1: Interfaz Principal y Columnas Kanban", async ({ page }) => {
    await expect(page.locator(".topbar")).toBeVisible({ timeout: 10000 });
    // Verificar que las columnas estandar cargan
    await expect(page.locator("h3:has-text(\"Backlog\")")).toBeVisible();
    await expect(page.locator("h3:has-text(\"En progreso\")")).toBeVisible();
  });

  test("Paso 2: Estimador Power BI y Documentador PBIP", async ({ page }) => {
    // Abrir Estimador
    await page.locator("button[title=\"Estimador PowerBI\"]").click();
    await expect(page.locator("text=Estimador de Esfuerzo")).toBeVisible();

    // Desde el Estimador, abrir la nueva feature de PBIP
    await page.locator("button:has-text(\"Documentar desde .pbip\")").click();
    
    // Verificar que el modal de PBIP esta por encima y carga bien
    await expect(page.locator("text=Documentador de Informes Power BI")).toBeVisible();
    await expect(page.locator("text=Arrastra aqui tu proyecto .pbip")).toBeVisible();
    
    // Cerrar modales (PBIP primero, Estimador despues)
    await page.locator(".modal-close").first().click();
    await page.locator(".modal-close").first().click();
  });

  test("Paso 3: Creacion Inteligente de Tickets", async ({ page }) => {
    // Click en el FAB de nuevo ticket
    await page.locator("button[title=\"Crear nuevo ticket\"]").click();
    await expect(page.locator("text=Crear nuevo ticket").first()).toBeVisible();
    
    // Probar interaccion con la caja de IA
    const promptBox = page.locator("textarea[placeholder*=\"Ejemplo: Necesitamos\"]");
    await expect(promptBox).toBeVisible();
    await promptBox.fill("Quiero una tarea para actualizar la base de datos hoy mismo (Simulacion)");
    
    // Cerrar modal sin guardar para no ensuciar DB
    await page.locator(".modal-close").first().click();
  });

  test("Paso 4: Herramientas de Equipo y Colaboracion", async ({ page }) => {
    // 4.1 Daily Meeting
    await page.locator("button[title=\"Daily Meeting\"]").click();
    await expect(page.locator("text=Reunion Diaria")).toBeVisible();
    await page.locator("button:has-text(\"Cerrar\")").click();

    // 4.2 Vacaciones
    await page.locator("button[title=\"Calendario de Ausencias\"]").click();
    await expect(page.locator("text=Ausencias y Vacaciones")).toBeVisible();
    await page.locator(".modal-close").click();

    // 4.3 Notas
    await page.locator("button[title=\"Notas Compartidas\"]").click();
    await expect(page.locator("text=Notas Compartidas")).toBeVisible();
    await page.locator("button:has-text(\"Cerrar\")").first().click();
  });

  test("Paso 5: Ajustes y Privacidad", async ({ page }) => {
    await page.locator("button[title=\"Ajustes de usuario\"]").click();
    await expect(page.locator("text=Configuracion de IA")).toBeVisible();
    await page.locator(".modal-close").click();
  });
});
`;
fs.writeFileSync("tests/e2e-sequence.spec.ts", sequenceCode);
console.log("Secuencia creada.");

