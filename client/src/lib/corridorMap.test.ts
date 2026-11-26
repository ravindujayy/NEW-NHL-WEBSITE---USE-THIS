import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  corridorHubs,
  generateWorldDots,
  getCorridorMidpoint,
  getTradeCorridorPath,
  isLandCoordinate,
  MAP_HEIGHT,
  MAP_LATITUDE_LINES,
  MAP_LONGITUDE_LINES,
  MAP_WIDTH,
  projectCoordinate,
} from "./corridorMap.ts";

describe("corridorMap Ningbo to Colombo projection", () => {
  it("projects Ningbo and Colombo cleanly within SVG viewport bounds", () => {
    const ningbo = projectCoordinate(corridorHubs[0].coord);
    const colombo = projectCoordinate(corridorHubs[1].coord);

    assert.ok(ningbo.x > colombo.x, "Ningbo (east) should appear to the right of Colombo (south-west)");
    assert.ok(ningbo.y < colombo.y, "Ningbo (north) should appear above Colombo (south)");
    assert.ok(ningbo.x > 0 && ningbo.x < MAP_WIDTH);
    assert.ok(colombo.x > 0 && colombo.x < MAP_WIDTH);
    assert.ok(ningbo.y > 0 && ningbo.y < MAP_HEIGHT);
    assert.ok(colombo.y > 0 && colombo.y < MAP_HEIGHT);
  });

  it("identifies landmass points and rejects open Pacific Ocean coordinates", () => {
    assert.equal(isLandCoordinate(120, 30), true, "Eastern China should be classified as land");
    assert.equal(isLandCoordinate(80.5, 7.5), true, "Sri Lanka should be classified as land");
    assert.equal(isLandCoordinate(-135, 0), false, "Mid-Pacific should remain ocean");
  });

  it("generates dotted map points, graticule lines, and corridor midpoint", () => {
    const dots = generateWorldDots(6.2);
    assert.ok(dots.length > 700, `Expected dense halftone landmass dots, got ${dots.length}`);
    assert.ok(dots.some((dot) => dot.isCorridorZone), "Should highlight China/Sri Lanka corridor zone dots");

    const route = getTradeCorridorPath();
    assert.ok(route.pathD.startsWith("M "), "Should emit valid SVG quadratic bezier path");
    assert.ok(route.pathD.includes(" Q "), "Should include smooth curve control point");

    const mid = getCorridorMidpoint();
    assert.ok(mid.x > route.colombo.x && mid.x < route.ningbo.x);
    assert.ok(mid.y > route.ningbo.y);
    assert.equal(MAP_LATITUDE_LINES.length, 4);
    assert.equal(MAP_LONGITUDE_LINES.length, 5);
  });
});
