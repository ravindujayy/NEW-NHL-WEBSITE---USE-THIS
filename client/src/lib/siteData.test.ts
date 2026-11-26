import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  HERO_IMAGE,
  HERO_VIDEO,
  STORY_IMAGE,
  DETAIL_IMAGE,
  GARMENT_EXPLORER_IMAGE,
  GARMENT_OUTERWEAR_IMAGE,
  GARMENT_TAILORING_IMAGE,
  GARMENT_BOTTOMS_IMAGE,
  STANDARD_100_LOGO,
  MADE_IN_GREEN_LOGO,
  CONFIDENCE_IN_TEXTILES_LOGO,
  CERT_STANDARD_100_LOGO,
  CERT_MADE_IN_GREEN_LOGO,
  CERT_CONFIDENCE_IN_TEXTILES_LOGO,
  categories,
  processSteps,
  capabilities,
  certifications,
  getCategory,
} from "./siteData.ts";

describe("NHL International siteData", () => {
  it("contains 19 unique trim categories", () => {
    assert.equal(categories.length, 19);
    const slugs = new Set(categories.map((c) => c.slug));
    assert.equal(slugs.size, 19);
  });

  it("looks up categories by slug", () => {
    assert.equal(getCategory("buttons")?.name, "Buttons");
    assert.equal(getCategory("zippers-2")?.name, "Zippers");
    assert.equal(getCategory("does-not-exist"), undefined);
  });

  it("uses valid local assets instead of manus-storage paths", () => {
    const localMedia = [
      HERO_IMAGE,
      HERO_VIDEO,
      STORY_IMAGE,
      DETAIL_IMAGE,
      GARMENT_EXPLORER_IMAGE,
      GARMENT_OUTERWEAR_IMAGE,
      GARMENT_TAILORING_IMAGE,
      GARMENT_BOTTOMS_IMAGE,
      STANDARD_100_LOGO,
      MADE_IN_GREEN_LOGO,
      CONFIDENCE_IN_TEXTILES_LOGO,
      CERT_STANDARD_100_LOGO,
      CERT_MADE_IN_GREEN_LOGO,
      CERT_CONFIDENCE_IN_TEXTILES_LOGO,
    ];
    for (const mediaPath of localMedia) {
      assert.equal(mediaPath.startsWith("/assets/"), true, `Expected local /assets/ path, got ${mediaPath}`);
      const diskPath = path.resolve(process.cwd(), "client", "public", mediaPath.replace(/^\//, ""));
      assert.equal(fs.existsSync(diskPath), true, `Missing asset on disk: ${diskPath}`);
    }
  });

  it("provides 4 process steps, 6 capabilities, and 3 certifications", () => {
    assert.equal(processSteps.length, 4);
    assert.equal(capabilities.length, 6);
    assert.equal(certifications.length, 3);
  });
});
