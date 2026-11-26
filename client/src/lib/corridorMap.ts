export interface GeoCoordinate {
  lat: number;
  lon: number;
}

export interface CorridorHub {
  id: "ningbo" | "colombo";
  city: string;
  country: string;
  role: string;
  addressNote: string;
  coord: GeoCoordinate;
}

export interface ProjectedPoint {
  x: number;
  y: number;
}

export interface MapDot extends ProjectedPoint {
  isCorridorZone: boolean;
}

export const MAP_WIDTH = 720;
export const MAP_HEIGHT = 360;

const LON_MIN = -140;
const LON_MAX = 165;
const LAT_MAX = 74;
const LAT_MIN = -54;

export const corridorHubs: CorridorHub[] = [
  {
    id: "ningbo",
    city: "Ningbo",
    country: "China",
    role: "Headquarters",
    addressNote: "Trim manufacturing & sourcing hub",
    coord: { lat: 29.87, lon: 121.55 },
  },
  {
    id: "colombo",
    city: "Colombo",
    country: "Sri Lanka",
    role: "Regional Office",
    addressNote: "Kotte regional coordination & South Asia desk",
    coord: { lat: 6.93, lon: 79.86 },
  },
];

// Simplified continent & major landmass boundary polygons [lon, lat]
const LANDMASS_POLYGONS: Array<Array<[number, number]>> = [
  // North America
  [
    [-138, 60], [-134, 68], [-115, 70], [-95, 69], [-78, 63], [-64, 58],
    [-55, 50], [-66, 44], [-75, 36], [-81, 25], [-84, 30], [-90, 29],
    [-97, 26], [-96, 19], [-88, 21], [-86, 13], [-79, 8], [-84, 9],
    [-94, 15], [-105, 20], [-112, 28], [-117, 32], [-124, 41], [-125, 49],
    [-133, 55],
  ],
  // Greenland
  [
    [-54, 68], [-44, 73], [-22, 73], [-19, 68], [-34, 64], [-44, 60], [-51, 63],
  ],
  // South America
  [
    [-79, 10], [-70, 12], [-60, 8], [-50, 1], [-36, -6], [-39, -15],
    [-42, -23], [-52, -32], [-58, -38], [-66, -44], [-68, -53], [-74, -52],
    [-73, -38], [-71, -20], [-81, -5],
  ],
  // Europe (Western, Central, Southern)
  [
    [-9, 37], [-9, 43], [-2, 44], [-5, 48], [2, 51], [8, 55], [14, 54],
    [22, 55], [27, 60], [32, 60], [32, 46], [28, 41], [23, 37], [16, 38],
    [12, 43], [7, 44], [3, 42], [-5, 36],
  ],
  // Great Britain & Ireland
  [
    [-6, 50], [-5, 58], [-1, 57], [1, 52],
  ],
  // Scandinavia
  [
    [5, 59], [10, 65], [19, 70], [29, 71], [28, 65], [21, 61], [17, 56], [11, 56],
  ],
  // Africa
  [
    [-17, 15], [-13, 28], [-6, 36], [10, 37], [12, 33], [24, 32], [33, 31],
    [40, 20], [43, 12], [51, 11], [46, 2], [40, -10], [36, -24], [28, -33],
    [18, -34], [14, -22], [12, -6], [8, 4], [2, 6], [-8, 5], [-15, 11],
  ],
  // Madagascar
  [
    [49, -12], [50, -18], [46, -25], [44, -22], [45, -15],
  ],
  // Eurasia / Asia Mainland (Arabia, India, China, Korea, Siberia)
  [
    [28, 41], [41, 42], [48, 46], [52, 54], [62, 66], [90, 72], [120, 72],
    [152, 69], [164, 62], [160, 54], [140, 52], [135, 43], [129, 36],
    [126, 38], [122, 40], [118, 38], [122, 33], [121, 28], [114, 22],
    [108, 20], [109, 12], [103, 2], [100, 7], [97, 15], [90, 22],
    [82, 16], [78, 8], [73, 19], [68, 24], [58, 25], [56, 22],
    [59, 21], [52, 15], [44, 13], [38, 22], [35, 29], [35, 36],
  ],
  // Sri Lanka (distinct island south-east of India)
  [
    [79.6, 9.7], [81.8, 7.6], [81.2, 6.1], [79.8, 6.2], [79.5, 8.2],
  ],
  // Japan Archipelago
  [
    [130, 31], [135, 34], [140, 36], [144, 43], [141, 45], [139, 39], [132, 34],
  ],
  // Maritime SE Asia: Sumatra, Java, Borneo, Philippines
  [
    [95, 5], [104, -1], [105, -6], [114, -8], [104, -7], [98, 1],
  ],
  [
    [109, 1], [117, 6], [118, -2], [111, -3],
  ],
  [
    [120, 18], [123, 14], [126, 7], [122, 8], [119, 14],
  ],
  // Australia
  [
    [114, -22], [123, -17], [131, -12], [137, -15], [142, -11], [150, -21],
    [153, -29], [149, -37], [139, -36], [130, -32], [122, -34], [115, -34],
    [114, -26],
  ],
  // New Zealand (visible eastern edge)
  [
    [164, -46], [164, -40], [165, -37], [163, -44],
  ],
];

