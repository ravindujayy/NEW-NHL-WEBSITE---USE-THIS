import type { Category } from "./siteData";

export interface ContactFormState {
  name: string;
  company: string;
  email: string;
  country: string;
  category: string;
  quantity: string;
  message: string;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormState, string>>;

export function filterCategories(
  allCategories: Category[],
  query: string,
  inquiryItems: string[],
  onlyInInquiry: boolean
): Category[] {
  const normalizedQuery = query.trim().toLowerCase();
  return allCategories.filter((category) => {
    const matchesQuery =
      !normalizedQuery ||
      category.name.toLowerCase().includes(normalizedQuery) ||
      category.short.toLowerCase().includes(normalizedQuery);
    const matchesInquiry =
      !onlyInInquiry || inquiryItems.some((item) => item.startsWith(category.name));
    return matchesQuery && matchesInquiry;
  });
}

export function addInquiryItem(items: string[], nextItem: string): {
  items: string[];
  added: boolean;
} {
  const trimmed = nextItem.trim();
  if (!trimmed || items.includes(trimmed)) {
    return { items, added: false };
  }
  return { items: [...items, trimmed], added: true };
}

export function removeInquiryItem(
  items: string[],
  targetItem: string
): {
  items: string[];
  removedIndex: number;
} {
  const removedIndex = items.indexOf(targetItem);
  if (removedIndex === -1) {
    return { items, removedIndex: -1 };
  }
  return {
    items: items.filter((entry) => entry !== targetItem),
    removedIndex,
  };
}

export function restoreInquiryItem(
  items: string[],
  item: string,
  index: number
): string[] {
  if (items.includes(item)) return items;
  const next = [...items];
  const insertAt = Math.max(0, Math.min(index, next.length));
  next.splice(insertAt, 0, item);
  return next;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(form: ContactFormState): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!form.name.trim()) {
    errors.name = "Please enter your name.";
  } else if (form.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (!form.company.trim()) {
    errors.company = "Please enter your company or brand name.";
  }

  if (!form.email.trim()) {
    errors.email = "Please enter a work email address.";
  } else if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = "Enter a valid email address (e.g. buyer@brand.com).";
  }

  if (!form.country.trim()) {
    errors.country = "Please enter your destination country.";
  }

  if (!form.message.trim()) {
    errors.message = "Share brief details about your trims, timeline, or sampling needs.";
  } else if (form.message.trim().length < 10) {
    errors.message = "Please add a few more details (at least 10 characters).";
  }

  return errors;
}

const ALLOWED_EXTENSIONS = [".pdf", ".png", ".jpg", ".jpeg", ".ai", ".eps"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export function validateArtworkFile(
  file: { name: string; size: number } | null
): string | null {
  if (!file) return null;
  const lower = file.name.toLowerCase();
  const hasAllowedExtension = ALLOWED_EXTENSIONS.some((ext) => lower.endsWith(ext));
  if (!hasAllowedExtension) {
    return "Unsupported format. Upload PDF, PNG, JPG, AI, or EPS files.";
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "File exceeds the 10 MB limit. Share a lighter file or compress it first.";
  }
  return null;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
