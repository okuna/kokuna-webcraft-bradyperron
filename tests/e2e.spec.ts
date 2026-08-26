import { expect, test, type Locator, type Page } from "@playwright/test";

const PROJECT_COUNT = 17;
const DESKTOP_CARD_COUNT = 4;
const MOBILE_CARD_COUNT = 3;

const gridCardSelector =
  '[data-view="grid"] button[aria-label^="Open "][aria-label$=" preview"]';
const listTitleSelector = '[data-view="list"] .project-title-row';
const ringCardSelector =
  '[data-view="list"] [aria-hidden="true"] button[tabindex="-1"]';

async function openHome(page: Page) {
  await page.goto("/");
  await expect(page.locator(".loader")).toBeHidden({ timeout: 10_000 });
  await expect(
    page.getByRole("button", { name: "Switch to list view" }),
  ).toBeEnabled();
}

async function waitForGridIntro(page: Page) {
  const grid = page.locator('[data-view="grid"]');
  await expect(grid).toBeVisible();
  await expect(grid).toHaveAttribute("data-intro-phase", "grid", {
    timeout: 8_000,
  });
}

async function inlineTransforms(locator: Locator) {
  return locator.evaluateAll((elements) =>
    elements.map((element) => (element as HTMLElement).style.transform),
  );
}

async function elementCenters(locator: Locator) {
  return locator.evaluateAll((elements) =>
    elements.map((element) => {
      const bounds = element.getBoundingClientRect();
      return {
        x: bounds.left + bounds.width / 2,
        y: bounds.top + bounds.height / 2,
      };
    }),
  );
}

async function dragSurface(page: Page, selector: string, deltaY: number) {
  const surface = page.locator(selector);
  const box = await surface.boundingBox();
  expect(box).not.toBeNull();
  if (!box) return;

  const x = box.x + 20;
  const startY = box.y + 20;
  await page.mouse.move(x, startY);
  await page.mouse.down();
  await page.mouse.move(x, startY + deltaY, { steps: 12 });
  await page.mouse.up();
}

