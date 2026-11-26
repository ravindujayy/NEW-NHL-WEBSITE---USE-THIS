import { ArrowRight, Download, Minus, Plus, Trash2, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInquiry } from "../context/InquiryContext";
import { RUNWAY_COPY } from "../data/nhlData";
import { SafeImage } from "./SafeImage";

export function InquiryModal() {
  const {
    entries,
    modalOpen,
    setModalOpen,
    updateQuantity,
    removeEntry,
    clearAll,
    formatInquiryText,
    notify,
  } = useInquiry();
  const navigate = useNavigate();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!modalOpen) return;
    closeBtnRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalOpen, setModalOpen]);

  if (!modalOpen) return null;

  const handleDownload = () => {
    try {
      const content = formatInquiryText();
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "nhl-inquiry-list.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      notify({ type: "success", message: "Inquiry shortlist downloaded" });
    } catch {
      notify({
        type: "error",
        message: "Unable to download inquiry file in this browser.",
      });
    }
  };

  const handleSendInquiry = () => {
    setModalOpen(false);
    navigate("/contact", { state: { prefillFromInquiry: true } });
  };

  return (
    <div className="nhl-modal-layer" role="presentation">
      <div
        className="nhl-modal-scrim"
        aria-hidden="true"
        onClick={() => setModalOpen(false)}
      />
      <div
        className="nhl-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="nhl-inquiry-modal-title"
      >
        <div className="nhl-modal-head">
          <div className="nhl-min-0">
            <h2 id="nhl-inquiry-modal-title">{RUNWAY_COPY.modalTitle}</h2>
            <p className="nhl-modal-note">{RUNWAY_COPY.modalNote}</p>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            className="nhl-modal-close"
            aria-label="Close inquiry list"
            onClick={() => setModalOpen(false)}
          >
            <X size={18} strokeWidth={1.6} aria-hidden="true" />
          </button>
        </div>

        <div className="nhl-modal-body">
          {entries.length === 0 ? (
            <div className="nhl-empty-state">
              <p className="nhl-modal-empty">{RUNWAY_COPY.modalEmpty}</p>
            </div>
          ) : (
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
                      Finish {entry.finish} · Size {entry.size}
                    </span>
                    <div className="nhl-qty-stepper" aria-label={`Quantity for ${entry.trimName}`}>
                      <button
                        type="button"
                        className="nhl-qty-btn"
                        aria-label={`Decrease quantity for ${entry.trimName}`}
                        onClick={() => updateQuantity(entry.trimId, entry.finish, entry.size, -1)}
                      >
                        <Minus size={12} aria-hidden="true" />
                      </button>
                      <span className="nhl-qty-val tabular-nums">{entry.quantity}</span>
                      <button
                        type="button"
                        className="nhl-qty-btn"
                        aria-label={`Increase quantity for ${entry.trimName}`}
                        onClick={() => updateQuantity(entry.trimId, entry.finish, entry.size, 1)}
                      >
                        <Plus size={12} aria-hidden="true" />
                      </button>
                    </div>
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
          )}
        </div>

        {entries.length > 0 && (
          <div className="nhl-modal-foot">
            <button
              type="button"
              className="nhl-btn-ghost nhl-modal-clear"
              onClick={clearAll}
            >
              Clear list
            </button>
            <div className="nhl-modal-foot-actions">
              <button
                type="button"
                className="nhl-btn-outline nhl-modal-download"
                onClick={handleDownload}
              >
                <Download size={14} aria-hidden="true" />
                <span>{RUNWAY_COPY.modalDownloadLabel}</span>
              </button>
              <button
                type="button"
                className="nhl-btn-solid nhl-modal-send"
                onClick={handleSendInquiry}
              >
                <span>{RUNWAY_COPY.modalSendLabel}</span>
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
