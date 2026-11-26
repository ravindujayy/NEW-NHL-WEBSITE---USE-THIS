import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ToastViewport, type ToastAction, type ToastItem, type ToastType } from "../components/ToastViewport";
import { RUNWAY_COPY } from "../data/nhlData";

export interface InquiryEntry {
  trimId: string;
  trimName: string;
  categorySlug: string;
  image: string;
  finish: string;
  size: string;
  quantity: number;
}

interface ToastPayload {
  type: ToastType;
  message: string;
  action?: ToastAction;
  durationMs?: number | null;
}

interface InquiryContextValue {
  entries: InquiryEntry[];
  totalCount: number;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  addEntry: (entry: Omit<InquiryEntry, "quantity"> & { quantity?: number }, silent?: boolean) => void;
  addBundle: (items: Array<Omit<InquiryEntry, "quantity"> & { quantity?: number }>) => void;
  updateQuantity: (trimId: string, finish: string, size: string, delta: number) => void;
  removeEntry: (trimId: string, finish: string, size: string) => void;
  clearAll: () => void;
  hasTrimConfigured: (trimId: string) => boolean;
  formatInquiryText: () => string;
  notify: (payload: ToastPayload) => void;
}

export const INQUIRY_STORAGE_KEY = "nhl-inquiry-list-v1";

const InquiryContext = createContext<InquiryContextValue | null>(null);

export function useInquiry() {
  const ctx = useContext(InquiryContext);
  if (!ctx) throw new Error("useInquiry must be used inside InquiryProvider");
  return ctx;
}

function readStoredEntries(): InquiryEntry[] {
  try {
    const raw = localStorage.getItem(INQUIRY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is InquiryEntry =>
        Boolean(item) &&
        typeof item.trimId === "string" &&
        typeof item.finish === "string" &&
        typeof item.size === "string" &&
        typeof item.quantity === "number"
    );
  } catch {
    return [];
  }
}

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<InquiryEntry[]>(() => readStoredEntries());
  const [modalOpen, setModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(INQUIRY_STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // Best-effort persistence in private browsing
    }
  }, [entries]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback((payload: ToastPayload) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, ...payload }]);
  }, []);

  const upsertIntoList = (
    list: InquiryEntry[],
    incoming: Omit<InquiryEntry, "quantity"> & { quantity?: number }
  ): InquiryEntry[] => {
    const qty = incoming.quantity ?? 1;
    const idx = list.findIndex(
      (item) =>
        item.trimId === incoming.trimId &&
        item.finish === incoming.finish &&
        item.size === incoming.size
    );
    if (idx !== -1) {
      const next = [...list];
      next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
      return next;
    }
    return [...list, { ...incoming, quantity: qty }];
  };

  const addEntry = useCallback(
    (incoming: Omit<InquiryEntry, "quantity"> & { quantity?: number }, silent = false) => {
      setEntries((prev) => upsertIntoList(prev, incoming));
      if (!silent) {
        notify({
          type: "success",
          message: RUNWAY_COPY.toastSingle,
        });
      }
    },
    [notify]
  );

  const addBundle = useCallback(
    (items: Array<Omit<InquiryEntry, "quantity"> & { quantity?: number }>) => {
      setEntries((prev) => {
        let next = [...prev];
        for (const item of items) {
          next = upsertIntoList(next, item);
        }
        return next;
      });
      notify({
        type: "success",
        message: RUNWAY_COPY.toastBundle,
      });
    },
    [notify]
  );

  const updateQuantity = useCallback(
    (trimId: string, finish: string, size: string, delta: number) => {
      setEntries((prev) =>
        prev
          .map((item) => {
            if (item.trimId === trimId && item.finish === finish && item.size === size) {
              return { ...item, quantity: Math.max(0, item.quantity + delta) };
            }
            return item;
          })
          .filter((item) => item.quantity > 0)
      );
    },
    []
  );

  const removeEntry = useCallback(
    (trimId: string, finish: string, size: string) => {
      setEntries((prev) => {
        const target = prev.find(
          (item) => item.trimId === trimId && item.finish === finish && item.size === size
        );
        if (target) {
          notify({
            type: "info",
            message: `${target.trimName} removed from inquiry list`,
            action: {
              label: "Undo",
              onClick: () => {
                setEntries((cur) => upsertIntoList(cur, target));
              },
            },
          });
        }
        return prev.filter(
          (item) => !(item.trimId === trimId && item.finish === finish && item.size === size)
        );
      });
    },
    [notify]
  );

  const clearAll = useCallback(() => {
    setEntries((prev) => {
      if (prev.length === 0) return prev;
      const snapshot = [...prev];
      notify({
        type: "warning",
        message: "Inquiry list cleared",
        action: {
          label: "Undo",
          onClick: () => setEntries(snapshot),
        },
      });
      return [];
    });
  }, [notify]);

  const hasTrimConfigured = useCallback(
    (trimId: string) => entries.some((entry) => entry.trimId === trimId),
    [entries]
  );

  const totalCount = useMemo(
    () => entries.reduce((sum, entry) => sum + entry.quantity, 0),
    [entries]
  );

  const formatInquiryText = useCallback(() => {
    if (entries.length === 0) return "";
    const lines = entries.map(
      (entry, i) =>
        `${i + 1}. ${entry.trimName} — Finish ${entry.finish} · Size ${entry.size} · Quantity ${entry.quantity}`
    );
    return `NHL International — Trim Inquiry List\n\n${lines.join("\n")}\n\nPlease share specifications, MOQ and lead times for these items.`;
  }, [entries]);

  return (
    <InquiryContext.Provider
      value={{
        entries,
        totalCount,
        modalOpen,
        setModalOpen,
        addEntry,
        addBundle,
        updateQuantity,
        removeEntry,
        clearAll,
        hasTrimConfigured,
        formatInquiryText,
        notify,
      }}
    >
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </InquiryContext.Provider>
  );
}
