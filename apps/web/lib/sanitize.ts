import DOMPurify from "dompurify";

export function sanitizeHtml(dirty: string | null | undefined): string {
  if (!dirty) return "";
  return DOMPurify.sanitize(dirty);
}
