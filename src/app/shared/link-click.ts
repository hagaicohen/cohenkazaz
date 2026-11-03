/**
 * האם הלחיצה על קישור פנימי צריכה להיות מטופלת באתר (מעבר חלק בלי טעינה),
 * או להישאר לדפדפן – Ctrl/Cmd/Shift-click לפתיחה בלשונית או בחלון חדשים.
 */
export function isPlainLeftClick(event?: Event): boolean {
  if (!(event instanceof MouseEvent)) return true;
  return event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey;
}
