import Lenis from "lenis";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { OfficeMapSection } from "../components/OfficeMapSection";
import { RunwayHero } from "../components/RunwayHero";
import { SafeImage } from "../components/SafeImage";
import { TrimPlacementLibrary } from "../components/TrimPlacementLibrary";
import {
  ARCH_SHOWCASE_TRIMS,
  CAPABILITIES_COPY,
  CAPABILITY_SPECS,
  CERTIFICATIONS_COPY,
  CERT_METADATA,
  HOW_WE_WORK_COPY,
  INQUIRY_SECTION_COPY,
  STORY_CHAPTERS,
  WORK_STEP_DETAILS,
} from "../data/nhlData";

const SECTION_IDS = [
  "runway",
  "about",
  "atelier",
  "certifications",
  "work",
  "capabilities",
  "inquiry",
  "offices",
] as const;

export function HomePage() {
  const location = useLocation();
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [threadProgress, setThreadProgress] = useState(0);
  const [storyIdx, setStoryIdx] = useState<number>(0);
  const [archIdx, setArchIdx] = useState<number>(0);
  const [archPaused, setArchPaused] = useState<boolean>(false);
  const [activeCapIdx, setActiveCapIdx] = useState<number>(0);
  const [userLockedCap, setUserLockedCap] = useState(false);

  const activeStory = STORY_CHAPTERS[storyIdx] ?? STORY_CHAPTERS[0];
  const activeArch = ARCH_SHOWCASE_TRIMS[archIdx] ?? ARCH_SHOWCASE_TRIMS[0];
  const activeCap = CAPABILITIES_COPY.items[activeCapIdx] ?? CAPABILITIES_COPY.items[0];
  const activeCapSpec = CAPABILITY_SPECS[activeCapIdx] ?? CAPABILITY_SPECS[0];

  const cycleIndex = (current: number, delta: number, total: number) =>
    (current + delta + total) % total;

  // Auto-repeat loop for signature Garment Closures collections
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || archPaused) return;
    const timer = window.setInterval(() => {
      setArchIdx((prev) => (prev + 1) % ARCH_SHOWCASE_TRIMS.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [archPaused]);

  // Lenis smooth scroll on normal sections only (never inside the runway)
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      prevent: (node) =>
        Boolean(node.closest(".nhl-runway, .nhl-modal, .nhl-mobile-sheet, .nhl-garment-box-layer")),
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Scroll to hash (#about, #work, #capabilities, #offices)
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace(/^#/, "");
    const el = document.getElementById(id);
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => {
      el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
    }, 60);
  }, [location.hash]);

  // Parallax & Scrollytelling Engine: CSS --p traversal (0..1), IntersectionObserver reveals, and work thread
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const sectionElements = SECTION_IDS.map((id) => ({
      id,
      el: id === "runway" ? document.getElementById("runway") : sectionRefs.current[id],
    })).filter(
      (entry): entry is { id: (typeof SECTION_IDS)[number]; el: HTMLElement } => Boolean(entry.el)
    );

    if (prefersReduced) {
      setThreadProgress(1);
      sectionElements.forEach(({ el }) => {
        el.classList.add("is-in-view");
        el.style.setProperty("--p", "0.5");
      });
      return;
    }

    // Reveal animations via IntersectionObserver
    const io = new IntersectionObserver(
      (entriesList) => {
        for (const entry of entriesList) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in-view");
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );

    sectionElements.forEach(({ el }) => io.observe(el));

    let rafPending = false;
    const updateScroll = () => {
      rafPending = false;
      const vh = window.innerHeight || 800;

      // Update per-section parallax scroll progress (--p from 0 to 1)
      for (const { el } of sectionElements) {
        const rect = el.getBoundingClientRect();
        const totalTravel = vh + Math.max(200, rect.height);
        const progress = Math.max(0, Math.min(1, (vh - rect.top) / totalTravel));
        el.style.setProperty("--p", progress.toFixed(4));
      }

      // Thread progress for Section 5 (How We Work)
      const workEl = sectionRefs.current.work;
      if (workEl) {
        const rect = workEl.getBoundingClientRect();
        const start = vh * 0.85;
        const end = vh * 0.25;
        const raw = (start - rect.top) / Math.max(1, rect.height * 0.55 + (start - end));
        setThreadProgress(Math.max(0, Math.min(1, raw)));
      }

      // Scrollytelling capability auto-advance while passing through Section 6
      const capEl = sectionRefs.current.capabilities;
      if (capEl && !userLockedCap) {
        const rect = capEl.getBoundingClientRect();
        if (rect.top < vh * 0.55 && rect.bottom > vh * 0.35) {
          const capTravel = Math.max(1, rect.height - vh * 0.25);
          const capRatio = Math.max(0, Math.min(0.999, (vh * 0.5 - rect.top) / capTravel));
          const nextIdx = Math.floor(capRatio * CAPABILITIES_COPY.items.length);
          setActiveCapIdx((prev) => (prev !== nextIdx ? nextIdx : prev));
        }
      }
    };

    const onScroll = () => {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(updateScroll);
      }
    };

    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [userLockedCap]);

  return (
    <main className="nhl-main">
      {/* SECTION 1: THE RUNWAY (Full-width 3D stage; "In this garment" opens only when a dummy is clicked) */}
      <RunwayHero />

      {/* SECTION 2: OUR STORY (Scrollytelling Plinth + Counter-Parallax Circular Loupe) */}
      <section
        id="about"
        ref={(el) => {
          sectionRefs.current.about = el;
        }}
        className="nhl-section nhl-story nhl-scrolly-section"
        aria-label="Our Story"
      >
        <div className="nhl-parallax-watermark" aria-hidden="true">
          02 · HERITAGE
        </div>
        <div className="nhl-container nhl-editorial-spread">
          {/* Left architectural plinth with scroll-scrubbed circular detail loupe */}
          <div className="nhl-plinth-stage" key={activeStory.id}>
            <figure className="nhl-plinth-rect nhl-parallax-plinth">
              <SafeImage
                src={activeStory.plinthImage}
                alt={activeStory.plinthAlt}
                loading="lazy"
                fallbackLabel="NHL International"
              />
            </figure>
            <div className="nhl-plinth-loupe nhl-parallax-loupe">
              <SafeImage
                src={activeStory.loupeImage}
                alt={activeStory.loupeAlt}
                loading="lazy"
                fallbackLabel="Trim detail"
              />
            </div>
          </div>

          {/* Right editorial copy */}
          <div className="nhl-editorial-col nhl-reveal-block nhl-parallax-fg">
            <div className="nhl-editorial-body-wrap">
              <div className="nhl-editorial-toprow">
                <span className="nhl-label">{activeStory.kicker}</span>
                <div className="nhl-rail-dots" role="tablist" aria-label="Story chapters">
                  {STORY_CHAPTERS.map((ch, idx) => (
                    <button
                      key={ch.id}
                      type="button"
                      role="tab"
                      aria-selected={idx === storyIdx}
                      aria-label={`Chapter ${idx + 1}: ${ch.kicker}`}
                      className={`nhl-rail-dot ${idx === storyIdx ? "is-active" : ""}`}
                      onClick={() => setStoryIdx(idx)}
                    />
                  ))}
                </div>
              </div>

              <h2 className="nhl-editorial-title">{activeStory.headline}</h2>

              <div className="nhl-story-paragraphs">
                {activeStory.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className="nhl-inline-meta" aria-label="Facility highlights">
                {activeStory.facts.map((fact, idx) => (
                  <span key={fact} className="nhl-inline-meta-item">
                    {idx > 0 && (
                      <span className="nhl-meta-sep" aria-hidden="true">
                        ·
                      </span>
                    )}
                    <span>{fact}</span>
                  </span>
                ))}
              </div>

              <div className="nhl-editorial-footer">
                <Link to={activeStory.ctaTo} className="nhl-btn-hairline">
                  {activeStory.ctaLabel}
                </Link>

                <div className="nhl-pair-arrows" aria-label="Story chapter navigation">
                  <button
                    type="button"
                    className="nhl-pair-btn"
                    aria-label="Previous chapter"
                    onClick={() => setStoryIdx((i) => cycleIndex(i, -1, STORY_CHAPTERS.length))}
                  >
                    <ArrowLeft size={16} strokeWidth={1.35} aria-hidden="true" />
                  </button>
                  <span className="nhl-pair-divider" aria-hidden="true" />
                  <button
                    type="button"
                    className="nhl-pair-btn"
                    aria-label="Next chapter"
                    onClick={() => setStoryIdx((i) => cycleIndex(i, 1, STORY_CHAPTERS.length))}
                  >
                    <ArrowRight size={16} strokeWidth={1.35} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: ARCHED HARDWARE SHOWCASE + INTERACTIVE GARMENT X-RAY TRIM ATELIER */}
      <section
        id="atelier"
        ref={(el) => {
          sectionRefs.current.atelier = el;
        }}
        className="nhl-section nhl-range nhl-scrolly-section"
        aria-label="Signature trims and Trim Placement Atelier"
      >
        <div className="nhl-parallax-watermark" aria-hidden="true">
          03 · HARDWARE
        </div>
        <div className="nhl-container">
          <div
            className="nhl-arch-spread nhl-reveal-block"
            onMouseEnter={() => setArchPaused(true)}
            onMouseLeave={() => setArchPaused(false)}
            onFocusCapture={() => setArchPaused(true)}
            onBlurCapture={() => setArchPaused(false)}
          >
            <div className="nhl-arch-left nhl-parallax-fg">
              <div
                className="nhl-rail-dots nhl-rail-dots--left"
                role="tablist"
                aria-label="Signature trim collections"
              >
                {ARCH_SHOWCASE_TRIMS.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={idx === archIdx}
                    aria-label={`View ${item.kicker}`}
                    className={`nhl-rail-dot ${idx === archIdx ? "is-active" : ""}`}
                    onClick={() => setArchIdx(idx)}
                  />
                ))}
              </div>

              <div className="nhl-arch-copy">
                <span className="nhl-label">{activeArch.kicker}</span>
                <h2 className="nhl-editorial-title">{activeArch.headline}</h2>
                <p className="nhl-arch-desc">{activeArch.description}</p>
                <div className="nhl-arch-cta-wrap">
                  <Link to={`/catalog/${activeArch.slug}`} className="nhl-btn-hairline">
                    Explore category
                  </Link>
                </div>

                <div className="nhl-pair-arrows nhl-pair-arrows--left" aria-label="Collection navigation">
                  <button
                    type="button"
                    className="nhl-pair-btn"
                    aria-label="Previous trim collection"
                    onClick={() => setArchIdx((i) => cycleIndex(i, -1, ARCH_SHOWCASE_TRIMS.length))}
                  >
                    <ArrowLeft size={16} strokeWidth={1.35} aria-hidden="true" />
                  </button>
                  <span className="nhl-pair-divider" aria-hidden="true" />
                  <button
                    type="button"
                    className="nhl-pair-btn"
                    aria-label="Next trim collection"
                    onClick={() => setArchIdx((i) => cycleIndex(i, 1, ARCH_SHOWCASE_TRIMS.length))}
                  >
                    <ArrowRight size={16} strokeWidth={1.35} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <div className="nhl-arch-center">
              <figure className="nhl-arch-niche nhl-parallax-arch" key={`arch-${activeArch.id}`}>
                <SafeImage
                  src={activeArch.archImage}
                  alt={activeArch.archAlt}
                  loading="lazy"
                  fallbackLabel={activeArch.headline}
                />
              </figure>
            </div>

            <div className="nhl-arch-right">
              <figure className="nhl-circle-companion nhl-parallax-circle" key={`circle-${activeArch.id}`}>
                <SafeImage
                  src={activeArch.circleImage}
                  alt={activeArch.circleAlt}
                  loading="lazy"
                  fallbackLabel={activeArch.specCode}
                />
              </figure>

              <aside className="nhl-specimen-note" aria-label="Trim specification summary">
                <span className="nhl-specimen-code tabular-nums">{activeArch.specCode}</span>
                <p className="nhl-specimen-detail">{activeArch.specMaterial}</p>
                <p className="nhl-specimen-detail">{activeArch.specRange}</p>
                <p className="nhl-specimen-origin">{activeArch.specOrigin}</p>
                <Link to={`/catalog/${activeArch.slug}`} className="nhl-specimen-thumb">
                  <SafeImage
                    src={activeArch.archImage}
                    alt={`View ${activeArch.specCode}`}
                    loading="lazy"
                    fallbackLabel={activeArch.specCode}
                  />
                </Link>
              </aside>
            </div>
          </div>

          {/* Redesigned Interactive Garment Anatomy & Optical Lens Atelier */}
          <div className="nhl-range-directory nhl-reveal-block">
            <TrimPlacementLibrary />
          </div>
        </div>
      </section>

      {/* SECTION 4: CERTIFICATIONS */}
      <section
        id="certifications"
        ref={(el) => {
          sectionRefs.current.certifications = el;
        }}
        className="nhl-section nhl-certs nhl-scrolly-section"
        aria-label="Certifications"
      >
        <div className="nhl-parallax-watermark" aria-hidden="true">
          04 · CERTIFIED
        </div>
        <div className="nhl-container">
          <div className="nhl-section-head-split nhl-reveal-block nhl-parallax-fg">
            <div>
              <span className="nhl-label">{CERTIFICATIONS_COPY.label}</span>
              <h2 className="nhl-section-title">{CERTIFICATIONS_COPY.headline}</h2>
            </div>
            <p className="nhl-section-sub">{CERTIFICATIONS_COPY.sub}</p>
          </div>

          <div className="nhl-certs-grid">
            {CERTIFICATIONS_COPY.items.map((item, idx) => {
              const meta = CERT_METADATA[idx];
              const depthFactor = idx === 0 ? -1 : idx === 1 ? 0.5 : 1.25;
              return (
                <article
                  key={item.name}
                  className="nhl-cert-col nhl-reveal-stagger nhl-parallax-depth"
                  style={{
                    ["--stagger-delay" as string]: `${idx * 110}ms`,
                    ["--parallax-depth" as string]: String(depthFactor),
                  }}
                >
                  <div className="nhl-cert-plinth">
                    <SafeImage src={item.logo} alt={item.name} loading="lazy" fallbackLabel={item.name} />
                  </div>
                  <div className="nhl-inline-meta nhl-cert-meta">
                    <span className="tabular-nums">{meta?.code}</span>
                    <span className="nhl-meta-sep" aria-hidden="true">
                      ·
                    </span>
                    <span>{meta?.standard}</span>
                  </div>
                  <h3 className="nhl-cert-name">{item.name}</h3>
                  <p className="nhl-cert-body">{item.body}</p>
                  <p className="nhl-cert-scope">{meta?.scope}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5: HOW WE WORK (Drawing Thread Line) */}
      <section
        id="work"
        ref={(el) => {
          sectionRefs.current.work = el;
        }}
        className="nhl-section nhl-work nhl-scrolly-section"
        aria-label="How We Work"
      >
        <div className="nhl-parallax-watermark" aria-hidden="true">
          05 · WORKFLOW
        </div>
        <div className="nhl-container">
          <div className="nhl-section-head-split nhl-reveal-block nhl-parallax-fg">
            <div>
              <span className="nhl-label">{HOW_WE_WORK_COPY.label}</span>
              <h2 className="nhl-section-title">{HOW_WE_WORK_COPY.headline}</h2>
            </div>
            <p className="nhl-section-sub">
              Coordinated directly between our Ningbo engineering hub and Kotte, Colombo sourcing desk.
            </p>
          </div>

          <div className="nhl-thread-wrap">
            <div className="nhl-thread-track" aria-hidden="true">
              <div
                className="nhl-thread-fill"
                style={{ transform: `scaleX(${threadProgress.toFixed(4)})` }}
              />
            </div>

            <ol className="nhl-work-steps">
              {HOW_WE_WORK_COPY.steps.map((step, idx) => {
                const threshold = idx * 0.22;
                const reached = threadProgress >= threshold;
                const depthFactor = idx % 2 === 0 ? -0.6 : 0.7;
                return (
                  <li
                    key={step.number}
                    className={`nhl-work-step nhl-parallax-depth ${reached ? "is-reached" : ""}`}
                    style={{ ["--parallax-depth" as string]: String(depthFactor) }}
                  >
                    <span className="nhl-work-dot" aria-hidden="true" />
                    <span className="nhl-work-num tabular-nums">{step.number}</span>
                    <h3 className="nhl-work-title">{step.title}</h3>
                    <p className="nhl-work-body">{step.body}</p>
                    <p className="nhl-work-deliverable">{WORK_STEP_DETAILS[idx]}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* SECTION 6: MANUFACTURING CAPABILITIES (Scroll-Driven Sticky Stage) */}
      <section
        id="capabilities"
        ref={(el) => {
          sectionRefs.current.capabilities = el;
        }}
        className="nhl-section nhl-capabilities nhl-scrolly-section"
        aria-label="Our Manufacturing Capabilities"
      >
        <div className="nhl-parallax-watermark" aria-hidden="true">
          06 · TESTING LAB
        </div>
        <div className="nhl-container">
          <div className="nhl-cap-head nhl-reveal-block nhl-parallax-fg">
            <div>
              <span className="nhl-label">Quality &amp; Testing Infrastructure</span>
              <h2 className="nhl-section-title">{CAPABILITIES_COPY.headline}</h2>
            </div>
            <p className="nhl-cap-intro">{CAPABILITIES_COPY.intro}</p>
          </div>

          <div className="nhl-cap-layout">
            <ul className="nhl-cap-list">
              {CAPABILITIES_COPY.items.map((cap, idx) => {
                const isSelected = activeCapIdx === idx;
                const spec = CAPABILITY_SPECS[idx];
                return (
                  <li
                    key={cap.number}
                    className={`nhl-cap-row ${isSelected ? "is-expanded" : ""}`}
                  >
                    <button
                      type="button"
                      className="nhl-cap-trigger"
                      aria-pressed={isSelected}
                      onClick={() => {
                        setUserLockedCap(true);
                        setActiveCapIdx(idx);
                      }}
                      onMouseEnter={() => {
                        setUserLockedCap(true);
                        setActiveCapIdx(idx);
                      }}
                    >
                      <span className="nhl-cap-num tabular-nums">{cap.number}</span>
                      <div className="nhl-cap-main">
                        <span className="nhl-cap-title">{cap.title}</span>
                        <span className="nhl-cap-body">{cap.body}</span>
                        <span className="nhl-cap-spec">
                          {spec.code} · {spec.metric}
                        </span>
                      </div>
                      <span className="nhl-cap-indicator" aria-hidden="true">
                        {isSelected ? "→" : "+"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="nhl-cap-stage" aria-live="polite">
              <div className="nhl-cap-plinth" key={activeCap.number}>
                <SafeImage
                  src={activeCap.image}
                  alt={activeCap.title}
                  loading="lazy"
                  fallbackLabel={activeCap.title}
                />
              </div>

              <div className="nhl-cap-stage-foot">
                <div className="nhl-cap-stage-meta">
                  <span className="nhl-label">
                    {activeCapSpec.code} · {activeCap.title}
                  </span>
                  <p className="nhl-cap-stage-std">
                    {activeCapSpec.metric} — {activeCapSpec.standard}
                  </p>
                </div>

                <div className="nhl-pair-arrows" aria-label="Capability showcase controls">
                  <button
                    type="button"
                    className="nhl-pair-btn"
                    aria-label="Previous capability"
                    onClick={() => {
                      setUserLockedCap(true);
                      setActiveCapIdx((i) => cycleIndex(i, -1, CAPABILITIES_COPY.items.length));
                    }}
                  >
                    <ArrowLeft size={16} strokeWidth={1.35} aria-hidden="true" />
                  </button>
                  <span className="nhl-pair-divider" aria-hidden="true" />
                  <button
                    type="button"
                    className="nhl-pair-btn"
                    aria-label="Next capability"
                    onClick={() => {
                      setUserLockedCap(true);
                      setActiveCapIdx((i) => cycleIndex(i, 1, CAPABILITIES_COPY.items.length));
                    }}
                  >
                    <ArrowRight size={16} strokeWidth={1.35} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: SAMPLES, LAB DIPS & QUOTATIONS */}
      <section
        id="inquiry"
        ref={(el) => {
          sectionRefs.current.inquiry = el;
        }}
        className="nhl-section nhl-inquiry-band nhl-scrolly-section"
        aria-label="Samples, Lab Dips and Quotations"
      >
        <div className="nhl-parallax-watermark" aria-hidden="true">
          07 · SAMPLES
        </div>
        <div className="nhl-container">
          <div className="nhl-inquiry-copy nhl-reveal-block nhl-parallax-fg">
            <span className="nhl-label">Samples, Lab Dips &amp; Quotations</span>
            <h2 className="nhl-section-title">{INQUIRY_SECTION_COPY.headline}</h2>
            <p className="nhl-section-sub">{INQUIRY_SECTION_COPY.text}</p>
            <div className="nhl-inquiry-actions">
              <Link to="/catalog" className="nhl-btn-hairline">
                {INQUIRY_SECTION_COPY.catalogLabel}
              </Link>
              <Link to="/contact" className="nhl-btn-solid">
                {INQUIRY_SECTION_COPY.contactLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: DEDICATED GOOGLE MAPS & GLOBAL OFFICES SECTION */}
      <section
        id="offices"
        ref={(el) => {
          sectionRefs.current.offices = el;
        }}
        className="nhl-section nhl-offices-band nhl-scrolly-section"
        aria-label="Global Offices and Google Maps Locations"
      >
        <div className="nhl-parallax-watermark" aria-hidden="true">
          08 · OFFICES
        </div>
        <div className="nhl-container">
          <div className="nhl-section-head-split nhl-reveal-block nhl-parallax-fg">
            <div>
              <span className="nhl-label">Global Offices · China HQ &amp; Sri Lanka</span>
              <h2 className="nhl-section-title">Visit or dispatch directly to our offices.</h2>
            </div>
            <p className="nhl-section-sub">
              Select either pin below to inspect coordinates or open live directions to our Ningbo
              headquarters and Kotte regional merchandising desk.
            </p>
          </div>

          <div className="nhl-reveal-block nhl-parallax-mid">
            <OfficeMapSection />
          </div>
        </div>
      </section>
    </main>
  );
}
