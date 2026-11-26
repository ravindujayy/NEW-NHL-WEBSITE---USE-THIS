import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { categories } from "../data/nhlData";
import { SafeImage } from "./SafeImage";

export function CatalogIndexList({ searchable = false }: { searchable?: boolean }) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedFamily, setSelectedFamily] = useState<string>("All");

  const families = useMemo(
    () => ["All", ...Array.from(new Set(categories.map((c) => c.family)))],
    []
  );

  const filteredCategories = useMemo(() => {
    if (!searchable) return categories;
    const q = query.trim().toLowerCase();
    return categories.filter((cat) => {
      const familyMatch = selectedFamily === "All" || cat.family === selectedFamily;
      if (!familyMatch) return false;
      if (!q) return true;
      return (
        cat.name.toLowerCase().includes(q) ||
        cat.short.toLowerCase().includes(q) ||
        cat.family.toLowerCase().includes(q)
      );
    });
  }, [searchable, query, selectedFamily]);

  return (
    <div>
      {searchable && (
        <div className="nhl-catalog-filters" aria-label="Filter trim categories">
          <div className="nhl-search-field">
            <Search size={15} strokeWidth={1.6} aria-hidden="true" />
            <label htmlFor="nhl-catalog-search" className="sr-only">
              Search trim categories
            </label>
            <input
              id="nhl-catalog-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search trims, closures, hardware..."
            />
            {query && (
              <button
                type="button"
                className="nhl-search-clear"
                aria-label="Clear search"
                onClick={() => setQuery("")}
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="nhl-filter-pills" role="group" aria-label="Filter by family">
            {families.map((family) => {
              const active = selectedFamily === family;
              return (
                <button
                  key={family}
                  type="button"
                  aria-pressed={active}
                  className={`nhl-pill-radio ${active ? "is-checked" : ""}`}
                  onClick={() => setSelectedFamily(family)}
                >
                  {family}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {filteredCategories.length === 0 ? (
        <div className="nhl-zero-state" role="status">
          <span className="nhl-label">Zero results</span>
          <h3>No trim categories match "{query || selectedFamily}".</h3>
          <p>
            Try a different term (for example zippers, shanks, buckles, or cord) or reset the active
            filters to view all 19 categories.
          </p>
          <button
            type="button"
            className="nhl-btn-outline"
            onClick={() => {
              setQuery("");
              setSelectedFamily("All");
            }}
          >
            Reset filters
          </button>
        </div>
      ) : (
        <ul className="nhl-range-list">
          {filteredCategories.map((cat) => {
            const globalIdx = categories.findIndex((c) => c.slug === cat.slug);
            const isHovered = hoveredSlug === cat.slug;
            return (
              <li
                key={cat.slug}
                className={`nhl-range-row ${isHovered ? "is-hovered" : ""}`}
                onMouseEnter={() => setHoveredSlug(cat.slug)}
                onMouseLeave={() => setHoveredSlug((cur) => (cur === cat.slug ? null : cur))}
              >
                <Link to={`/catalog/${cat.slug}`} className="nhl-range-link">
                  <span className="nhl-range-num tabular-nums">
                    {String(globalIdx + 1).padStart(2, "0")}
                  </span>
                  <span className="nhl-range-name nhl-truncate">{cat.name}</span>
                  <span className="nhl-range-short">{cat.short}</span>
                  <span className="nhl-range-preview" aria-hidden="true">
                    <SafeImage
                      src={`/assets/trims/${cat.assetSlug}.webp`}
                      alt=""
                      width={96}
                      height={96}
                      loading="lazy"
                      fallbackLabel={cat.name}
                    />
                  </span>
                  <span className="nhl-range-explore">Explore →</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
