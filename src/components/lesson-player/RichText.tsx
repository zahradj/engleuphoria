import React from 'react';

/**
 * Render a string with **double-asterisk** markdown bolding.
 * Used by the Reading layout to highlight target vocabulary inside passages.
 *
 * Intentionally minimal — no full markdown parser, just `**word**` → <strong>.
 * Safe against XSS because we never set innerHTML; we render text nodes.
 */
export const RichText: React.FC<{ text: string; boldClassName?: string }> = ({
  text,
  boldClassName = 'font-bold text-violet-700 dark:text-violet-300',
}) => {
  if (!text) return null;
  // Split on **...**; even indices are plain, odd indices are bold.
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className={boldClassName}>
            {part}
          </strong>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  );
};

export default RichText;
