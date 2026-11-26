import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Maximize2,
  Rotate3d,
  ZoomIn,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  TRIM_PLACEMENT_ZONES,
  categories,
  type GarmentZoneGroup,
} from "../data/nhlData";
import { SafeImage } from "./SafeImage";

const ZONE_GROUPS: { id: GarmentZoneGroup; label: string }[] = [
  { id: "All", label: "All Zones" },
  { id: "Hood & Collar", label: "Hood & Collar" },
  { id: "Front & Placket", label: "Front & Placket" },
  { id: "Waist & Cargo", label: "Waist & Cargo" },
  { id: "Cuffs & Hem", label: "Cuffs & Hem" },
  { id: "Packaging", label: "Packaging" },
];

type TrimFinishPreview = {
  id: string;
  label: string;
  swatch: string;
  filter: string;
};

const FINISH_PREVIEWS: TrimFinishPreview[] = [
  {
    id: "natural",
    label: "Studio Original",
    swatch: "#6b665e",
    filter: "contrast(1.06) saturate(1.05)",
  },
  {
    id: "matt-black",
    label: "Matt Black",
    swatch: "#171615",
    filter: "grayscale(1) contrast(1.38) brightness(0.76)",
  },
  {
    id: "antique-brass",
    label: "Antique Brass",
    swatch: "#9c7a3e",
    filter: "sepia(0.75) saturate(1.35) contrast(1.08) brightness(0.95)",
  },
  {
    id: "nickel",
    label: "Brushed Nickel",
    swatch: "#b8bbc0",
    filter: "grayscale(1) contrast(1.18) brightness(1.12)",
  },
];

