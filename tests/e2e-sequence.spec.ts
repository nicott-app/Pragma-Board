import { test, expect } from './setup';

test.describe('Secuencia de Analisis Funcional Completo', () => {
  test('Prueba completa paso a paso', async ({ page }) => {
    // Paso 1
    console.log('Paso 1: Interfaz Principal y Columnas Kanban');
    await expect(page.locator('#topbar')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('h3:has-text("Backlog")')).toBeVisible();
    await expect(page.locator('h3:has-text("En progreso")')).toBeVisible();
    await page.waitForTimeout(1000); // Pausa visual

    // Paso 2
    console.log('Paso 2: Estimador Power BI y Documentador PBIP');
    await page.locator('button[title="Estimador PowerBI"]').click().catch(() => {});
    await expect(page.locator('text=Estimador')).toBeVisible();
    await page.waitForTimeout(1000);

    await page.locator('button:has-text("Documentar desde .pbip")').click();
    await expect(page.locator('text=Documentador de Informes')).toBeVisible();
    await expect(page.locator('text=Arrastra aqui tu proyecto .pbip')).toBeVisible();
    await page.waitForTimeout(1000);
    
    // El modal de PBIP puede requerir cerrar desde el componente interno
    await page.locator('.modal-close').first().click();
    await page.locator('.modal-close').first().click();
    await page.waitForTimeout(1000);

    // Paso 3
    console.log('Paso 3: Creacion Inteligente de Tickets');
    await page.locator('button[title="Crear nuevo ticket"]').click().catch(() => {});
    await expect(page.locator('text=Crear nuevo ticket').first()).toBeVisible();
    const promptBox = page.locator('textarea[placeholder*="Ejemplo:"]');
    await expect(promptBox).toBeVisible();
    await promptBox.fill('Quiero una tarea para actualizar la base de datos hoy mismo (Simulacion)');
    await page.waitForTimeout(1000);
    await page.locator('.modal-close').first().click();
    await page.waitForTimeout(1000);

    // Paso 4
    console.log('Paso 4: Herramientas de Equipo y Colaboracion');
    await page.locator('button[title="Daily Meeting"]').click().catch(() => {});
    await expect(page.locator('text=Reunion Diaria')).toBeVisible();
    await page.waitForTimeout(1000);
    await page.locator('button:has-text("Cerrar")').click();

    await page.locator('button[title="Calendario de Ausencias"]').click().catch(() => {});
    await expect(page.locator('text=Ausencias y Vacaciones')).toBeVisible();
    await page.waitForTimeout(1000);
    await page.locator('.modal-close').click();

    await page.locator('button[title="Notas Compartidas"]').click().catch(() => {});
    await expect(page.locator('text=Notas')).toBeVisible();
    await page.waitForTimeout(1000);
    await page.locator('button:has-text("Cerrar")').first().click();

    // Paso 5
    console.log('Paso 5: Ajustes y Privacidad');
    await page.locator('button[title="Ajustes de usuario"]').click().catch(() => {});
    await expect(page.locator('text=Configuracion')).toBeVisible();
    await page.waitForTimeout(1000);
    await page.locator('.modal-close').click();
  });
});
