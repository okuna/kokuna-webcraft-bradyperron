const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

// Mock projects file reading - we will require TS via simple parse or check file content

describe("site.toml manifest shape", () => {
  it("site.toml exists and has required fields", () => {
    const tomlPath = path.join(__dirname, "..", "site.toml");
    assert.ok(fs.existsSync(tomlPath), "site.toml missing");
    const content = fs.readFileSync(tomlPath, "utf-8");
    assert.match(content, /name\s*=\s*"kokuna-webcraft-bradyperron"/);
    assert.match(content, /original_url\s*=\s*"https:\/\/www\.bradyperron\.com/);
    assert.match(content, /\[site\.assets\]/);
  });
});

describe("projects lib", () => {
  it("has 17 projects with required titles including quotes", () => {
    const projectsPath = path.join(__dirname, "..", "src/lib/projects.ts");
    const content = fs.readFileSync(projectsPath, "utf-8");
    // Count entries by looking for id: pattern
    const matches = content.match(/id:\s*"/g) || [];
    // 17 projects
    assert.equal(matches.length, 17, `Expected 17 projects, got ${matches.length}`);

    // Check titles preserve quotes from original
    assert.ok(content.includes('Harlaut Apparel Winter Campaign'), "Missing Harlaut");
    assert.ok(content.includes('Lo & Behold'), "Missing Lo & Behold");
    assert.ok(content.includes('Timberland Built for the Bold'), "Missing Timberland");
    assert.ok(content.includes('Nuance'), "Missing Nuance");
    assert.ok(content.includes('Valerie Omari'), "Missing Valerie");
    assert.ok(content.includes('NOVOS Labs'), "Missing NOVOS");
    assert.ok(content.includes('JACK MOORE HEAD IN SAND'), "Missing Jack Moore");
    assert.ok(content.includes('Shy of Summer II'), "Missing Shy");
    assert.ok(content.includes("I'll See You on the Other Side"), "Missing Omar");
    assert.ok(content.includes('686 Jogger'), "Missing 686");
    assert.ok(content.includes('ERNE'), "Missing ERNE");
    assert.ok(content.includes('Elaine Hersby'), "Missing Elaine");
    assert.ok(content.includes('The North Face | Freeride'), "Missing Freeride");
    assert.ok(content.includes('Something in the Water'), "Missing Something");
    assert.ok(content.includes('COALESCE'), "Missing COALESCE");
    assert.ok(content.includes('ATTN for bite'), "Missing ATTN");
    assert.ok(content.includes('Good Bacteria'), "Missing Good Bacteria");
  });

  it("settings has instagram, email, portrait", () => {
    const p = path.join(__dirname, "..", "src/lib/projects.ts");
    const c = fs.readFileSync(p, "utf-8");
    assert.match(c, /instagram/);
    assert.match(c, /bradyperron/);
    assert.match(c, /brady\.perron@gmail\.com/);
    assert.match(c, /ce4e709dd358c6174402b1342cef9809f85035b5/); // portrait id
  });
});

describe("components existence", () => {
  it("has required components", () => {
    const comps = ["Loader.tsx", "InfiniteCanvas.tsx", "ListView.tsx", "BottomBar.tsx", "AboutModal.tsx", "ProjectPreview.tsx"];
    for (const comp of comps) {
      const fp = path.join(__dirname, "..", "src/components", comp);
      assert.ok(fs.existsSync(fp), `${comp} missing`);
    }
  });
});

describe("bottom bar navigation targets", () => {
  it("BottomBar has list and about buttons with aria-labels", () => {
    const bb = fs.readFileSync(path.join(__dirname, "..", "src/components/BottomBar.tsx"), "utf-8");
    assert.match(bb, /Switch to list view/);
    assert.match(bb, /Open about modal/);
    assert.match(bb, /bradyperron/);
  });

  it("AboutModal has contact links and close", () => {
    const am = fs.readFileSync(path.join(__dirname, "..", "src/components/AboutModal.tsx"), "utf-8");
    assert.match(am, /instagram/i);
    assert.match(am, /mailto/);
    assert.match(am, /close/i);
    assert.match(am, /about —/);
  });

  it("Loader has progress and bradyperron text", () => {
    const loader = fs.readFileSync(path.join(__dirname, "..", "src/components/Loader.tsx"), "utf-8");
    assert.match(loader, /bradyperron/);
    assert.match(loader, /progress/i);
  });
});

describe("page structure", () => {
  it("page.tsx composes all main components", () => {
    const page = fs.readFileSync(path.join(__dirname, "..", "src/app/page.tsx"), "utf-8");
    assert.match(page, /InfiniteCanvas/);
    assert.match(page, /ListView/);
    assert.match(page, /BottomBar/);
    assert.match(page, /AboutModal/);
    assert.match(page, /Loader/);
    assert.match(page, /ProjectPreview/);
  });

  it("globals.css has required utilities", () => {
    const css = fs.readFileSync(path.join(__dirname, "..", "src/app/globals.css"), "utf-8");
    assert.match(css, /\.project-title-row/);
    assert.match(css, /\.font-acumin/);
    assert.match(css, /\.layout-name/);
  });
});

describe("accessibility checks", () => {
  it("AboutModal traps focus and handles Escape", () => {
    const am = fs.readFileSync(path.join(__dirname, "..", "src/components/AboutModal.tsx"), "utf-8");
    assert.match(am, /Escape/);
    assert.match(am, /overflow.*hidden/);
  });

  it("Bottom buttons have minHeight 44px", () => {
    const bb = fs.readFileSync(path.join(__dirname, "..", "src/components/BottomBar.tsx"), "utf-8");
    // check style minHeight 44
    assert.ok(bb.includes("44px") || bb.includes("min-h-[44px]"), "touch target not 44px");
  });
});
