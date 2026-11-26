import { ArrowLeft, ArrowRight, Check, Eye, Plus, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useInquiry } from "../context/InquiryContext";
import {
  FINISH_OPTIONS,
  RUNWAY_COPY,
  RUNWAY_LOOKS,
  SIZE_OPTIONS,
  type RunwayLook,
} from "../data/nhlData";
import { SafeImage } from "./SafeImage";

/* ==================== 1. DATA & TYPES ==================== */
const TOTAL_BODIES = 12; // 6 originals + 6 clones so the ring stays populated
const TOTAL_LOOKS = RUNWAY_LOOKS.length; // 6
const STEP_RAD = (Math.PI * 2) / TOTAL_BODIES; // 30 degrees
const MOBILE_BREAKPOINT = 750;

type SpecSelection = {
  finish: string;
  size: string;
};

type CursorMode = "drag" | "view" | "dot";

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function wrapRad(rad: number) {
  let a = rad % (Math.PI * 2);
  if (a > Math.PI) a -= Math.PI * 2;
  if (a < -Math.PI) a += Math.PI * 2;
  return a;
}

function modLook(index: number) {
  return ((index % TOTAL_LOOKS) + TOTAL_LOOKS) % TOTAL_LOOKS;
}

/* ==================== 2. RING MATHS & FIGURE BOUNDS ==================== */
interface FigureBounds {
  topRatio: number;
  bottomRatio: number;
}

const DEFAULT_BOUNDS: FigureBounds = { topRatio: 0.06, bottomRatio: 0.95 };
const boundsCache = new Map<string, FigureBounds>();

