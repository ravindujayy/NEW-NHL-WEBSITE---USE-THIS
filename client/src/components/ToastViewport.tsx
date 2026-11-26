import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type ToastType = "success" | "info" | "warning" | "error";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  action?: ToastAction;
  durationMs?: number | null; // null = stays until manually dismissed
}

interface ToastRowProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

function ToastRow({ toast, onDismiss }: ToastRowProps) {
  const [paused, setPaused] = useState(false);

  // Rules from PDF Part 3:
  // - If a toast contains an action, never auto-dismiss it
  // - Error persists until dismissed
  // - Warning stays longer (8s)
  // - Success / Info auto-dismiss in 5s
  const defaultDuration =
    toast.action || toast.type === "error"
      ? null
      : toast.type === "warning"
        ? 8000
        : 5000;

  const targetMs = toast.durationMs !== undefined ? toast.durationMs : defaultDuration;
  const remainingRef = useRef<number>(targetMs ?? 0);
  const startedAtRef = useRef<number>(0);

  useEffect(() => {
    remainingRef.current = targetMs ?? 0;
  }, [targetMs, toast.id]);

  useEffect(() => {
    if (targetMs === null || paused) return;
    if (remainingRef.current <= 0) {
      onDismiss(toast.id);
      return;
    }

    startedAtRef.current = performance.now();
    const timer = window.setTimeout(() => {
      onDismiss(toast.id);
    }, remainingRef.current);

    return () => {
      window.clearTimeout(timer);
      const elapsed = performance.now() - startedAtRef.current;
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    };
  }, [paused, targetMs, toast.id, onDismiss]);

  const icon =
    toast.type === "success" ? (
      <CheckCircle2 size={16} strokeWidth={2} className="nhl-toast-icon is-success" aria-hidden="true" />
    ) : toast.type === "info" ? (
      <Info size={16} strokeWidth={2} className="nhl-toast-icon is-info" aria-hidden="true" />
    ) : toast.type === "warning" ? (
      <AlertTriangle size={16} strokeWidth={2} className="nhl-toast-icon is-warning" aria-hidden="true" />
    ) : (
      <AlertCircle size={16} strokeWidth={2} className="nhl-toast-icon is-error" aria-hidden="true" />
    );

  return (
    <div
      className={`nhl-toast nhl-toast--${toast.type}`}
      role={toast.type === "error" || toast.type === "warning" ? "alert" : "status"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      {/* 1. Icon */}
      <span className="nhl-toast-icon-wrap">{icon}</span>

      {/* 2. Short, specific message */}
      <span className="nhl-toast-msg">{toast.message}</span>

      {/* 3. Optional Action */}
      {toast.action && (
        <button
          type="button"
          className="nhl-toast-action"
          onClick={() => {
            toast.action?.onClick();
            onDismiss(toast.id);
          }}
        >
          {toast.action.label}
        </button>
      )}

      {/* 4. Close button */}
      <button
        type="button"
        className="nhl-toast-close"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(toast.id)}
      >
        <X size={14} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  );
}

export function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  // Max 3 visible at once; rest stay queued in provider state until slots free up
  const visible = toasts.slice(0, 3);
  const politeItems = visible.filter((t) => t.type !== "error");
  const assertiveItems = visible.filter((t) => t.type === "error");

  return (
    <aside className="nhl-toast-viewport" aria-label="Notifications">
      <div className="nhl-toast-stack" aria-live="polite" aria-relevant="additions text">
        {politeItems.map((toast) => (
          <ToastRow key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </div>
      <div className="nhl-toast-stack" aria-live="assertive" aria-relevant="additions text">
        {assertiveItems.map((toast) => (
          <ToastRow key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </div>
    </aside>
  );
}
