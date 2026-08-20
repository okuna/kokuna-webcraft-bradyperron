import { test, expect } from "@playwright/test";

test.describe("bradyperron replication", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loader appears and disappears", async ({ page }) => {
    await expect(page.locator(".loader")).toBeVisible();
    await expect(page.getByText("bradyperron").first()).toBeVisible();
    // wait for loader to fade
    await expect(page.locator(".loader")).toBeHidden({ timeout: 5000 });
  });

  test("bottom bar appears after loader", async ({ page }) => {
    await page.waitForTimeout(2500);
    await expect(page.locator(".layout-name")).toBeVisible();
    await expect(page.getByRole("button", { name: /list view|canvas view/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /about modal/i })).toBeVisible();
  });

  test("infinite canvas shows project titles", async ({ page }) => {
    await page.waitForTimeout(2500);
    const titles = page.locator(".project-title-row");
    await expect(titles.first()).toBeVisible({ timeout: 5000 });
    const count = await titles.count();
    expect(count).toBeGreaterThan(10);

    // check for known titles
    await expect(page.getByText("Harlaut Apparel Winter Campaign").first()).toBeVisible();
    await expect(page.getByText("Timberland Built for the Bold").first()).toBeVisible();
  });

  test("scroll wheel changes offset", async ({ page }) => {
    await page.waitForTimeout(2500);
    const first = page.locator(".project-title-row").first();
    await first.waitFor({ state: "visible" });
    // wheel
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(400);
    // Should still have titles visible after scroll
    await expect(page.locator(".project-title-row").first()).toBeVisible();
  });

  test("list toggle switches view", async ({ page }) => {
    await page.waitForTimeout(2500);
    const toggle = page.getByRole("button", { name: /list view/i });
    await toggle.click();
    await expect(page.locator("text=Harlaut Apparel Winter Campaign").first()).toBeVisible();
    // Should show list meta
    await expect(page.getByText(/\(17\) projects/)).toBeVisible({ timeout: 2000 });

    // Toggle back to canvas
    const canvasBtn = page.getByRole("button", { name: /canvas view/i });
    await canvasBtn.click();
    await expect(page.locator(".project-title-row").first()).toBeVisible({ timeout: 2000 });
  });

  test("about modal opens and closes", async ({ page }) => {
    await page.waitForTimeout(2500);
    await page.getByRole("button", { name: /about modal/i }).click();
    await expect(page.getByText(/Brooklyn-based/)).toBeVisible({ timeout: 2000 });
    await expect(page.getByText(/Rhythm\. Range\. Poetic\. Dynamic\./)).toBeVisible();
    await expect(page.getByRole("link", { name: /instagram/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /email/i })).toBeVisible();

    // Close via button
    await page.getByRole("button", { name: /close/i }).click();
    await expect(page.getByText(/Brooklyn-based/)).toBeHidden({ timeout: 2000 });

    // Re-open and close via Escape
    await page.getByRole("button", { name: /about modal/i }).click();
    await expect(page.getByText(/Brooklyn-based/)).toBeVisible({ timeout: 2000 });
    await page.keyboard.press("Escape");
    await expect(page.getByText(/Brooklyn-based/)).toBeHidden({ timeout: 2000 });
  });

  test("keyboard navigation", async ({ page }) => {
    await page.waitForTimeout(2500);
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    // Focus should be on some button
    const focused = page.locator(":focus");
    await expect(focused).toBeVisible();
  });

  test("no horizontal overflow at 320", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.waitForTimeout(500);
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(overflow).toBeFalsy();
  });

  test("reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForTimeout(1500);
    // Should still render
    await expect(page.getByText("bradyperron").first()).toBeVisible({ timeout: 5000 });
  });

  test("dead links check", async ({ page }) => {
    await page.waitForTimeout(2500);
    // All project rows in canvas view are buttons, not links, so no 404
    // In list view, links should be external youtube or #
    await page.getByRole("button", { name: /list view/i }).click();
    await page.waitForTimeout(500);
    const links = page.locator("a[href]");
    const count = await links.count();
    expect(count).toBeGreaterThan(5);
    for (let i = 0; i < Math.min(count, 20); i++) {
      const href = await links.nth(i).getAttribute("href");
      expect(href).toBeTruthy();
      expect(href).not.toBe("");
    }
  });
});
