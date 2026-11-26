import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="nhl-main">
      <section className="nhl-subpage-hero">
        <div className="nhl-container">
          <span className="nhl-label">404</span>
          <h1 className="nhl-subpage-title">Page not found.</h1>
          <p className="nhl-section-sub">
            Return to the runway or browse the full 19-category catalog.
          </p>
          <div className="nhl-inquiry-actions" style={{ marginTop: "28px" }}>
            <Link to="/" className="nhl-btn-solid">
              Return home
            </Link>
            <Link to="/catalog" className="nhl-btn-outline">
              View Catalog
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
