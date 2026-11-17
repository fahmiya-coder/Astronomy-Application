import { useMemo } from "react";
import katex from "katex";

interface MathBlockProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
}

export function MathBlock({
  latex,
  displayMode = true,
  className = "",
}: MathBlockProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return latex;
    }
  }, [latex, displayMode]);

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

interface RichMathTextProps {
  text: string;
  className?: string;
}

/**
 * Renders prose containing inline `$...$` and block `$$...$$` LaTeX segments cleanly.
 */
export function RichMathText({ text, className = "" }: RichMathTextProps) {
  const segments = useMemo(() => {
    const parts: Array<{ type: "text" | "inline" | "block"; content: string }> = [];
    let remaining = text;

    const regex = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(remaining)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: remaining.slice(lastIndex, match.index),
        });
      }
      const token = match[0];
      if (token.startsWith("$$") && token.endsWith("$$")) {
        parts.push({
          type: "block",
          content: token.slice(2, -2).trim(),
        });
      } else {
        parts.push({
          type: "inline",
          content: token.slice(1, -1).trim(),
        });
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < remaining.length) {
      parts.push({
        type: "text",
        content: remaining.slice(lastIndex),
      });
    }

    return parts;
  }, [text]);

  return (
    <span className={className}>
      {segments.map((seg, idx) => {
        if (seg.type === "text") {
          return <span key={idx}>{seg.content}</span>;
        }
        if (seg.type === "block") {
          return (
            <span key={idx} className="block my-2">
              <MathBlock latex={seg.content} displayMode={true} />
            </span>
          );
        }
        return (
          <MathBlock
            key={idx}
            latex={seg.content}
            displayMode={false}
            className="mx-0.5"
          />
        );
      })}
    </span>
  );
}
