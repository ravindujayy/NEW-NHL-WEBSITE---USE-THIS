import { Link, useLocation, useNavigate } from "react-router-dom";
import { CONTACT_AND_FOOTER_COPY, HEADER_COPY } from "../data/nhlData";

export function SiteFooter() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname.replace(/\/+$/, "") || "/";

  const handleAboutClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (pathname === "/") {
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    navigate("/#about");
  };

  return (
    <footer className="nhl-footer">
      <div className="nhl-container nhl-footer-grid">
        <div className="nhl-footer-brand-col">
          <Link to="/" className="nhl-footer-logo-link" aria-label="NHL International home">
            <img
              src={HEADER_COPY.logo}
              alt={HEADER_COPY.logoAlt}
              width={116}
              height={41}
              className="nhl-footer-logo"
            />
          </Link>
          <p className="nhl-footer-tagline">{CONTACT_AND_FOOTER_COPY.tagline}</p>
        </div>

        <div className="nhl-footer-col">
          <h3 className="nhl-label">Explore</h3>
          <nav className="nhl-footer-links" aria-label="Footer navigation">
            <Link to="/" className="nhl-link">Home</Link>
            <a href="/#about" className="nhl-link" onClick={handleAboutClick}>
              About Us
            </a>
            <Link to="/catalog" className="nhl-link">Catalog</Link>
            <Link to="/contact" className="nhl-link">Contact</Link>
          </nav>
        </div>

        <div className="nhl-footer-col">
          <h3 className="nhl-label">Contact</h3>
          <div className="nhl-footer-contact">
            <a className="nhl-link" href={`tel:${CONTACT_AND_FOOTER_COPY.phone.replace(/\s+/g, "")}`}>
              {CONTACT_AND_FOOTER_COPY.phone}
            </a>
            <a className="nhl-link" href={`mailto:${CONTACT_AND_FOOTER_COPY.email}`}>
              {CONTACT_AND_FOOTER_COPY.email}
            </a>
            <div className="nhl-footer-office">
              <span className="nhl-footer-office-label">
                {CONTACT_AND_FOOTER_COPY.colomboOfficeLabel}
              </span>
              <p>{CONTACT_AND_FOOTER_COPY.colomboAddress}</p>
            </div>
            <div className="nhl-footer-office">
              <span className="nhl-footer-office-label">
                {CONTACT_AND_FOOTER_COPY.ningboOfficeLabel}
              </span>
              <p>{CONTACT_AND_FOOTER_COPY.ningboAddress}</p>
            </div>
          </div>
        </div>

        <div className="nhl-footer-map-col">
          <div className="nhl-footer-map-head">
            <span className="nhl-label">Kotte Regional Office</span>
            <a
              href={CONTACT_AND_FOOTER_COPY.kotteMapDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="nhl-link nhl-footer-map-link"
            >
              Directions →
            </a>
          </div>
          <div className="nhl-map-frame">
            <iframe
              title="NHL International Colombo Regional Office — Nawala Road, Kotte"
              src={CONTACT_AND_FOOTER_COPY.kotteMapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      <div className="nhl-footer-bottom">
        <div className="nhl-container nhl-footer-bottom-inner">
          <span>{CONTACT_AND_FOOTER_COPY.copyright}</span>
        </div>
      </div>
    </footer>
  );
}
