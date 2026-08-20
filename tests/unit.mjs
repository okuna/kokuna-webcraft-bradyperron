import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const testsDirectory = path.dirname(currentFile);
const rootDirectory = path.resolve(testsDirectory, "..");

function readRepositoryFile(relativePath) {
  return readFileSync(path.join(rootDirectory, relativePath), "utf8");
}

describe("Web Craft manifest", () => {
  it("declares the current Web Craft 1.0 contract without deployment claims", () => {
    const content = readRepositoryFile("site.toml");
    assert.match(content, /name\s*=\s*"kokuna-webcraft-bradyperron"/);
    assert.match(content, /original_url\s*=\s*"https:\/\/www\.bradyperron\.com\/"/);
    assert.match(content, /url\s*=\s*""/);
    assert.match(content, /category\s*=\s*"webcraft-1\.0"/);
    assert.match(content, /\[task\]/);
    assert.match(content, /format\s*=\s*"web_craft"/);
    assert.match(content, /workstream\s*=\s*"web_craft"/);
    assert.match(content, /hosting_access_granted\s*=\s*false/);
  });

  it("lists only non-empty runtime assets", () => {
    const content = readRepositoryFile("site.toml");
    const listedFiles = [...content.matchAll(/(?:file\s*=\s*)?"(public\/[^\"]+)"/g)].map(
      ([, relativePath]) => relativePath,
    );
    assert.ok(listedFiles.length >= 22, "Expected images, fonts, and icons in site.toml");
    for (const relativePath of new Set(listedFiles)) {
      const absolutePath = path.join(rootDirectory, relativePath);
      assert.ok(existsSync(absolutePath), `Missing declared asset: ${relativePath}`);
      assert.ok(statSync(absolutePath).size > 0, `Empty declared asset: ${relativePath}`);
    }
  });
});

