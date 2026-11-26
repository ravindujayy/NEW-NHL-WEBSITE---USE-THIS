import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { categories } from "./siteData.ts";
import {
  addInquiryItem,
  filterCategories,
  formatFileSize,
  removeInquiryItem,
  restoreInquiryItem,
  validateArtworkFile,
  validateContactForm,
  type ContactFormState,
} from "./inquiryHelpers.ts";

describe("filterCategories", () => {
  it("filters by query across name and short description", () => {
    const zipResults = filterCategories(categories, "zip", [], false);
    assert.equal(zipResults.length, 2);
    assert.deepEqual(
      zipResults.map((c) => c.name),
      ["Zip Pullers", "Zippers"]
    );
  });

  it("filters by items already in inquiry when toggle is enabled", () => {
    const filtered = filterCategories(
      categories,
      "",
      ["Buttons — Core profile", "Snap — initial range"],
      true
    );
    assert.deepEqual(
      filtered.map((c) => c.name),
      ["Buttons", "Snap"]
    );
  });

  it("returns empty array when no category matches", () => {
    const empty = filterCategories(categories, "nonexistent-trim", [], false);
    assert.equal(empty.length, 0);
  });
});

describe("inquiry list mutations", () => {
  it("prevents duplicates when adding items", () => {
    const first = addInquiryItem([], "Buttons — initial range");
    assert.equal(first.added, true);
    assert.deepEqual(first.items, ["Buttons — initial range"]);

    const second = addInquiryItem(first.items, "Buttons — initial range");
    assert.equal(second.added, false);
    assert.deepEqual(second.items, ["Buttons — initial range"]);
  });

  it("removes and restores an item at its original index for undo", () => {
    const initial = ["Beads — initial range", "Buttons — initial range", "Snap — initial range"];
    const removed = removeInquiryItem(initial, "Buttons — initial range");
    assert.equal(removed.removedIndex, 1);
    assert.deepEqual(removed.items, ["Beads — initial range", "Snap — initial range"]);

    const restored = restoreInquiryItem(removed.items, "Buttons — initial range", removed.removedIndex);
    assert.deepEqual(restored, initial);
  });
});

describe("validateContactForm", () => {
  const validForm: ContactFormState = {
    name: "Alex Rivera",
    company: "Atelier Textiles",
    email: "alex@atelier.example",
    country: "Sri Lanka",
    category: "Buttons",
    quantity: "10,000 pcs",
    message: "Requesting antique brass button samples and production lead times.",
  };

  it("returns zero errors for valid input", () => {
    assert.deepEqual(validateContactForm(validForm), {});
  });

  it("returns specific field errors for missing or malformed fields", () => {
    const errors = validateContactForm({
      ...validForm,
      name: "",
      email: "invalid-email",
      message: "short",
    });
    assert.ok(errors.name);
    assert.ok(errors.email);
    assert.ok(errors.message);
    assert.equal(errors.company, undefined);
  });
});

describe("validateArtworkFile", () => {
  it("accepts allowed formats within size budget and rejects invalid files", () => {
    assert.equal(validateArtworkFile({ name: "tech-pack.pdf", size: 512_000 }), null);
    assert.ok(validateArtworkFile({ name: "script.exe", size: 1024 }));
    assert.ok(validateArtworkFile({ name: "huge.png", size: 15 * 1024 * 1024 }));
    assert.equal(formatFileSize(2048), "2.0 KB");
  });
});