test.describe("bradyperron replication", () => {
  test("loader reveals a centered stack that disperses into the same moving grid cards", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "commit" });

    const loader = page.locator(".loader");
    const grid = page.locator('[data-view="grid"]');
    await expect(loader).toBeVisible();
    await expect(loader).toHaveRole("status");
    await expect(loader.getByText("bradyperron")).toBeVisible();
    await expect(loader.getByRole("progressbar")).toBeVisible();

    await expect(grid).toHaveAttribute("data-intro-phase", "dispersing", {
      timeout: 10_000,
    });
    const introCards = page.locator('[data-intro-card]');
    const activeCards = page.locator('[data-intro-card="active"]:visible');
    await expect(introCards).toHaveCount(16);
    await expect(activeCards).toHaveCount(DESKTOP_CARD_COUNT);
    await expect(activeCards.first()).toBeDisabled();

    const stackedCenters = await elementCenters(introCards);
    const stackedX = stackedCenters.map(({ x }) => x);
    const stackedY = stackedCenters.map(({ y }) => y);
    expect(Math.max(...stackedX) - Math.min(...stackedX)).toBeLessThan(260);
    expect(Math.max(...stackedY) - Math.min(...stackedY)).toBeLessThan(260);

    await activeCards.first().evaluate((element) => {
      element.setAttribute("data-continuity-token", "opening-card");
    });
    await expect(loader).toBeHidden({ timeout: 10_000 });

    await page.waitForTimeout(900);
    const dispersedCenters = await elementCenters(introCards);
    const dispersedX = dispersedCenters.map(({ x }) => x);
    const dispersedY = dispersedCenters.map(({ y }) => y);
    expect(Math.max(...dispersedX) - Math.min(...dispersedX)).toBeGreaterThan(800);
    expect(Math.max(...dispersedY) - Math.min(...dispersedY)).toBeGreaterThan(600);

    await waitForGridIntro(page);
    await expect(page.locator('[data-intro-card="departing"]')).toHaveCount(0);
    await expect(
      page.locator('[data-continuity-token="opening-card"]'),
    ).toHaveCount(1);

    const cards = page.locator(`${gridCardSelector}:visible`);
    await expect(cards).toHaveCount(DESKTOP_CARD_COUNT);
    await expect(cards.locator("img, video")).toHaveCount(DESKTOP_CARD_COUNT);

    const destinations = await elementCenters(cards);
    const viewport = page.viewportSize();
    expect(viewport).not.toBeNull();
    if (!viewport) return;
    expect(destinations[0].x).toBeLessThan(viewport.width * 0.15);
    expect(Math.abs(destinations[0].y - viewport.height / 2)).toBeLessThan(30);
    expect(Math.abs(destinations[1].x - viewport.width / 2)).toBeLessThan(30);
    expect(destinations[1].y).toBeGreaterThan(viewport.height * 0.65);
    expect(destinations[2].x).toBeLessThan(viewport.width * 0.45);
    expect(destinations[2].y).toBeLessThan(viewport.height * 0.4);
    expect(destinations[3].x).toBeGreaterThan(viewport.width);
    expect(destinations[3].y).toBeGreaterThan(viewport.height);

    const before = await inlineTransforms(cards);
    await page.waitForTimeout(300);
    expect(await inlineTransforms(cards)).not.toEqual(before);
  });

  test("the grid responds to wheel and drag input without opening a project", async ({
    page,
  }) => {
    await openHome(page);
    await waitForGridIntro(page);

    const cards = page.locator(`${gridCardSelector}:visible`);
    const grid = page.locator('[data-view="grid"]');
    const beforeWheel = await inlineTransforms(cards);
    await grid.hover({ position: { x: 20, y: 20 } });
    await page.mouse.wheel(0, 1_200);
    await page.waitForTimeout(300);
    expect(await inlineTransforms(cards)).not.toEqual(beforeWheel);

    const beforeDrag = await inlineTransforms(cards);
    await dragSurface(page, '[data-view="grid"]', 260);
    await page.waitForTimeout(300);
    expect(await inlineTransforms(cards)).not.toEqual(beforeDrag);
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("list view keeps all titles in a loop and renders the media ring", async ({
    page,
  }) => {
    await openHome(page);
    await page.getByRole("button", { name: "Switch to list view" }).click();

    const list = page.locator('[data-view="list"]');
    const titles = page.locator(listTitleSelector);
    const ringCards = page.locator(ringCardSelector);
    await expect(list).toBeVisible();
    await expect(titles).toHaveCount(PROJECT_COUNT);
    await expect(ringCards).toHaveCount(PROJECT_COUNT);
    await expect(ringCards.locator("img, video")).toHaveCount(PROJECT_COUNT);
    const visibleRingCards = page.locator(`${ringCardSelector}:visible`);
    const visibleRingCount = await visibleRingCards.count();
    expect(visibleRingCount).toBeGreaterThanOrEqual(8);
    expect(visibleRingCount).toBeLessThanOrEqual(10);
    const activeTitle = page.locator(`${listTitleSelector}[data-active]`);
    await expect(activeTitle).toHaveCount(1);

    const ringTransforms = await inlineTransforms(ringCards);
    expect(new Set(ringTransforms).size).toBeGreaterThan(8);

    const initialTitle = await activeTitle.textContent();
    await list.hover({ position: { x: 20, y: 20 } });
    await page.mouse.wheel(0, 1_500);
    await expect
      .poll(() => activeTitle.textContent(), { timeout: 4_000 })
      .not.toBe(initialTitle);

    const titleAfterWheel = await activeTitle.textContent();
    await dragSurface(page, '[data-view="list"]', 300);
    await expect
      .poll(() => activeTitle.textContent(), { timeout: 4_000 })
      .not.toBe(titleAfterWheel);

    await expect(titles).toHaveCount(PROJECT_COUNT);
    await expect(activeTitle).toHaveCount(1);
    await expect(
      page.getByRole("button", { name: "Switch to grid view" }),
    ).toBeVisible();
  });

  test("a project opens as an accessible dialog and Escape restores focus", async ({
    page,
  }) => {
    await openHome(page);
    await page.getByRole("button", { name: "Switch to list view" }).click();

    const trigger = page.locator(`${listTitleSelector}[data-active]`);
    const title = (await trigger.textContent())?.trim();
    expect(title).toBeTruthy();
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: title });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: title })).toBeVisible();
    await expect(
      dialog.getByRole("button", { name: "Close project preview" }),
    ).toBeFocused();
    await expect(
      dialog.getByRole("button", { name: new RegExp(`Read more about`) }),
    ).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("about dialog contains the source content, traps focus, and closes with Escape", async ({
    page,
  }) => {
    await openHome(page);
    const aboutTrigger = page.getByRole("button", { name: "Open about modal" });
    await aboutTrigger.click();

    const dialog = page.getByRole("dialog", {
      name: /Brady Perron is a Brooklyn-based/i,
    });
    const closeButton = dialog.getByRole("button", {
      name: "Close about modal",
    });
    const emailLink = dialog.getByRole("link", { name: /email/i });

    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(dialog.getByText(/Rhythm\. Range\. Poetic\. Dynamic\./)).toBeVisible();
    await expect(dialog.getByRole("img", { name: /Brady Perron/i })).toBeVisible();
    await expect(dialog.getByRole("link", { name: /instagram/i })).toHaveAttribute(
      "href",
      "https://instagram.com/bradyperron",
    );
    await expect(emailLink).toHaveAttribute("href", "mailto:brady.perron@gmail.com");
    await expect(closeButton).toBeFocused();

    await page.keyboard.press("Shift+Tab");
    await expect(emailLink).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(closeButton).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(aboutTrigger).toBeFocused();
  });

  test("320px layout has three cards, no overflow, and no hydration mismatch", async ({
    page,
  }) => {
    const hydrationErrors: string[] = [];
    page.on("console", (message) => {
      const text = message.text();
      if (
        message.type() === "error" &&
        (/hydration/i.test(text) || /React error #418/.test(text))
      ) {
        hydrationErrors.push(text);
      }
    });

    await page.setViewportSize({ width: 320, height: 800 });
    await openHome(page);
    await waitForGridIntro(page);

    await expect(page.locator(`${gridCardSelector}:visible`)).toHaveCount(
      MOBILE_CARD_COUNT,
    );
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
    }));
    expect(Math.max(dimensions.document, dimensions.body)).toBeLessThanOrEqual(
      dimensions.viewport,
    );
    expect(hydrationErrors).toEqual([]);
  });

  test("reduced-motion users still receive the complete portfolio UI", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openHome(page);

    const grid = page.locator('[data-view="grid"]');
    const cards = page.locator(`${gridCardSelector}:visible`);
    await expect(grid).toBeVisible();
    await expect(cards).toHaveCount(DESKTOP_CARD_COUNT);
    await expect(page.locator(".layout-name")).toHaveText("bradyperron");
    await expect(page.getByRole("button", { name: "Open about modal" })).toBeVisible();

    await page.waitForTimeout(100);
    const before = await inlineTransforms(cards);
    await page.waitForTimeout(300);
    expect(await inlineTransforms(cards)).toEqual(before);
  });

  test("all rendered links are external, mail, or valid in-page targets", async ({
    page,
  }) => {
    await openHome(page);
    const hrefs = new Set<string>();
    const collectLinks = async () => {
      const current = await page.locator("a[href]").evaluateAll((anchors) =>
        anchors.map((anchor) => anchor.getAttribute("href") || ""),
      );
      current.forEach((href) => hrefs.add(href));
    };

    await collectLinks();

    await page.getByRole("button", { name: "Switch to list view" }).click();
    await page.locator(`${listTitleSelector}[data-active]`).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await collectLinks();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();

    await page.getByRole("button", { name: "Open about modal" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await collectLinks();

    expect(hrefs.size).toBeGreaterThanOrEqual(4);
    for (const href of hrefs) {
      expect(href.trim()).not.toBe("");
      expect(href).not.toBe("#");
      expect(href).not.toMatch(/^https?:\/\/(www\.)?bradyperron\.com/i);

      if (href.startsWith("#")) {
        const hasTarget = await page.evaluate((hash) => {
          const id = decodeURIComponent(hash.slice(1));
          return Boolean(id && document.getElementById(id));
        }, href);
        expect(hasTarget, `Missing target for ${href}`).toBe(true);
        continue;
      }

      const target = new URL(href, page.url());
      if (target.origin === new URL(page.url()).origin) {
        const response = await page.request.get(target.href);
        expect(response.status(), `${href} returned ${response.status()}`).toBeLessThan(
          400,
        );
      }
    }
  });
});
