import { Link } from "react-router-dom";
import { CatalogIndexList } from "../components/CatalogIndexList";
import { FULL_RANGE_COPY } from "../data/nhlData";

export function CatalogPage() {
  return (
    <main className="nhl-main">
      <section className="nhl-subpage-hero">
        <div className="nhl-container">
          <nav className="nhl-breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="nhl-link">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Catalog</span>
          </nav>
          <span className="nhl-label">Catalog</span>
          <h1 className="nhl-subpage-title">{FULL_RANGE_COPY.headline}</h1>
          <p className="nhl-section-sub">{FULL_RANGE_COPY.sub}</p>
        </div>
      </section>

      <section className="nhl-section nhl-range">
        <div className="nhl-container">
          <CatalogIndexList searchable />
        </div>
      </section>
    </main>
  );
}
