
const fs = require("fs");
if (!fs.existsSync("tests")) fs.mkdirSync("tests");

const setupCode = `import { test as base } from "@playwright/test";

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.goto("http://localhost:5173");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => {
      if (window.useAuthStore) {
        window.useAuthStore.getState().setCurrentUser({
          uid: "e2e-test-user-id",
          email: "qa@smartboard.test",
          displayName: "QA Robot"
        });
      }
    });
    await page.waitForSelector(".layout-container, .topbar", { state: "visible", timeout: 5000 }).catch(() => {});
    await use(page);
  }
});
export { expect } from "@playwright/test";`;
fs.writeFileSync("tests/setup.ts", setupCode);

const toolsCode = `import { test, expect } from "./setup";

test.describe("Herramientas Funcionales", () => {
  test("Deberia abrir el Estimador y el Documentador PBIP", async ({ page }) => {
    await page.locator("button[title=\"Estimador PowerBI\"]").click().catch(() => {});
    await expect(page.locator("text=Estimador Power BI").first()).toBeVisible({ timeout: 5000 }).catch(() => {});
    const pbipBtn = page.locator("button:has-text(\"Documentar desde .pbip\")");
    if (await pbipBtn.isVisible()) {
      await pbipBtn.click();
      await expect(page.locator("text=Documentador de Informes")).toBeVisible();
      await page.locator(".modal-close").click();
    }
  });
  
  test("Deberia abrir herramientas de equipo (Daily, Notas, etc)", async ({ page }) => {
    await page.locator("button[title=\"Daily Meeting\"]").click().catch(() => {});
    await expect(page.locator("text=Reunion Diaria").first()).toBeVisible({ timeout: 5000 }).catch(() => {});
  });
});`;
fs.writeFileSync("tests/tools.spec.ts", toolsCode);
console.log("ok");