export function projectCoordinate(coord: GeoCoordinate): ProjectedPoint {
  const x = ((coord.lon - LON_MIN) / (LON_MAX - LON_MIN)) * MAP_WIDTH;
  const y = ((LAT_MAX - coord.lat) / (LAT_MAX - LAT_MIN)) * MAP_HEIGHT;
  return {
    x: Number(x.toFixed(2)),
    y: Number(y.toFixed(2)),
  };
}

export function pointInPolygon(lon: number, lat: number, polygon: Array<[number, number]>): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];
    const intersects =
      yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi + 1e-12) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

export function isLandCoordinate(lon: number, lat: number): boolean {
  return LANDMASS_POLYGONS.some((poly) => pointInPolygon(lon, lat, poly));
}

export function isCorridorHighlightZone(lon: number, lat: number): boolean {
  const inEastChinaHub = lon >= 106 && lon <= 125 && lat >= 20 && lat <= 38;
  const inSouthAsiaSriLanka = lon >= 74 && lon <= 86 && lat >= 5 && lat <= 18;
  const inMaritimeSEAsia = lon >= 97 && lon <= 116 && lat >= -4 && lat <= 18;
  return inEastChinaHub || inSouthAsiaSriLanka || inMaritimeSEAsia;
}

export function generateWorldDots(stepPx = 6.2): MapDot[] {
  const dots: MapDot[] = [];
  for (let py = 12; py <= MAP_HEIGHT - 12; py += stepPx) {
    for (let px = 10; px <= MAP_WIDTH - 10; px += stepPx) {
      const lon = LON_MIN + (px / MAP_WIDTH) * (LON_MAX - LON_MIN);
      const lat = LAT_MAX - (py / MAP_HEIGHT) * (LAT_MAX - LAT_MIN);
      if (isLandCoordinate(lon, lat)) {
        dots.push({
          x: Number(px.toFixed(1)),
          y: Number(py.toFixed(1)),
          isCorridorZone: isCorridorHighlightZone(lon, lat),
        });
      }
    }
  }
  return dots;
}

export function getTradeCorridorPath(): {
  ningbo: ProjectedPoint;
  colombo: ProjectedPoint;
  control: ProjectedPoint;
  pathD: string;
} {
  const ningbo = projectCoordinate(corridorHubs[0].coord);
  const colombo = projectCoordinate(corridorHubs[1].coord);
  // Arc gracefully south over the South China Sea & Indian Ocean maritime route
  const control = {
    x: Number(((ningbo.x + colombo.x) / 2 + 18).toFixed(2)),
    y: Number((Math.max(ningbo.y, colombo.y) + 38).toFixed(2)),
  };
  return {
    ningbo,
    colombo,
    control,
    pathD: `M ${ningbo.x} ${ningbo.y} Q ${control.x} ${control.y} ${colombo.x} ${colombo.y}`,
  };
}

export function getCorridorMidpoint(): ProjectedPoint {
  const { ningbo, control, colombo } = getTradeCorridorPath();
  // Quadratic Bezier evaluation at t = 0.5
  const x = 0.25 * ningbo.x + 0.5 * control.x + 0.25 * colombo.x;
  const y = 0.25 * ningbo.y + 0.5 * control.y + 0.25 * colombo.y;
  return {
    x: Number(x.toFixed(2)),
    y: Number(y.toFixed(2)),
  };
}

export const MAP_LATITUDE_LINES = [60, 30, 0, -30].map((lat) => ({
  lat,
  y: projectCoordinate({ lat, lon: 0 }).y,
}));

export const MAP_LONGITUDE_LINES = [-120, -60, 0, 60, 120].map((lon) => ({
  lon,
  x: projectCoordinate({ lat: 0, lon }).x,
}));

export const WORLD_DOTS = generateWorldDots(6.2);