function detectFigureBounds(img: HTMLImageElement, src: string, onDone: () => void) {
  if (boundsCache.has(src)) return;
  try {
    const w = Math.min(img.naturalWidth || 0, 180);
    const h = Math.min(img.naturalHeight || 0, 320);
    if (!w || !h) {
      boundsCache.set(src, DEFAULT_BOUNDS);
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      boundsCache.set(src, DEFAULT_BOUNDS);
      return;
    }
    ctx.drawImage(img, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;

    let highestRow = Math.floor(h * 0.04);
    topScan: for (let y = 0; y < Math.floor(h * 0.4); y++) {
      for (let x = 0; x < w; x += 2) {
        if (data[(y * w + x) * 4 + 3] > 95) {
          highestRow = y;
          break topScan;
        }
      }
    }

    let lowestRow = Math.floor(h * 0.96);
    bottomScan: for (let y = h - 1; y >= Math.floor(h * 0.5); y--) {
      for (let x = 0; x < w; x += 2) {
        if (data[(y * w + x) * 4 + 3] > 135) {
          lowestRow = y;
          break bottomScan;
        }
      }
    }

    const topRatio = clamp(highestRow / h, 0.02, 0.25);
    const bottomRatio = clamp(lowestRow / h, 0.78, 0.99);
    boundsCache.set(src, { topRatio, bottomRatio });
    onDone();
  } catch {
    boundsCache.set(src, DEFAULT_BOUNDS);
  }
}

interface BodyPose {
  x: number;
  feet: number;
  scale: number;
  blur: number;
  opacity: number;
  zIndex: number;
  visible: boolean;
  figW: number;
  figH: number;
  footOffsetPx: number;
}

function computeBodyPose(
  bodyIdx: number,
  cur: number,
  W: number,
  H: number,
  isMobile: boolean,
  bounds: FigureBounds
): BodyPose {
  const visibleSpan = clamp(bounds.bottomRatio - bounds.topRatio, 0.56, 0.96);
  const emptyBottom = clamp(1 - bounds.bottomRatio, 0, 0.22);

  if (isMobile) {
    const diff = wrapRad((bodyIdx - cur) * STEP_RAD) / STEP_RAD;
    const topMargin = 14;
    const baseFloor = H - 18;
    const availH = Math.max(160, baseFloor - topMargin);
    const figH = clamp((availH * 0.88) / visibleSpan, 200, 520);
    const figW = figH * (9 / 16);

    if (diff < -1.15 || diff > 2.35) {
      return {
        x: 0,
        feet: baseFloor,
        scale: 0.7,
        blur: 4,
        opacity: 0,
        zIndex: 1,
        visible: false,
        figW,
        figH,
        footOffsetPx: figH * emptyBottom,
      };
    }

    let x: number;
    let feet: number;
    let scale: number;
    let blur: number;
    let opacity: number;

    if (diff < 0) {
      const t = -diff;
      x = W * (0.38 - t * 0.42);
      feet = baseFloor + t * 18;
      scale = 1 + t * 0.08;
      blur = t * 3.5;
      opacity = clamp(1 - t * 1.1, 0, 1);
    } else {
      x = W * (0.38 + diff * 0.23);
      feet = baseFloor - diff * clamp(H * 0.085, 20, 42);
      scale = Math.max(0.64, 1 - diff * 0.16);
      blur = diff <= 0.1 ? 0 : Math.min(diff * 1.6, 3.6);
      opacity = diff <= 1.8 ? 1 : clamp(1 - (diff - 1.8) * 1.8, 0, 1);
    }

    return {
      x,
      feet,
      scale,
      blur,
      opacity,
      zIndex: Math.round((20 - Math.abs(diff)) * 50),
      visible: opacity > 0.005,
      figW,
      figH,
      footOffsetPx: figH * scale * emptyBottom,
    };
  }

  // Desktop & tablet (>=750px) 3D ring maths with head-to-foot normalization
  const cx = 0.5 * W;
  const R = 0.52 * W;
  const P = 1.72 * W;
  const topMargin = Math.max(18, H * 0.045);
  const floor = H - Math.max(26, H * 0.055);
  const horizon = Math.max(topMargin + 26, 0.29 * H);
  const availH = Math.max(180, floor - topMargin);

  const phi = wrapRad((bodyIdx - cur) * STEP_RAD);
  const z = R * (1 - Math.cos(phi));
  const persp = P / (P + z);
  const slots = Math.abs(phi) / STEP_RAD;
  const peakBoost = 1.055;
  const scale = persp * (1 + (peakBoost - 1) * clamp(1 - slots, 0, 1));
  const x = cx + R * Math.sin(phi) * persp;
  const feet = horizon + (floor - horizon) * persp;
  const blur = slots <= 1 ? 1.6 * slots : Math.min(1.6 + (slots - 1) * 1.9, 6);
  const opacity = clamp((Math.cos(phi) + 0.55) / 0.3, 0, 1);
  const zIndex = Math.round(scale * 1000);

  const figH = clamp((availH * 0.89) / (visibleSpan * peakBoost), 210, 760);
  const figW = figH * (9 / 16);
  const margin = figW * scale * 0.85;
  const visible = opacity > 0.005 && x >= -margin && x <= W + margin;

  return {
    x,
    feet,
    scale,
    blur,
    opacity,
    zIndex,
    visible,
    figW,
    figH,
    footOffsetPx: figH * scale * emptyBottom,
  };
}

export function RunwayHero() {
  const { entries, addEntry, addBundle } = useInquiry();

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const bodyRefs = useRef<Array<HTMLDivElement | null>>([]);
  const shadowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const heroBtnRef = useRef<HTMLButtonElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Record<string, HTMLLIElement | null>>({});

  const [reducedMotion, setReducedMotion] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false
  );
  const [stageSize, setStageSize] = useState({ w: 1200, h: 680 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAtRest] = useState(true);
  const [introReady, setIntroReady] = useState(true);

  // Unified "In this garment" box popup state — hidden unless user clicks a garment dummy
  const [popupOpen, setPopupOpen] = useState(false);

  // Spec Picker state inside the garment popup
  const [openPickerTrimId, setOpenPickerTrimId] = useState<string | null>(null);
  const [pendingBundleTrimIds, setPendingBundleTrimIds] = useState<string[]>([]);
  const [selections, setSelections] = useState<Record<string, Partial<SpecSelection>>>({});
  const [hotTrimId, setHotTrimId] = useState<string | null>(null);
  const [loadingTrimId, setLoadingTrimId] = useState<string | null>(null);
  const [justAddedTrimId, setJustAddedTrimId] = useState<string | null>(null);
  const [bundleLoading, setBundleLoading] = useState(false);
  const [bundleGlow, setBundleGlow] = useState(false);
  const [bundleMessage, setBundleMessage] = useState<string | null>(null);

  // Custom cursor state
  const [cursorMode, setCursorMode] = useState<CursorMode>("dot");
  const [cursorVisible, setCursorVisible] = useState(false);
  const cursorTargetRef = useRef({ x: 0, y: 0 });
  const cursorPosRef = useRef({ x: 0, y: 0 });

  // Static ring positioning — all models stay completely still in their existing 3D positions
  const physicsRef = useRef({
    cur: 0,
    target: 0,
    vel: 0,
    settled: true,
  });
  const stageSizeRef = useRef(stageSize);
  stageSizeRef.current = stageSize;
  const isMobileRef = useRef(isMobile);
  isMobileRef.current = isMobile;
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  const activeLook: RunwayLook = RUNWAY_LOOKS[activeIndex];

  useEffect(() => {
    setIntroReady(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const updateBreakpoint = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);

    const stage = stageRef.current;
    if (!stage) return () => window.removeEventListener("resize", updateBreakpoint);

    const ro = new ResizeObserver((entriesList) => {
      for (const entry of entriesList) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setStageSize({ w: width, h: height });
        }
      }
    });
    ro.observe(stage);
    return () => {
      window.removeEventListener("resize", updateBreakpoint);
      ro.disconnect();
    };
  }, []);

  /* ==================== 3. STATIC 3D STAGE POSITIONING ==================== */
  const applyStagePositions = useCallback(() => {
    const { w: W, h: H } = stageSizeRef.current;
    const mobile = isMobileRef.current;
    const { cur, target, settled } = physicsRef.current;
    const frontBodyIndex = ((Math.round(target) % TOTAL_BODIES) + TOTAL_BODIES) % TOTAL_BODIES;

    for (let a = 0; a < TOTAL_BODIES; a++) {
      const el = bodyRefs.current[a];
      const shadowEl = shadowRefs.current[a];
      const look = RUNWAY_LOOKS[a % TOTAL_LOOKS];
      const imgSrc = mobile ? look.imageMobile : look.image;
      const bounds = boundsCache.get(imgSrc) ?? DEFAULT_BOUNDS;
      const pose = computeBodyPose(a, cur, W, H, mobile, bounds);

      if (el) {
        if (!pose.visible) {
          el.style.opacity = "0";
          el.style.visibility = "hidden";
          el.style.pointerEvents = "none";
        } else {
          const isReplacedByHero = settled && !popupOpen && a === frontBodyIndex;
          el.style.visibility = isReplacedByHero ? "hidden" : "visible";
          el.style.pointerEvents = isReplacedByHero ? "none" : "auto";
          el.style.width = `${pose.figW}px`;
          el.style.height = `${pose.figH}px`;
          const tx = pose.x - pose.figW / 2;
          const ty = pose.feet - pose.figH + pose.footOffsetPx;
          el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${pose.scale.toFixed(4)})`;
          el.style.transformOrigin = "50% 100%";
          el.style.filter = pose.blur > 0.05 ? `blur(${pose.blur.toFixed(2)}px)` : "none";
          el.style.opacity = pose.opacity.toFixed(3);
          el.style.zIndex = String(pose.zIndex);
        }
      }

      if (shadowEl) {
        if (!pose.visible) {
          shadowEl.style.opacity = "0";
        } else {
          const sw = pose.figW * pose.scale * 0.56;
          const sh = Math.max(9, sw * 0.11);
          shadowEl.style.width = `${sw.toFixed(1)}px`;
          shadowEl.style.height = `${sh.toFixed(1)}px`;
          shadowEl.style.transform = `translate3d(${(pose.x - sw / 2).toFixed(1)}px, ${(pose.feet - sh / 2).toFixed(1)}px, 0)`;
          shadowEl.style.opacity = (pose.opacity * 0.72).toFixed(3);
          shadowEl.style.zIndex = String(Math.max(1, pose.zIndex - 1));
        }
      }
    }

    if (heroBtnRef.current) {
      const look = RUNWAY_LOOKS[modLook(Math.round(target))];
      const imgSrc = mobile ? look.imageMobile : look.image;
      const bounds = boundsCache.get(imgSrc) ?? DEFAULT_BOUNDS;
      const pose = computeBodyPose(frontBodyIndex, cur, W, H, mobile, bounds);
      const tx = pose.x - pose.figW / 2;
      const ty = pose.feet - pose.figH + pose.footOffsetPx;
      heroBtnRef.current.style.width = `${pose.figW}px`;
      heroBtnRef.current.style.height = `${pose.figH}px`;
      heroBtnRef.current.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${pose.scale.toFixed(4)})`;
      heroBtnRef.current.style.transformOrigin = "50% 100%";
      heroBtnRef.current.style.zIndex = String(pose.zIndex + 2);
    }
  }, [popupOpen]);

  useEffect(() => {
    applyStagePositions();
  }, [applyStagePositions, stageSize, isMobile]);

  useEffect(() => {
    if (isMobile || !cursorVisible) return;
    let rafId = 0;
    const trackCursor = () => {
      if (cursorRef.current) {
        const cp = cursorPosRef.current;
        const ct = cursorTargetRef.current;
        const lerp = reducedMotionRef.current ? 1 : 0.22;
        cp.x += (ct.x - cp.x) * lerp;
        cp.y += (ct.y - cp.y) * lerp;
        cursorRef.current.style.transform = `translate3d(${cp.x.toFixed(2)}px, ${cp.y.toFixed(2)}px, 0)`;
      }
      rafId = requestAnimationFrame(trackCursor);
    };
    rafId = requestAnimationFrame(trackCursor);
    return () => cancelAnimationFrame(rafId);
  }, [isMobile, cursorVisible]);

  // Switch active garment cleanly inside the modal without moving the still stage models
  const switchPopupLook = useCallback((nextIdx: number) => {
    const clamped = modLook(nextIdx);
    setActiveIndex(clamped);
    setOpenPickerTrimId(null);
    setPendingBundleTrimIds([]);
    setBundleMessage(null);
    setHotTrimId(RUNWAY_LOOKS[clamped]?.trims[0]?.trimId ?? null);
  }, []);

  const stepRelative = useCallback(
    (delta: number) => {
      setActiveIndex((prev) => {
        const nextIdx = modLook(prev + delta);
        setOpenPickerTrimId(null);
        setPendingBundleTrimIds([]);
        setBundleMessage(null);
        setHotTrimId(RUNWAY_LOOKS[nextIdx]?.trims[0]?.trimId ?? null);
        return nextIdx;
      });
    },
    []
  );

  const onStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (stageRef.current) {
      const rect = stageRef.current.getBoundingClientRect();
      cursorTargetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      if (!cursorVisible) {
        cursorPosRef.current = { ...cursorTargetRef.current };
        setCursorVisible(true);
      }
    }
  };

  /* ==================== 5. GARMENT BOX POPUP OPEN/CLOSE ==================== */
  const openClickedGarmentBox = useCallback(
    (lookIdx: number) => {
      switchPopupLook(lookIdx);
      setPopupOpen(true);
    },
    [switchPopupLook]
  );

  useEffect(() => {
    if (!popupOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPopupOpen(false);
        heroBtnRef.current?.focus();
      } else if (e.key === "ArrowRight") {
        stepRelative(1);
      } else if (e.key === "ArrowLeft") {
        stepRelative(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [popupOpen, stepRelative]);

  /* ==================== 6. PANEL & SPEC PICKER ==================== */
  const markPanelInteraction = useCallback(() => {
    // Keep hero still; user inspects trims inside popup
  }, []);

  const handleTogglePicker = (trimId: string) => {
    markPanelInteraction();
    setOpenPickerTrimId((prev) => (prev === trimId ? null : trimId));
    setHotTrimId(trimId);
    setBundleMessage(null);
  };

  const handleSelectOption = (trimId: string, field: keyof SpecSelection, value: string) => {
    markPanelInteraction();
    setSelections((prev) => ({
      ...prev,
      [trimId]: { ...prev[trimId], [field]: value },
    }));
    setPendingBundleTrimIds((prev) => prev.filter((id) => id !== trimId));
    setBundleMessage(null);
  };

  const handleConfirmTrim = (trim: RunwayLook["trims"][number]) => {
    markPanelInteraction();
    const sel = selections[trim.trimId];
    if (!sel?.finish || !sel?.size) return;

    setLoadingTrimId(trim.trimId);
    setTimeout(() => {
      addEntry({
        trimId: trim.trimId,
        trimName: trim.name,
        categorySlug: trim.categorySlug,
        image: trim.image,
        finish: sel.finish!,
        size: sel.size!,
      });
      setLoadingTrimId(null);
      setJustAddedTrimId(trim.trimId);
      setOpenPickerTrimId(null);
      if ("vibrate" in navigator) {
        try {
          navigator.vibrate(12);
        } catch {
          // ignore
        }
      }
      setTimeout(() => {
        setJustAddedTrimId((cur) => (cur === trim.trimId ? null : cur));
      }, 1500);
    }, 180);
  };

  const allThreeInInquiry = useMemo(
    () =>
      activeLook.trims.every((trim) =>
        entries.some((entry) => entry.trimId === trim.trimId)
      ),
    [activeLook.trims, entries]
  );

  const handleAddFullSet = () => {
    markPanelInteraction();
    const missing = activeLook.trims.filter((trim) => {
      const sel = selections[trim.trimId];
      return !sel?.finish || !sel?.size;
    });

    if (missing.length > 0) {
      setPendingBundleTrimIds(missing.map((t) => t.trimId));
      setOpenPickerTrimId(missing[0].trimId);
      setHotTrimId(missing[0].trimId);
      setBundleMessage(
        `${RUNWAY_COPY.bundlePendingPrefix} ${missing.map((t) => t.name).join(", ")}`
      );
      return;
    }

    setBundleLoading(true);
    setTimeout(() => {
      addBundle(
        activeLook.trims.map((trim) => ({
          trimId: trim.trimId,
          trimName: trim.name,
          categorySlug: trim.categorySlug,
          image: trim.image,
          finish: selections[trim.trimId]!.finish!,
          size: selections[trim.trimId]!.size!,
        }))
      );
      setBundleLoading(false);
      setBundleGlow(true);
      setBundleMessage(null);
      setPendingBundleTrimIds([]);
      setTimeout(() => setBundleGlow(false), 1400);
    }, 220);
  };

  const handlePinClick = (trimId: string) => {
    markPanelInteraction();
    setHotTrimId(trimId);
    setOpenPickerTrimId(trimId);
    const rowEl = rowRefs.current[trimId];
    if (rowEl) {
      rowEl.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "nearest" });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="runway"
      className={`nhl-runway ${introReady ? "is-introduced" : ""}`}
      aria-label="Trim the Look interactive garment runway"
    >
      {/* FULL-WIDTH HERO RUNWAY STAGE */}
      <div className="nhl-runway-left">
        {/* STAGE */}
        <div
          ref={stageRef}
          className="nhl-stage"
          role="region"
          aria-label="Garment Runway"
          onPointerMove={onStagePointerMove}
          onPointerLeave={() => setCursorVisible(false)}
        >
          {/* Architectural Cyclorama Horizon & Floor */}
          <div className="nhl-stage-horizon" aria-hidden="true" />
          <div className="nhl-stage-floor" aria-hidden="true" />

          {/* Oversized Editorial Headline behind still models */}
          <div className="nhl-stage-statement nhl-stage-statement--back">
            <h1 className="nhl-stage-statement-text">
              <span>The finishing</span>
              <span>detail, made</span>
              <span>easier.</span>
            </h1>
          </div>

          {/* Foreground masking contour so occluded letters remain crisp & readable over dark garments */}
          <div
            className="nhl-stage-statement nhl-stage-statement--contour"
            aria-hidden="true"
          >
            <p className="nhl-stage-statement-text">
              <span>The finishing</span>
              <span>detail, made</span>
              <span>easier.</span>
            </p>
          </div>

          {/* Contact shadows (N=12) */}
          {Array.from({ length: TOTAL_BODIES }).map((_, a) => (
            <div
              key={`shadow-${a}`}
              ref={(el) => {
                shadowRefs.current[a] = el;
              }}
              className="nhl-figure-shadow"
              aria-hidden="true"
            />
          ))}

          {/* 3D Ring Bodies (N=12) — still models; clicking any model opens that garment's trim box */}
          {Array.from({ length: TOTAL_BODIES }).map((_, a) => {
            const lookIdx = a % TOTAL_LOOKS;
            const look = RUNWAY_LOOKS[lookIdx];
            const src = isMobile ? look.imageMobile : look.image;
            const isClone = a >= TOTAL_LOOKS;
            return (
              <div
                key={`body-${a}`}
                ref={(el) => {
                  bodyRefs.current[a] = el;
                }}
                className="nhl-ring-body"
                role="button"
                tabIndex={-1}
                aria-label={`Inspect ${look.code}: ${look.name} and its trims`}
                onPointerEnter={() => setCursorMode("view")}
                onPointerLeave={() => setCursorMode("dot")}
                onClick={(e) => {
                  e.stopPropagation();
                  openClickedGarmentBox(lookIdx);
                }}
              >
                <img
                  src={src}
                  alt={look.name}
                  loading={isClone ? "lazy" : "eager"}
                  draggable={false}
                  onLoad={(e) =>
                    detectFigureBounds(e.currentTarget, src, () => applyStagePositions())
                  }
                />
              </div>
            );
          })}

          {/* Front Hero Swap (still center figure) */}
          <button
            ref={heroBtnRef}
            type="button"
            className={`nhl-front-hero ${isAtRest && !popupOpen ? "is-active" : ""}`}
            aria-label={`Open ${RUNWAY_LOOKS[0].code}: ${RUNWAY_LOOKS[0].name} in garment inspector`}
            onPointerEnter={() => setCursorMode("view")}
            onPointerLeave={() => setCursorMode("dot")}
            onClick={() => openClickedGarmentBox(0)}
          >
            <img
              src={isMobile ? RUNWAY_LOOKS[0].imageMobile : RUNWAY_LOOKS[0].image}
              alt={`${RUNWAY_LOOKS[0].name} — click to inspect trims`}
              draggable={false}
            />
          </button>

          {/* Custom Cursor (hover-capable desktop only) */}
          {!isMobile && (
            <div
              ref={cursorRef}
              className={`nhl-cursor ${cursorVisible ? "is-visible" : ""} is-${cursorMode}`}
              aria-hidden="true"
            >
              <span className="nhl-cursor-label">Inspect</span>
            </div>
          )}
        </div>

        {/* BOTTOM HERO INFO BAR — placed at the bottom of the hero directly above Section 2 */}
        <div className="nhl-runway-head nhl-runway-footerbar">
          <div className="nhl-runway-head-main">
            <span className="nhl-runway-kicker">Garment Trim Showcase · Ningbo &amp; Colombo</span>
            <h2 className="nhl-runway-title">{RUNWAY_COPY.title}</h2>
            <p className="nhl-runway-sub">{RUNWAY_COPY.sub}</p>
          </div>

          <div className="nhl-runway-look-meta">
            <div className="nhl-runway-look-caption">
              <span className="nhl-label tabular-nums">{activeLook.code}</span>
              <span className="nhl-runway-look-name nhl-truncate">{activeLook.name}</span>
            </div>
            <button
              type="button"
              className="nhl-btn-hairline nhl-runway-inspect-btn"
              onClick={() => openClickedGarmentBox(activeIndex)}
              aria-label={`Inspect trims on ${activeLook.name}`}
            >
              <Eye size={13} strokeWidth={1.6} aria-hidden="true" />
              <span>Inspect trims</span>
            </button>
            <a
              href="#certifications"
              className="nhl-hero-oeko"
              aria-label="OEKO-TEX STANDARD 100 Certified — view certifications"
            >
              <img
                src="/assets/cert-standard-100.png"
                alt="OEKO-TEX Confidence in Textiles STANDARD 100"
              />
            </a>
          </div>
        </div>
      </div>

      {/* UNIFIED "IN THIS GARMENT" POPUP — ONLY RENDERS WHEN USER CLICKS A GARMENT DUMMY */}
      {popupOpen && (
        <div
          className="nhl-garment-box-layer"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeLook.code}: ${activeLook.name} — In this garment`}
        >
          <div
            className="nhl-garment-box-scrim"
            aria-hidden="true"
            onClick={() => setPopupOpen(false)}
          />

          <div className="nhl-garment-box-dialog">
            {/* LEFT COLUMN: THE PRESSED GARMENT DUMMY WITH INTERACTIVE TRIM PINS */}
            <div className="nhl-garment-box-stage">
              <div className="nhl-garment-box-topbar">
                <div>
                  <span className="nhl-label">{activeLook.code} · {activeLook.trimCountLabel}</span>
                  <h2 className="nhl-popup-title">{activeLook.name}</h2>
                  <p className="nhl-popup-hint">{activeLook.catalogDescription}</p>
                </div>

                <div className="nhl-garment-box-nav">
                  <div className="nhl-pair-arrows" aria-label="Switch garment inside box">
                    <button
                      type="button"
                      className="nhl-pair-btn"
                      aria-label="Previous garment"
                      onClick={() => stepRelative(-1)}
                    >
                      <ArrowLeft size={16} strokeWidth={1.4} aria-hidden="true" />
                    </button>
                    <span className="nhl-pair-divider" aria-hidden="true" />
                    <button
                      type="button"
                      className="nhl-pair-btn"
                      aria-label="Next garment"
                      onClick={() => stepRelative(1)}
                    >
                      <ArrowRight size={16} strokeWidth={1.4} aria-hidden="true" />
                    </button>
                  </div>

                  <button
                    type="button"
                    className="nhl-popup-close nhl-garment-box-close--mobile"
                    aria-label="Close garment box"
                    onClick={() => setPopupOpen(false)}
                  >
                    <X size={18} strokeWidth={1.5} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="nhl-popup-canvas">
                <div className="nhl-popup-figure" key={`popup-fig-${activeLook.code}`}>
                  <img
                    src={isMobile ? activeLook.imageMobile : activeLook.image}
                    alt={activeLook.name}
                    draggable={false}
                  />

                  {activeLook.trims.map((trim, idx) => {
                    const isHot = hotTrimId === trim.trimId || openPickerTrimId === trim.trimId;
                    return (
                      <button
                        key={trim.trimId}
                        type="button"
                        className={`nhl-pin ${isHot ? "is-hot" : ""}`}
                        style={{
                          left: `${trim.pinX}%`,
                          top: `${trim.pinY}%`,
                          ["--pin-delay" as string]: `${0.14 + idx * 0.08}s`,
                        }}
                        aria-label={`Inspect ${trim.name} trim`}
                        onMouseEnter={() => setHotTrimId(trim.trimId)}
                        onMouseLeave={() => setHotTrimId(null)}
                        onFocus={() => setHotTrimId(trim.trimId)}
                        onBlur={() => setHotTrimId(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePinClick(trim.trimId);
                        }}
                      >
                        <span className="nhl-pin-halo nhl-pin-halo--1" aria-hidden="true" />
                        <span className="nhl-pin-halo nhl-pin-halo--2" aria-hidden="true" />
                        <span className="nhl-pin-num tabular-nums">{idx + 1}</span>
                        <span className="nhl-pin-tooltip">{trim.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: "IN THIS GARMENT" TRIMS FOR THE PRESSED DUMMY */}
            <aside className="nhl-garment-box-panel" aria-label="In this garment">
              <div className="nhl-garment-box-panel-head">
                <div>
                  <span className="nhl-label nhl-panel-kicker">
                    {activeLook.code} · {activeLook.trimCountLabel}
                  </span>
                  <h3 className="nhl-panel-title">{RUNWAY_COPY.panelHeading}</h3>
                </div>
                <button
                  type="button"
                  className="nhl-popup-close nhl-garment-box-close--desktop"
                  aria-label="Close garment box"
                  onClick={() => setPopupOpen(false)}
                >
                  <X size={18} strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>

              <ul key={activeIndex} className="nhl-garment-box-list">
                {activeLook.trims.map((trim, idx) => {
                  const isOpen = openPickerTrimId === trim.trimId;
                  const isPending = pendingBundleTrimIds.includes(trim.trimId);
                  const isHot = hotTrimId === trim.trimId;
                  const isLoading = loadingTrimId === trim.trimId;
                  const isAddedNow = justAddedTrimId === trim.trimId;
                  const inList = entries.some((e) => e.trimId === trim.trimId);
                  const sel = selections[trim.trimId] ?? {};
                  const ready = Boolean(sel.finish && sel.size);

                  return (
                    <li
                      key={trim.trimId}
                      ref={(el) => {
                        rowRefs.current[trim.trimId] = el;
                      }}
                      className={`nhl-trim-row ${isHot ? "is-hot" : ""} ${
                        isOpen || isPending ? "is-open" : ""
                      }`}
                      style={{ ["--row-delay" as string]: `${idx * 75}ms` }}
                      onMouseEnter={() => setHotTrimId(trim.trimId)}
                      onMouseLeave={() => setHotTrimId((cur) => (cur === trim.trimId ? null : cur))}
                    >
                      <div className="nhl-trim-row-main">
                        <div className="nhl-trim-thumb">
                          <div className="nhl-trim-curtain">
                            <SafeImage
                              src={trim.image}
                              alt={trim.name}
                              width={68}
                              height={84}
                              fallbackLabel={trim.name}
                            />
                          </div>
                          <span className="nhl-trim-badge tabular-nums">{idx + 1}</span>
                        </div>

                        <div className="nhl-trim-text">
                          <span className="nhl-label nhl-trim-family nhl-truncate">{trim.family}</span>
                          <div className="nhl-trim-title-line">
                            <Link
                              to={`/catalog/${trim.categorySlug}`}
                              className="nhl-trim-name nhl-truncate"
                              onClick={markPanelInteraction}
                            >
                              {trim.name}
                            </Link>
                            {trim.isNew && (
                              <span className="nhl-new-tag" aria-label="New">
                                <span className="nhl-new-thread" aria-hidden="true" />
                                <span>New</span>
                              </span>
                            )}
                          </div>
                          <span className="nhl-trim-price">{RUNWAY_COPY.priceLine}</span>
                        </div>

                        <button
                          type="button"
                          className={`nhl-plus-btn ${isOpen ? "is-open" : ""} ${
                            isAddedNow || inList ? "is-checked" : ""
                          }`}
                          aria-expanded={isOpen}
                          aria-label={
                            isOpen
                              ? `Close options for ${trim.name}`
                              : `Pick finish and size for ${trim.name}`
                          }
                          onClick={() => handleTogglePicker(trim.trimId)}
                        >
                          {isLoading ? (
                            <span className="nhl-spinner" aria-hidden="true" />
                          ) : isAddedNow ? (
                            <>
                              <span className="nhl-burst-ring" aria-hidden="true" />
                              <Check size={16} strokeWidth={2} className="nhl-check-svg" aria-hidden="true" />
                            </>
                          ) : (
                            <Plus size={16} strokeWidth={1.6} className="nhl-plus-icon" aria-hidden="true" />
                          )}
                        </button>
                      </div>

                      {(isOpen || isPending) && (
                        <div className="nhl-spec-picker">
                          <fieldset className="nhl-spec-fieldset">
                            <legend className="nhl-label">Finish</legend>
                            <div className="nhl-pill-group">
                              {FINISH_OPTIONS.map((finish) => {
                                const checked = sel.finish === finish;
                                return (
                                  <label
                                    key={finish}
                                    className={`nhl-pill-radio ${checked ? "is-checked" : ""}`}
                                  >
                                    <input
                                      type="radio"
                                      name={`finish-${trim.trimId}`}
                                      value={finish}
                                      checked={checked}
                                      onChange={() =>
                                        handleSelectOption(trim.trimId, "finish", finish)
                                      }
                                    />
                                    <span>{finish}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </fieldset>

                          <fieldset className="nhl-spec-fieldset">
                            <legend className="nhl-label">Size</legend>
                            <div className="nhl-pill-group">
                              {SIZE_OPTIONS.map((size) => {
                                const checked = sel.size === size;
                                return (
                                  <label
                                    key={size}
                                    className={`nhl-pill-radio ${checked ? "is-checked" : ""}`}
                                  >
                                    <input
                                      type="radio"
                                      name={`size-${trim.trimId}`}
                                      value={size}
                                      checked={checked}
                                      onChange={() => handleSelectOption(trim.trimId, "size", size)}
                                    />
                                    <span>{size}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </fieldset>

                          <button
                            type="button"
                            className="nhl-confirm-btn"
                            disabled={!ready || isLoading}
                            onClick={() => handleConfirmTrim(trim)}
                          >
                            <span>{isLoading ? "Adding..." : RUNWAY_COPY.confirmLabel}</span>
                          </button>
                        </div>
                      )}

                      <span className="nhl-trim-underline" aria-hidden="true" />
                    </li>
                  );
                })}
              </ul>

              <div className="nhl-bundle-foot">
                {bundleMessage && (
                  <p className="nhl-bundle-message" role="status">
                    {bundleMessage}
                  </p>
                )}
                <div className="nhl-bundle-meta">
                  <div>
                    <strong className="nhl-bundle-title">{RUNWAY_COPY.bundleTitle}</strong>
                    <span className="nhl-bundle-note">{RUNWAY_COPY.bundleNote}</span>
                  </div>
                  <span className="nhl-bundle-price">{RUNWAY_COPY.priceLine}</span>
                </div>

                <button
                  type="button"
                  className={`nhl-bundle-cta ${bundleGlow ? "is-glow" : ""} ${
                    allThreeInInquiry ? "is-complete" : ""
                  }`}
                  disabled={bundleLoading}
                  onClick={handleAddFullSet}
                >
                  {bundleLoading ? (
                    <span className="nhl-spinner nhl-spinner--light" aria-hidden="true" />
                  ) : (
                    <>
                      <span>
                        {allThreeInInquiry ? RUNWAY_COPY.bundleCtaDone : RUNWAY_COPY.bundleCta}
                      </span>
                      <ArrowRight
                        size={15}
                        strokeWidth={1.6}
                        className="nhl-bundle-arrow"
                        aria-hidden="true"
                      />
                    </>
                  )}
                </button>
              </div>
            </aside>
          </div>
        </div>
      )}
    </section>
  );
}
