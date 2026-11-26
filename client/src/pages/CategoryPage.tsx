import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SafeImage } from "../components/SafeImage";
import { useInquiry } from "../context/InquiryContext";
import {
  categories,
  FINISH_OPTIONS,
  getCategoryBySlug,
  RUNWAY_COPY,
  SIZE_OPTIONS,
} from "../data/nhlData";
import { NotFoundPage } from "./NotFoundPage";

export function CategoryPage({ slugOverride }: { slugOverride?: string }) {
  const params = useParams<{ category?: string }>();
  const slug = slugOverride ?? params.category ?? "";
  const category = getCategoryBySlug(slug);

  const { entries, addEntry } = useInquiry();
  const [openId, setOpenId] = useState<string | null>(null);
  const [selections, setSelections] = useState<Record<string, { finish?: string; size?: string }>>({});
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  if (!category) return <NotFoundPage />;

  const trimImage = `/assets/trims/${category.assetSlug}.webp`;
  const currentIdx = categories.findIndex((c) => c.slug === category.slug);
  const related = [
    ...categories.slice(currentIdx + 1),
    ...categories.slice(0, currentIdx),
  ].slice(0, 6);

  const setOption = (id: string, key: "finish" | "size", value: string) => {
    setSelections((prev) => ({
      ...prev,
      [id]: { ...prev[id], [key]: value },
    }));
  };

  const handleConfirm = (id: string, name: string) => {
    const sel = selections[id];
    if (!sel?.finish || !sel?.size) return;
    addEntry({
      trimId: id,
      trimName: name,
      categorySlug: category.slug,
      image: trimImage,
      finish: sel.finish,
      size: sel.size,
    });
    setOpenId(null);
    setJustAddedId(id);
    setTimeout(() => setJustAddedId((cur) => (cur === id ? null : cur)), 1400);
  };

  const heroTrimId = `cat-${category.slug}-primary`;
  const heroSel = selections[heroTrimId] ?? {};
  const heroInList = entries.some((e) => e.trimId === heroTrimId);

  return (
    <main className="nhl-main">
      <section className="nhl-subpage-hero">
        <div className="nhl-container">
          <nav className="nhl-breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="nhl-link">Home</Link>
            <span aria-hidden="true">/</span>
            <Link to="/catalog" className="nhl-link">Catalog</Link>
            <span aria-hidden="true">/</span>
            <span>{category.name}</span>
          </nav>

          <div className="nhl-cat-hero-grid">
            <div className="nhl-min-0">
              <span className="nhl-label">{category.family}</span>
              <h1 className="nhl-subpage-title">{category.name}</h1>
              <p className="nhl-section-sub">{category.short}</p>

              <dl className="nhl-cat-specs">
                <div>
                  <dt className="nhl-label">Material</dt>
                  <dd>{category.specs.material}</dd>
                </div>
                <div>
                  <dt className="nhl-label">Sizes</dt>
                  <dd>{category.specs.sizes}</dd>
                </div>
                <div>
                  <dt className="nhl-label">Finish</dt>
                  <dd>{category.specs.finish}</dd>
                </div>
                <div>
                  <dt className="nhl-label">MOQ / Lead time</dt>
                  <dd>{category.specs.moq}</dd>
                </div>
              </dl>

              <div className="nhl-cat-hero-picker">
                <button
                  type="button"
                  className="nhl-btn-solid"
                  onClick={() =>
                    setOpenId((prev) => (prev === heroTrimId ? null : heroTrimId))
                  }
                >
                  {heroInList ? "In inquiry list — add another spec" : "Add to inquiry"}
                </button>
                <Link to="/contact" className="nhl-btn-outline">
                  Request custom specification
                </Link>
              </div>

              {openId === heroTrimId && (
                <div className="nhl-spec-picker nhl-spec-picker--inline">
                  <fieldset className="nhl-spec-fieldset">
                    <legend className="nhl-label">Finish</legend>
                    <div className="nhl-pill-group">
                      {FINISH_OPTIONS.map((finish) => (
                        <label
                          key={finish}
                          className={`nhl-pill-radio ${heroSel.finish === finish ? "is-checked" : ""}`}
                        >
                          <input
                            type="radio"
                            name={`finish-${heroTrimId}`}
                            value={finish}
                            checked={heroSel.finish === finish}
                            onChange={() => setOption(heroTrimId, "finish", finish)}
                          />
                          <span>{finish}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset className="nhl-spec-fieldset">
                    <legend className="nhl-label">Size</legend>
                    <div className="nhl-pill-group">
                      {SIZE_OPTIONS.map((size) => (
                        <label
                          key={size}
                          className={`nhl-pill-radio ${heroSel.size === size ? "is-checked" : ""}`}
                        >
                          <input
                            type="radio"
                            name={`size-${heroTrimId}`}
                            value={size}
                            checked={heroSel.size === size}
                            onChange={() => setOption(heroTrimId, "size", size)}
                          />
                          <span>{size}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <button
                    type="button"
                    className="nhl-confirm-btn"
                    disabled={!heroSel.finish || !heroSel.size}
                    onClick={() => handleConfirm(heroTrimId, category.name)}
                  >
                    {RUNWAY_COPY.confirmLabel}
                  </button>
                </div>
              )}
            </div>

            <div className="nhl-cat-hero-cutout">
              <SafeImage
                src={trimImage}
                alt={`${category.name} cut-out`}
                width={400}
                height={400}
                fallbackLabel={category.name}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="nhl-section">
        <div className="nhl-container">
          <div className="nhl-section-head">
            <span className="nhl-label">Item gallery</span>
            <h2 className="nhl-section-title">Standard profiles for buyer specification.</h2>
          </div>

          <div className="nhl-cat-gallery">
            {category.profiles.map((profile) => {
              const isOpen = openId === profile.id;
              const sel = selections[profile.id] ?? {};
              const isAdded = justAddedId === profile.id || entries.some((e) => e.trimId === profile.id);
              return (
                <article key={profile.id} className="nhl-cat-item">
                  <div className="nhl-cat-item-img">
                    <SafeImage
                      src={trimImage}
                      alt={profile.name}
                      width={400}
                      height={400}
                      loading="lazy"
                      fallbackLabel={profile.name}
                    />
                  </div>
                  <div className="nhl-cat-item-head">
                    <div className="nhl-min-0">
                      <h3 className="nhl-cat-item-name nhl-truncate">{profile.name}</h3>
                      <p className="nhl-cat-item-detail">{profile.detail}</p>
                      <span className="nhl-trim-price">{RUNWAY_COPY.priceLine}</span>
                    </div>
                    <button
                      type="button"
                      className={`nhl-plus-btn ${isOpen ? "is-open" : ""} ${
                        isAdded ? "is-checked" : ""
                      }`}
                      aria-expanded={isOpen}
                      aria-label={`Add ${profile.name} to inquiry`}
                      onClick={() => setOpenId((prev) => (prev === profile.id ? null : profile.id))}
                    >
                      {justAddedId === profile.id ? (
                        <Check size={16} strokeWidth={2} aria-hidden="true" />
                      ) : (
                        <Plus size={16} strokeWidth={1.6} className="nhl-plus-icon" aria-hidden="true" />
                      )}
                    </button>
                  </div>

                  {isOpen && (
                    <div className="nhl-spec-picker">
                      <fieldset className="nhl-spec-fieldset">
                        <legend className="nhl-label">Finish</legend>
                        <div className="nhl-pill-group">
                          {FINISH_OPTIONS.map((finish) => (
                            <label
                              key={finish}
                              className={`nhl-pill-radio ${sel.finish === finish ? "is-checked" : ""}`}
                            >
                              <input
                                type="radio"
                                name={`finish-${profile.id}`}
                                value={finish}
                                checked={sel.finish === finish}
                                onChange={() => setOption(profile.id, "finish", finish)}
                              />
                              <span>{finish}</span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                      <fieldset className="nhl-spec-fieldset">
                        <legend className="nhl-label">Size</legend>
                        <div className="nhl-pill-group">
                          {SIZE_OPTIONS.map((size) => (
                            <label
                              key={size}
                              className={`nhl-pill-radio ${sel.size === size ? "is-checked" : ""}`}
                            >
                              <input
                                type="radio"
                                name={`size-${profile.id}`}
                                value={size}
                                checked={sel.size === size}
                                onChange={() => setOption(profile.id, "size", size)}
                              />
                              <span>{size}</span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                      <button
                        type="button"
                        className="nhl-confirm-btn"
                        disabled={!sel.finish || !sel.size}
                        onClick={() => handleConfirm(profile.id, profile.name)}
                      >
                        {RUNWAY_COPY.confirmLabel}
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="nhl-section nhl-related-band">
        <div className="nhl-container">
          <div className="nhl-related-head">
            <span className="nhl-label">More categories</span>
            <Link to="/catalog" className="nhl-link nhl-catalog-all-link">
              All 19 categories →
            </Link>
          </div>
          <div className="nhl-related-rail-wrap">
            <ul className="nhl-related-rail">
              {related.map((item) => (
                <li key={item.slug} className="nhl-related-card">
                  <Link to={`/catalog/${item.slug}`} className="nhl-related-card-link">
                    <div className="nhl-related-card-img">
                      <SafeImage
                        src={`/assets/trims/${item.assetSlug}.webp`}
                        alt={item.name}
                        width={220}
                        height={220}
                        loading="lazy"
                        fallbackLabel={item.name}
                      />
                    </div>
                    <span className="nhl-label nhl-truncate">{item.family}</span>
                    <strong className="nhl-related-card-name nhl-truncate">{item.name}</strong>
                    <span className="nhl-range-explore">Explore →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
