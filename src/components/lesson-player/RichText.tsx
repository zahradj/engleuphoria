import React from 'react';

/**
 * RichText — renders a string with markdown-style **double-asterisk** highlighting.
 *
 * Used by Reading / Concept / Story / Vocab slides to highlight target
 * vocabulary inside long-form AI-generated text. The asterisks are stripped
 * entirely from the output and the matched text is wrapped in a premium,
 * educational pill (hub-themed via `highlightClassName`).
 *
 * Safe against XSS — we only render text nodes, never innerHTML.
 */
export interface RichTextProps {
  text: string;
  /** Tailwind classes for the highlighted span. */
  highlightClassName?: string;
  /** @deprecated alias for highlightClassName, kept for back-compat. */
  boldClassName?: string;
  /** Optional element wrapper (defaults to fragment). */
  as?: 'span' | 'p' | 'div';
  className?: string;
}

const DEFAULT_HIGHLIGHT =
  'bg-primary/15 text-primary font-bold px-1.5 py-0.5 rounded-md shadow-sm';

export const RichText: React.FC<RichTextProps> = ({
  text,
  highlightClassName,
  boldClassName,
  as,
  className,
}) => {
  if (!text) return null;
  const cls = highlightClassName ?? boldClassName ?? DEFAULT_HIGHLIGHT;

  // Split on **...**; even indices are plain, odd indices are highlighted.
  const parts = text.split(/\*\*(.+?)\*\*/g);
  const nodes = parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className={cls}>
        {part}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );

  if (as === 'p') return <p className={className}>{nodes}</p>;
  if (as === 'div') return <div className={className}>{nodes}</div>;
  if (as === 'span') return <span className={className}>{nodes}</span>;
  return <>{nodes}</>;
};

export default RichText;