export function TrimPlacementLibrary() {
  // Default focus on Zip Pullers (18 / 19)
  const [selectedIdx, setSelectedIdx] = useState<number>(17);
  const [activeGroup, setActiveGroup] = useState<GarmentZoneGroup>("All");
  const [opticalZoom, setOpticalZoom] = useState<boolean>(false);

  // Interactive 3D Trim Cutout Turntable state
  const [tilt, setTilt] = useState<{ rx: number; ry: number; active: boolean; gx: number; gy: number }>({
    rx: 0,
    ry: 0,
    active: false,
    gx: 50,
    gy: 45,
  });
  const [autoOrbit3D, setAutoOrbit3D] = useState<boolean>(false);
  const [finishIdx, setFinishIdx] = useState<number>(0);

  const total = categories.length;
  const activeCat = categories[selectedIdx] ?? categories[0];
  const activeZone =
    TRIM_PLACEMENT_ZONES.find((z) => z.slug === activeCat.slug) ?? TRIM_PLACEMENT_ZONES[0];
  const activeNumber = String(selectedIdx + 1).padStart(2, "0");
  const activeFinish = FINISH_PREVIEWS[finishIdx] ?? FINISH_PREVIEWS[0];

  // Filter indices belonging to active garment zone tab
  const visibleItems = useMemo(() => {
    return categories
      .map((cat, idx) => ({
        cat,
        idx,
        zone: TRIM_PLACEMENT_ZONES.find((z) => z.slug === cat.slug),
      }))
      .filter(({ zone }) => activeGroup === "All" || zone?.group === activeGroup);
  }, [activeGroup]);

  const handleGroupChange = (group: GarmentZoneGroup) => {
    setActiveGroup(group);
    if (group !== "All" && activeZone.group !== group) {
      const firstMatchIdx = categories.findIndex((c) => {
        const z = TRIM_PLACEMENT_ZONES.find((item) => item.slug === c.slug);
        return z?.group === group;
      });
      if (firstMatchIdx >= 0) {
        setSelectedIdx(firstMatchIdx);
      }
    }
    if (group === "Packaging") {
      setOpticalZoom(false);
    }
  };

  const stepCategory = (delta: number) => {
    const nextIdx = (selectedIdx + delta + total) % total;
    setSelectedIdx(nextIdx);
    const nextZone = TRIM_PLACEMENT_ZONES.find((z) => z.slug === categories[nextIdx]?.slug);
    if (activeGroup !== "All" && nextZone && nextZone.group !== activeGroup) {
      setActiveGroup("All");
    }
  };

  // Smooth optical zoom pan transform toward active (x%, y%) coordinate
  const zoomTransform = useMemo(() => {
    if (!opticalZoom || activeZone.isPackaging || activeZone.x === undefined || activeZone.y === undefined) {
      return "translate3d(0%, 0%, 0) scale(1)";
    }
    const scale = 1.85;
    const rawTx = (50 - activeZone.x) * (scale - 1) * 0.54;
    const rawTy = (50 - activeZone.y) * (scale - 1) * 0.54;
    const tx = Math.max(-22, Math.min(22, rawTx));
    const ty = Math.max(-22, Math.min(22, rawTy));
    return `translate3d(${tx.toFixed(2)}%, ${ty.toFixed(2)}%, 0) scale(${scale})`;
  }, [opticalZoom, activeZone]);

  const coordX = activeZone.x !== undefined ? `${activeZone.x.toFixed(1)}%` : "EXT";
  const coordY = activeZone.y !== undefined ? `${activeZone.y.toFixed(1)}%` : "PKG";

  const handle3DPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
    const ny = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
    setTilt({
      rx: -ny * 24,
      ry: nx * 28,
      active: true,
      gx: (nx + 0.5) * 100,
      gy: (ny + 0.5) * 100,
    });
  };

  const handle3DPointerLeave = () => {
    setTilt({ rx: 0, ry: 0, active: false, gx: 50, gy: 45 });
  };

  return (
    <div className="nhl-atelier-wrap">
      {/* Header + Anatomy Zone Tabs */}
      <div className="nhl-atelier-head">
        <div>
          <span className="nhl-label">Trim Placement Atelier · 19 Categories</span>
          <h3 className="nhl-section-title">Garment anatomy &amp; trim engineering.</h3>
          <p className="nhl-section-sub">
            Switch garment zones to isolate pins, engage the optical zoom lens on any fastener, and
            inspect the interactive 3D trim specimen alongside live placement.
          </p>
        </div>

        <div className="nhl-atelier-head-actions">
          <Link to="/catalog" className="nhl-btn-hairline">
            Full catalog index
          </Link>
        </div>
      </div>

      {/* Garment Zone Segmented Filter Strip */}
      <div className="nhl-atelier-tabs" role="tablist" aria-label="Filter trims by garment anatomy zone">
        {ZONE_GROUPS.map((g) => {
          const isSelected = activeGroup === g.id;
          const count =
            g.id === "All"
              ? categories.length
              : TRIM_PLACEMENT_ZONES.filter((z) => z.group === g.id).length;
          return (
            <button
              key={g.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`nhl-atelier-tab ${isSelected ? "is-active" : ""}`}
              onClick={() => handleGroupChange(g.id)}
            >
              <span>{g.label}</span>
              <span className="nhl-atelier-tab-count tabular-nums">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Main Atelier Split: Interactive Optical Canvas (Left) + Dual-Lens Inspector & Zone Rail (Right) */}
      <div className="nhl-atelier-grid">
        {/* LEFT: Optical Zoom & Coordinate X-Ray Plinth */}
        <div className="nhl-xray-plinth nhl-parallax-mid">
          <div className="nhl-xray-chrome">
            <span className="nhl-label tabular-nums">
              {activeZone.group} · X {coordX} · Y {coordY}
            </span>

            {!activeZone.isPackaging && (
              <button
                type="button"
                className={`nhl-xray-lens-btn ${opticalZoom ? "is-active" : ""}`}
                aria-pressed={opticalZoom}
                onClick={() => setOpticalZoom((v) => !v)}
              >
                {opticalZoom ? (
                  <>
                    <Maximize2 size={13} strokeWidth={1.6} aria-hidden="true" />
                    <span>Full garment</span>
                  </>
                ) : (
                  <>
                    <ZoomIn size={13} strokeWidth={1.6} aria-hidden="true" />
                    <span>Inspect zoom 1.85×</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="nhl-xray-viewport">
            <div
              className={`nhl-xray-panlayer ${activeZone.isPackaging ? "is-dimmed" : ""}`}
              style={{ transform: zoomTransform }}
            >
              <SafeImage
                src="/assets/garment-explorer-trims.jpg"
                alt="Technical jacket and trouser flat-lay mapping all 18 attached garment trim zones"
                loading="eager"
                fallbackLabel="Garment trim map"
              />

              {/* Optical Swiss crosshair lines tracking active pin */}
              {!activeZone.isPackaging && activeZone.x !== undefined && activeZone.y !== undefined && (
                <>
                  <span
                    className="nhl-xray-axis nhl-xray-axis--x"
                    style={{ top: `${activeZone.y}%` }}
                    aria-hidden="true"
                  />
                  <span
                    className="nhl-xray-axis nhl-xray-axis--y"
                    style={{ left: `${activeZone.x}%` }}
                    aria-hidden="true"
                  />
                  <span
                    className="nhl-xray-reticle"
                    style={{ left: `${activeZone.x}%`, top: `${activeZone.y}%` }}
                    aria-hidden="true"
                  />
                </>
              )}

              {/* Garment Pin Nodes */}
              {categories.map((cat, idx) => {
                const zone = TRIM_PLACEMENT_ZONES.find((z) => z.slug === cat.slug);
                if (!zone || zone.isPackaging || zone.x === undefined || zone.y === undefined) {
                  return null;
                }
                const isSelected = idx === selectedIdx;
                const inZone = activeGroup === "All" || zone.group === activeGroup;

                return (
                  <button
                    key={cat.slug}
                    type="button"
                    className={`nhl-map-pin ${isSelected ? "is-active" : ""} ${
                      !inZone ? "is-muted" : ""
                    }`}
                    style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                    aria-label={`Inspect ${cat.name}: ${zone.zoneTitle}`}
                    aria-pressed={isSelected}
                    onClick={() => {
                      setSelectedIdx(idx);
                      if (activeGroup !== "All" && zone.group !== activeGroup) {
                        setActiveGroup(zone.group);
                      }
                    }}
                  >
                    <span className="tabular-nums">{idx + 1}</span>
                  </button>
                );
              })}
            </div>

            {/* Dedicated studio plinth reveal when Packaging / Paper Bags is selected */}
            {activeZone.isPackaging && (
              <div className="nhl-xray-packaging-stage">
                <div className="nhl-xray-packaging-img">
                  <SafeImage
                    key={`pkg-${activeCat.assetSlug}`}
                    src={`/assets/trims/${activeCat.assetSlug}.webp`}
                    alt={activeCat.name}
                    loading="eager"
                    fallbackLabel={activeCat.name}
                  />
                </div>
                <div className="nhl-xray-packaging-copy">
                  <span className="nhl-label">Export Packaging · Zone 12</span>
                  <h4>{activeCat.name}</h4>
                  <p>
                    Custom FSC kraft &amp; cotton-cord carriers finished alongside garment trim lots.
                  </p>
                </div>
              </div>
            )}

            {/* Quiet floating caption */}
            <div className="nhl-map-caption" aria-live="polite">
              <span className="nhl-map-caption-num tabular-nums">{activeNumber}</span>
              <div className="nhl-map-caption-text">
                <strong>{activeCat.name}</strong>
                <span>{activeZone.zoneTitle}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Dual-Lens Specimen Comparator + Clean Zone Strip */}
        <div className="nhl-atelier-side nhl-parallax-fg">
          <div className="nhl-atelier-pager">
            <span className="nhl-label">
              Specimen Lens · <span className="tabular-nums">{activeNumber} / {total}</span>
            </span>
            <div className="nhl-pair-arrows" aria-label="Cycle trim specification">
              <button
                type="button"
                className="nhl-pair-btn"
                aria-label="Previous trim category"
                onClick={() => stepCategory(-1)}
              >
                <ArrowLeft size={15} strokeWidth={1.35} aria-hidden="true" />
              </button>
              <span className="nhl-pair-divider" aria-hidden="true" />
              <button
                type="button"
                className="nhl-pair-btn"
                aria-label="Next trim category"
                onClick={() => stepCategory(1)}
              >
                <ArrowRight size={15} strokeWidth={1.35} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Dual-Lens Comparator: Real Garment Optical Crop vs Interactive 3D Trim Cutout */}
          <div className="nhl-dual-lens">
            <div className="nhl-dual-frame">
              <div className="nhl-dual-head">
                <span className="nhl-dual-caption">On-Garment Macro</span>
                <span className="nhl-dual-sub">{activeZone.isPackaging ? "Packaging" : "Live crop"}</span>
              </div>
              {!activeZone.isPackaging && activeZone.x !== undefined && activeZone.y !== undefined ? (
                <div
                  className="nhl-macro-crop"
                  role="img"
                  aria-label={`Magnified garment view showing ${activeCat.name}`}
                  style={{
                    backgroundImage: "url(/assets/garment-explorer-trims.jpg)",
                    backgroundPosition: `${activeZone.x}% ${activeZone.y}%`,
                  }}
                >
                  <span className="nhl-macro-crosshair" aria-hidden="true" />
                </div>
              ) : (
                <div className="nhl-macro-packaging">
                  <SafeImage
                    key={`macro-pkg-${activeCat.assetSlug}`}
                    src={`/assets/trims/${activeCat.assetSlug}.webp`}
                    alt={activeCat.name}
                    loading="eager"
                    fallbackLabel={activeCat.name}
                  />
                </div>
              )}
            </div>

            {/* INTERACTIVE 3D TRIM CUTOUT STAGE */}
            <div className="nhl-dual-frame nhl-dual-frame--3d">
              <div className="nhl-dual-head">
                <span className="nhl-dual-caption">3D Trim Cutout</span>
                <button
                  type="button"
                  className={`nhl-3d-orbit-btn ${autoOrbit3D ? "is-active" : ""}`}
                  aria-pressed={autoOrbit3D}
                  aria-label={autoOrbit3D ? "Stop 3D auto-orbit" : "Start 3D auto-orbit"}
                  onClick={() => setAutoOrbit3D((v) => !v)}
                >
                  <Rotate3d size={12} strokeWidth={1.6} aria-hidden="true" />
                  <span>{autoOrbit3D ? "3D On" : "3D"}</span>
                </button>
              </div>

              <div
                className={`nhl-cutout-box ${autoOrbit3D ? "is-orbiting" : ""} ${
                  tilt.active ? "is-tilting" : ""
                }`}
                onPointerMove={handle3DPointerMove}
                onPointerLeave={handle3DPointerLeave}
                role="region"
                aria-label={`Interactive 3D cutout preview for ${activeCat.name}`}
              >
                <div
                  className="nhl-cutout-3d-stage"
                  style={
                    tilt.active
                      ? {
                          transform: `perspective(680px) rotateX(${tilt.rx.toFixed(
                            2
                          )}deg) rotateY(${tilt.ry.toFixed(2)}deg) scale3d(1.08, 1.08, 1.08)`,
                        }
                      : undefined
                  }
                >
                  <SafeImage
                    key={`cutout-${activeCat.assetSlug}`}
                    src={`/assets/trims/${activeCat.assetSlug}.webp`}
                    alt={`${activeCat.name} 3D studio specimen`}
                    loading="eager"
                    style={{ filter: activeFinish.filter }}
                    fallbackLabel={activeCat.name}
                  />
                </div>
                <span
                  className="nhl-cutout-sheen"
                  aria-hidden="true"
                  style={{
                    background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,0.52), transparent 62%)`,
                  }}
                />
                <span className="nhl-cutout-pedestal" aria-hidden="true" />
              </div>

              {/* Plating / Finish Swatch Preview Bar */}
              <div className="nhl-3d-finish-bar" role="group" aria-label="Preview trim finish tone">
                <span className="nhl-3d-finish-name nhl-truncate">{activeFinish.label}</span>
                <div className="nhl-3d-swatches">
                  {FINISH_PREVIEWS.map((f, idx) => (
                    <button
                      key={f.id}
                      type="button"
                      className={`nhl-3d-swatch ${idx === finishIdx ? "is-active" : ""}`}
                      style={{ backgroundColor: f.swatch }}
                      title={f.label}
                      aria-label={`Preview ${f.label} finish`}
                      aria-pressed={idx === finishIdx}
                      onClick={() => setFinishIdx(idx)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Active Spec Sheet */}
          <div className="nhl-atelier-spec-card">
            <div className="nhl-placement-detail-top">
              <span className="nhl-label">
                Zone {activeNumber} · {activeZone.group}
              </span>
              <span className="nhl-placement-family">{activeCat.family}</span>
            </div>

            <h4 className="nhl-atelier-title">
              {activeCat.name} — {activeZone.zoneTitle}
            </h4>
            <p className="nhl-placement-detail-short">{activeCat.short}</p>

            <dl className="nhl-atelier-spec-table">
              <div>
                <dt>Material</dt>
                <dd>{activeCat.specs.material}</dd>
              </div>
              <div>
                <dt>Size Range</dt>
                <dd>{activeCat.specs.sizes}</dd>
              </div>
              <div>
                <dt>Finish</dt>
                <dd>{activeCat.specs.finish}</dd>
              </div>
            </dl>

            <div className="nhl-atelier-spec-foot">
              <Link to={`/catalog/${activeCat.slug}`} className="nhl-placement-explore">
                <span>Explore {activeCat.name} specs</span>
                <ArrowUpRight size={14} strokeWidth={1.6} aria-hidden="true" />
              </Link>
              <button
                type="button"
                className="nhl-link nhl-atelier-zoom-link"
                onClick={() => !activeZone.isPackaging && setOpticalZoom((v) => !v)}
                disabled={Boolean(activeZone.isPackaging)}
              >
                {opticalZoom ? "Reset camera" : "Zoom to pin"}
              </button>
            </div>
          </div>

          {/* Compact Zone Selector Index */}
          <div className="nhl-atelier-index-wrap">
            <ul className="nhl-atelier-index" aria-label="Trim categories in selected garment zone">
              {visibleItems.map(({ cat, idx }) => {
                const isSelected = idx === selectedIdx;
                const numLabel = String(idx + 1).padStart(2, "0");
                return (
                  <li key={cat.slug}>
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      className={`nhl-atelier-chip ${isSelected ? "is-active" : ""}`}
                      onClick={() => setSelectedIdx(idx)}
                    >
                      <span className="nhl-atelier-chip-num tabular-nums">{numLabel}</span>
                      <span className="nhl-truncate">{cat.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
