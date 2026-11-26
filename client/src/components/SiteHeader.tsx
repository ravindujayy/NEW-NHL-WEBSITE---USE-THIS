import { ChevronDown, Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useInquiry } from "../context/InquiryContext";
import { categories, HEADER_COPY } from "../data/nhlData";

export function SiteHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalCount, setModalOpen } = useInquiry();
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const catalogTriggerRef = useRef<HTMLButtonElement>(null);

  const pathname = location.pathname.replace(/\/+$/, "") || "/";

  useEffect(() => {
    setCatalogOpen(false);
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!catalogOpen && !mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (catalogOpen) {
          setCatalogOpen(false);
          catalogTriggerRef.current?.focus();
        }
        setMobileOpen(false);
      }
    };
    const onPointerDown = (event: MouseEvent) => {
      if (
        catalogOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setCatalogOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onPointerDown);
    };
  }, [catalogOpen, mobileOpen]);

  const handleAnchorNav = (event: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    event.preventDefault();
    setCatalogOpen(false);
    setMobileOpen(false);

    if (pathname === "/") {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    navigate(`/#${targetId}`);
  };

  return (
    <header className="nhl-header">
      <div className="nhl-header-inner">
        <Link to="/" className="nhl-brand" aria-label="NHL International home">
          <img
            src={HEADER_COPY.logo}
            alt={HEADER_COPY.logoAlt}
            width={136}
            height={48}
            className="nhl-brand-logo"
          />
        </Link>

        <nav className="nhl-nav" aria-label="Primary navigation">
          <Link to="/" className={`nhl-nav-link ${pathname === "/" && !location.hash ? "is-active" : ""}`}>
            Home
          </Link>

          <a
            href="/#about"
            className={`nhl-nav-link ${location.hash === "#about" ? "is-active" : ""}`}
            onClick={(e) => handleAnchorNav(e, "about")}
          >
            About us
          </a>

          <a
            href="/#work"
            className={`nhl-nav-link ${location.hash === "#work" ? "is-active" : ""}`}
            onClick={(e) => handleAnchorNav(e, "work")}
          >
            How we work
          </a>

          <div className="nhl-nav-dropdown" ref={dropdownRef}>
            <button
              ref={catalogTriggerRef}
              type="button"
              className={`nhl-nav-link nhl-nav-trigger ${
                catalogOpen || pathname.startsWith("/catalog") ? "is-active" : ""
              }`}
              aria-expanded={catalogOpen}
              aria-controls="nhl-catalog-dropdown"
              onClick={() => setCatalogOpen((prev) => !prev)}
            >
              <span>Catalog</span>
              <ChevronDown
                size={14}
                strokeWidth={1.8}
                className={`nhl-nav-chevron ${catalogOpen ? "is-open" : ""}`}
                aria-hidden="true"
              />
            </button>

            {catalogOpen && (
              <>
                <div
                  className="nhl-menu-scrim"
                  aria-hidden="true"
                  onClick={() => setCatalogOpen(false)}
                />
                <div
                  id="nhl-catalog-dropdown"
                  className="nhl-catalog-menu"
                  role="region"
                  aria-label="Catalog categories"
                >
                  <div className="nhl-catalog-menu-head">
                    <span className="nhl-label">19 trim categories</span>
                    <Link to="/catalog" className="nhl-link nhl-catalog-all-link" onClick={() => setCatalogOpen(false)}>
                      View full range →
                    </Link>
                  </div>
                  <div className="nhl-catalog-menu-grid">
                    {categories.map((cat, idx) => (
                      <Link
                        key={cat.slug}
                        to={`/catalog/${cat.slug}`}
                        className="nhl-catalog-menu-item"
                        onClick={() => setCatalogOpen(false)}
                      >
                        <span className="nhl-catalog-menu-num tabular-nums">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="nhl-truncate">{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <Link to="/contact" className={`nhl-nav-link ${pathname === "/contact" ? "is-active" : ""}`}>
            Contact
          </Link>
        </nav>

        <div className="nhl-header-right">
          <button
            type="button"
            className="nhl-bag-btn"
            onClick={() => setModalOpen(true)}
            aria-label={`Open inquiry list (${totalCount} items)`}
          >
            <ShoppingBag size={15} strokeWidth={1.6} aria-hidden="true" />
            <span className="nhl-bag-label">{HEADER_COPY.inquiryButtonLabel}</span>
            <span className="nhl-bag-badge tabular-nums">{totalCount}</span>
          </button>

          <button
            type="button"
            className="nhl-mobile-toggle"
            aria-expanded={mobileOpen}
            aria-controls="nhl-mobile-nav"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X size={20} strokeWidth={1.6} /> : <Menu size={20} strokeWidth={1.6} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <>
          <div
            className="nhl-menu-scrim"
            aria-hidden="true"
            onClick={() => setMobileOpen(false)}
          />
          <nav id="nhl-mobile-nav" className="nhl-mobile-nav" aria-label="Mobile navigation">
            <Link to="/" onClick={() => setMobileOpen(false)}>
              Home
            </Link>
            <a href="/#about" onClick={(e) => handleAnchorNav(e, "about")}>
              About us
            </a>
            <a href="/#work" onClick={(e) => handleAnchorNav(e, "work")}>
              How we work
            </a>
            <Link to="/catalog" onClick={() => setMobileOpen(false)}>
              Catalog
            </Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)}>
              Contact
            </Link>
          </nav>
        </>
      )}
    </header>
  );
}