describe("project data", () => {
  it("contains all 17 project titles", () => {
    const content = readRepositoryFile("src/lib/projects.ts");
    const ids = content.match(/^\s+id:\s*"/gm) ?? [];
    assert.equal(ids.length, 17, `Expected 17 projects, got ${ids.length}`);

    const titles = [
      "Harlaut Apparel Winter Campaign",
      "Lo & Behold",
      "Timberland Built for the Bold",
      "Nuance",
      "Valerie Omari",
      "NOVOS Labs",
      "JACK MOORE HEAD IN SAND",
      "Shy of Summer II",
      "See You on the Other Side",
      "686 Jogger",
      "ERNE",
      "Elaine Hersby",
      "The North Face | Freeride",
      "Something in the Water",
      "COALESCE",
      "ATTN for bite",
      "Good Bacteria",
    ];
    for (const title of titles) {
      assert.ok(content.includes(title), `Missing project title: ${title}`);
    }
  });

  it("uses local media while retaining source provenance", () => {
    const content = readRepositoryFile("src/lib/projects.ts");
    const imagePaths = [...content.matchAll(/imageUrl:\s*"([^\"]+)"/g)].map(
      ([, imagePath]) => imagePath,
    );
    const sourceUrls = [...content.matchAll(/sourceUrl:\s*\n?\s*"(https:[^\"]+)"/g)];

    assert.equal(imagePaths.length, 17);
    assert.equal(sourceUrls.length, 18);
    assert.ok(imagePaths.every((imagePath) => imagePath.startsWith("/assets/bradyperron/")));

    for (const imagePath of imagePaths) {
      const absolutePath = path.join(rootDirectory, "public", imagePath.slice(1));
      assert.ok(existsSync(absolutePath), `Missing project image: ${imagePath}`);
      assert.ok(statSync(absolutePath).size > 0, `Empty project image: ${imagePath}`);
    }

    assert.match(content, /instagram:\s*"https:\/\/instagram\.com\/bradyperron"/);
    assert.match(content, /email:\s*"brady\.perron@gmail\.com"/);
    assert.match(content, /url:\s*"\/assets\/bradyperron\/brady-portrait\.jpg"/);
  });

  it("declares four non-empty local preview videos", () => {
    const content = readRepositoryFile("src/lib/projects.ts");
    const videoPaths = [...content.matchAll(/previewVideoUrl:\s*"([^\"]+)"/g)].map(
      ([, videoPath]) => videoPath,
    );
    assert.equal(videoPaths.length, 4);
    for (const videoPath of videoPaths) {
      const absolutePath = path.join(rootDirectory, "public", videoPath.slice(1));
      assert.ok(existsSync(absolutePath), `Missing preview video: ${videoPath}`);
      assert.ok(statSync(absolutePath).size > 0, `Empty preview video: ${videoPath}`);
    }
  });
});

describe("component structure and interactions", () => {
  it("contains the required components and shared interaction helpers", () => {
    const files = [
      "src/components/Loader.tsx",
      "src/components/InfiniteCanvas.tsx",
      "src/components/ListView.tsx",
      "src/components/BottomBar.tsx",
      "src/components/AboutModal.tsx",
      "src/components/ProjectPreview.tsx",
      "src/components/ProjectMedia.tsx",
      "src/lib/motion.ts",
      "src/lib/useModalFocus.ts",
    ];
    for (const relativePath of files) {
      assert.ok(existsSync(path.join(rootDirectory, relativePath)), `${relativePath} missing`);
    }
  });

  it("composes both views and both modal experiences on the single page", () => {
    const page = readRepositoryFile("src/app/page.tsx");
    for (const component of [
      "InfiniteCanvas",
      "ListView",
      "BottomBar",
      "AboutModal",
      "Loader",
      "ProjectPreview",
      "MotionConfig",
    ]) {
      assert.match(page, new RegExp(component));
    }
    assert.match(page, /inert=/);
    assert.match(page, /id="main-content"/);
  });

  it("provides grid/list controls and project-opening buttons", () => {
    const bottomBar = readRepositoryFile("src/components/BottomBar.tsx");
    const grid = readRepositoryFile("src/components/InfiniteCanvas.tsx");
    const list = readRepositoryFile("src/components/ListView.tsx");
    assert.match(bottomBar, /Switch to list view/);
    assert.match(bottomBar, /Switch to grid view/);
    assert.match(bottomBar, /Open about modal/);
    assert.match(grid, /onPan=/);
    assert.match(grid, /onWheel=|addEventListener\("wheel"/);
    assert.match(grid, /Open \$\{project\.title\} preview/);
    assert.match(list, /onPan=/);
    assert.match(list, /onWheel=|addEventListener\("wheel"/);
    assert.match(list, /wrapProjectDistance/);
  });

  it("implements accessible modal behavior", () => {
    const about = readRepositoryFile("src/components/AboutModal.tsx");
    const preview = readRepositoryFile("src/components/ProjectPreview.tsx");
    const focus = readRepositoryFile("src/lib/useModalFocus.ts");

    for (const modal of [about, preview]) {
      assert.match(modal, /role="dialog"/);
      assert.match(modal, /aria-modal="true"/);
      assert.match(modal, /useModalFocus/);
    }
    assert.match(focus, /event\.key === "Escape"/);
    assert.match(focus, /event\.key !== "Tab"/);
    assert.match(focus, /previousFocus\?\.focus\(\)/);
  });

  it("preloads local assets and respects reduced motion", () => {
    const loader = readRepositoryFile("src/components/Loader.tsx");
    const grid = readRepositoryFile("src/components/InfiniteCanvas.tsx");
    const list = readRepositoryFile("src/components/ListView.tsx");
    const css = readRepositoryFile("src/app/globals.css");

    assert.match(loader, /PRELOAD_SOURCES/);
    assert.match(loader, /role="progressbar"/);
    assert.match(loader, /useReducedMotion/);
    assert.match(grid, /useReducedMotion/);
    assert.match(list, /useReducedMotion/);
    assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  });
});

describe("submission artifacts", () => {
  it("defines exactly five complete feature rubrics", () => {
    const features = JSON.parse(readRepositoryFile("features.json"));
    assert.equal(features.site, "kokuna-webcraft-bradyperron");
    assert.equal(features.rubrics.length, 5);
    for (const rubric of features.rubrics) {
      assert.deepEqual(Object.keys(rubric).sort(), ["criterion", "id", "priority", "type"]);
      assert.ok(Number.isInteger(rubric.id));
      assert.ok(rubric.criterion.length > 40);
      assert.ok(["CUJ", "design"].includes(rubric.type));
      assert.equal(rubric.priority, "must-have");
    }
  });

  it("keeps visual comparison scope on the only public route", () => {
    const config = JSON.parse(readRepositoryFile("webcraft.config.json"));
    assert.equal(config.pages.length, 1);
    assert.deepEqual(config.pages[0].paths, { replica: "/", original: "/" });
    assert.deepEqual(config.compare.submitBreakpoints, ["390-mobile", "1440-desktop"]);
  });
});
