import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  HEADER_SCROLL_THRESHOLD,
  isHomeTransparentHeader,
  normalizeRoutePath,
} from "./headerState.ts";

describe("headerState transparent vs solid scroll logic", () => {
  it("normalizes trailing slashes consistently", () => {
    assert.equal(normalizeRoutePath("/"), "/");
    assert.equal(normalizeRoutePath("/catalog/"), "/catalog");
    assert.equal(normalizeRoutePath(""), "/");
  });

  it("stays transparent at top of home screen when overlays are closed", () => {
    assert.equal(
      isHomeTransparentHeader({ location: "/", scrollY: 0, isOverlayOpen: false }),
      true
    );
    assert.equal(
      isHomeTransparentHeader({
        location: "/",
        scrollY: HEADER_SCROLL_THRESHOLD,
        isOverlayOpen: false,
      }),
      true
    );
  });

  it("switches to solid dark header once scrolled past threshold or when menu opens", () => {
    assert.equal(
      isHomeTransparentHeader({
        location: "/",
        scrollY: HEADER_SCROLL_THRESHOLD + 1,
        isOverlayOpen: false,
      }),
      false
    );
    assert.equal(
      isHomeTransparentHeader({ location: "/", scrollY: 0, isOverlayOpen: true }),
      false
    );
  });

  it("always uses solid dark header on non-home pages", () => {
    assert.equal(
      isHomeTransparentHeader({ location: "/catalog/", scrollY: 0, isOverlayOpen: false }),
      false
    );
    assert.equal(
      isHomeTransparentHeader({ location: "/certifications/", scrollY: 0, isOverlayOpen: false }),
      false
    );
  });
});
