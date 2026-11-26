import { Trash2 } from "lucide-react";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SafeImage } from "../components/SafeImage";
import { useInquiry } from "../context/InquiryContext";
import { categories, CONTACT_AND_FOOTER_COPY } from "../data/nhlData";

type FormErrors = {
  name?: string;
  company?: string;
  email?: string;
  message?: string;
  artwork?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_ARTWORK_BYTES = 10 * 1024 * 1024;

export function ContactPage() {
  const { entries, removeEntry, formatInquiryText, notify } = useInquiry();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState(() => formatInquiryText());
  const [artworkName, setArtworkName] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Pre-fill message when inquiry list is non-empty and user has not typed custom message yet
  useEffect(() => {
    if (entries.length > 0 && !message.trim()) {
      setMessage(formatInquiryText());
    }
  }, [entries, formatInquiryText, message]);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setArtworkName(null);
      setErrors((prev) => ({ ...prev, artwork: undefined }));
      return;
    }
    if (file.size > MAX_ARTWORK_BYTES) {
      setArtworkName(null);
      setErrors((prev) => ({
        ...prev,
        artwork: "File exceeds 10 MB limit. Compress artwork or share a cloud link below.",
      }));
      return;
    }
    setArtworkName(file.name);
    setErrors((prev) => ({ ...prev, artwork: undefined }));
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!name.trim()) next.name = "Please enter your full name.";
    if (!company.trim()) next.company = "Please enter your brand or factory name.";
    if (!email.trim()) {
      next.email = "Please enter your work email address.";
    } else if (!EMAIL_REGEX.test(email.trim())) {
      next.email = "Enter a valid email address (for example buyer@company.com).";
    }
    if (!message.trim()) {
      next.message = "Share trim specifications, finishes, or target quantities.";
    }
    if (errors.artwork) next.artwork = errors.artwork;
    return next;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      // PDF Part 3: Errors requiring decisions belong inline in the form, never in a toast
      const firstErrorField = document.querySelector<HTMLElement>("[aria-invalid='true']");
      firstErrorField?.focus();
      return;
    }

    setErrors({});
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      notify({
        type: "success",
        message: "Inquiry prepared for NHL International sourcing team.",
      });
    }, 320);
  };

  return (
    <main className="nhl-main">
      <section className="nhl-subpage-hero">
        <div className="nhl-container">
          <nav className="nhl-breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="nhl-link">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Contact</span>
          </nav>
          <span className="nhl-label">Contact</span>
          <h1 className="nhl-subpage-title">Request samples or a quotation</h1>
          <p className="nhl-section-sub">
            Our sourcing team will share specifications, minimum order quantities and lead times
            tailored to your production schedule.
          </p>
        </div>
      </section>

      <section className="nhl-section">
        <div className="nhl-container nhl-contact-grid">
          <div className="nhl-contact-form-col">
            {entries.length > 0 && (
              <div className="nhl-contact-shortlist">
                <div className="nhl-contact-shortlist-head">
                  <span className="nhl-label">Your inquiry list ({entries.length})</span>
                </div>
                <ul className="nhl-modal-list">
                  {entries.map((entry) => (
                    <li
                      key={`${entry.trimId}-${entry.finish}-${entry.size}`}
                      className="nhl-modal-row"
                    >
                      <div className="nhl-modal-thumb">
                        <SafeImage
                          src={entry.image}
                          alt={entry.trimName}
                          fallbackLabel={entry.trimName}
                        />
                      </div>
                      <div className="nhl-modal-info">
                        <strong className="nhl-modal-name nhl-truncate">{entry.trimName}</strong>
                        <span className="nhl-modal-meta nhl-truncate">
                          Finish {entry.finish} · Size {entry.size} · Quantity {entry.quantity}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="nhl-btn-ghost nhl-modal-remove"
                        aria-label={`Remove ${entry.trimName}`}
                        onClick={() => removeEntry(entry.trimId, entry.finish, entry.size)}
                      >
                        <Trash2 size={14} aria-hidden="true" />
                        <span>Remove</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {submitted ? (
              <div className="nhl-contact-confirmed" role="status">
                <span className="nhl-label">Inquiry captured</span>
                <h2>Thank you, {name}.</h2>
                <p>
                  Your inquiry for {company} ({email}) has been recorded for our sourcing team at{" "}
                  {CONTACT_AND_FOOTER_COPY.email}.
                </p>
                <button
                  type="button"
                  className="nhl-btn-outline"
                  onClick={() => setSubmitted(false)}
                >
                  Edit or send another inquiry
                </button>
              </div>
            ) : (
              <form className="nhl-underlined-form" onSubmit={handleSubmit} noValidate>
                <div className="nhl-form-row-2">
                  <div className={`nhl-field ${errors.name ? "has-error" : ""}`}>
                    <label htmlFor="c-name">Name *</label>
                    <input
                      id="c-name"
                      type="text"
                      required
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "c-name-error" : undefined}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                      }}
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <span id="c-name-error" className="nhl-field-error" role="alert">
                        {errors.name}
                      </span>
                    )}
                  </div>
                  <div className={`nhl-field ${errors.company ? "has-error" : ""}`}>
                    <label htmlFor="c-company">Company *</label>
                    <input
                      id="c-company"
                      type="text"
                      required
                      aria-invalid={Boolean(errors.company)}
                      aria-describedby={errors.company ? "c-company-error" : undefined}
                      value={company}
                      onChange={(e) => {
                        setCompany(e.target.value);
                        if (errors.company) setErrors((p) => ({ ...p, company: undefined }));
                      }}
                      placeholder="Brand or factory name"
                    />
                    {errors.company && (
                      <span id="c-company-error" className="nhl-field-error" role="alert">
                        {errors.company}
                      </span>
                    )}
                  </div>
                </div>

                <div className="nhl-form-row-2">
                  <div className={`nhl-field ${errors.email ? "has-error" : ""}`}>
                    <label htmlFor="c-email">Email *</label>
                    <input
                      id="c-email"
                      type="email"
                      required
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "c-email-error" : undefined}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                      }}
                      placeholder="name@company.com"
                    />
                    {errors.email && (
                      <span id="c-email-error" className="nhl-field-error" role="alert">
                        {errors.email}
                      </span>
                    )}
                  </div>
                  <div className="nhl-field">
                    <label htmlFor="c-phone">Phone</label>
                    <input
                      id="c-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+94 77 ..."
                    />
                  </div>
                </div>

                <div className="nhl-form-row-2">
                  <div className="nhl-field">
                    <label htmlFor="c-category">Category</label>
                    <select
                      id="c-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">Select a trim category</option>
                      {categories.map((cat) => (
                        <option key={cat.slug} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="nhl-field">
                    <label htmlFor="c-quantity">Quantity</label>
                    <input
                      id="c-quantity"
                      type="text"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="e.g. 10,000 pcs"
                    />
                  </div>
                </div>

                <div className={`nhl-field ${errors.message ? "has-error" : ""}`}>
                  <label htmlFor="c-message">Message *</label>
                  <textarea
                    id="c-message"
                    rows={6}
                    required
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "c-message-error" : undefined}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message) setErrors((p) => ({ ...p, message: undefined }));
                    }}
                    placeholder="Share trim specifications, finishes, Pantone references or delivery schedule."
                  />
                  {errors.message && (
                    <span id="c-message-error" className="nhl-field-error" role="alert">
                      {errors.message}
                    </span>
                  )}
                </div>

                <div className={`nhl-field ${errors.artwork ? "has-error" : ""}`}>
                  <label htmlFor="c-artwork">Artwork upload</label>
                  <input
                    id="c-artwork"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.ai,.eps"
                    aria-invalid={Boolean(errors.artwork)}
                    aria-describedby={errors.artwork ? "c-artwork-error" : undefined}
                    onChange={handleFile}
                  />
                  {artworkName && (
                    <span className="nhl-field-file nhl-truncate">Attached: {artworkName}</span>
                  )}
                  {errors.artwork && (
                    <span id="c-artwork-error" className="nhl-field-error" role="alert">
                      {errors.artwork}
                    </span>
                  )}
                </div>

                <div className="nhl-form-actions">
                  <button
                    type="submit"
                    className="nhl-btn-solid"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="nhl-spinner nhl-spinner--light" aria-hidden="true" />
                        <span>Preparing inquiry...</span>
                      </>
                    ) : (
                      <span>Send inquiry</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          <aside className="nhl-contact-aside">
            <div className="nhl-contact-details">
              <div className="nhl-contact-detail-row">
                <span className="nhl-label">Telephone</span>
                <a className="nhl-link" href={`tel:${CONTACT_AND_FOOTER_COPY.phone.replace(/\s+/g, "")}`}>
                  {CONTACT_AND_FOOTER_COPY.phone}
                </a>
              </div>
              <div className="nhl-contact-detail-row">
                <span className="nhl-label">Email</span>
                <a className="nhl-link" href={`mailto:${CONTACT_AND_FOOTER_COPY.email}`}>
                  {CONTACT_AND_FOOTER_COPY.email}
                </a>
              </div>
              <div className="nhl-contact-detail-row">
                <span className="nhl-label">{CONTACT_AND_FOOTER_COPY.colomboOfficeLabel}</span>
                <p>{CONTACT_AND_FOOTER_COPY.colomboAddress}</p>
              </div>
              <div className="nhl-contact-detail-row">
                <span className="nhl-label">{CONTACT_AND_FOOTER_COPY.ningboOfficeLabel}</span>
                <p>{CONTACT_AND_FOOTER_COPY.ningboAddress}</p>
              </div>
            </div>

            <div className="nhl-contact-map">
              <div className="nhl-footer-map-head">
                <span className="nhl-label">Kotte Office Map</span>
                <a
                  href={CONTACT_AND_FOOTER_COPY.kotteMapDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nhl-link nhl-footer-map-link"
                >
                  Open in Google Maps →
                </a>
              </div>
              <div className="nhl-map-frame nhl-map-frame--tall">
                <iframe
                  title="NHL International Colombo Regional Office — Nawala Road, Kotte"
                  src={CONTACT_AND_FOOTER_COPY.kotteMapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
