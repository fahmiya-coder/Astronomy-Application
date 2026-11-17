import { useState } from "react";
import { Send, X } from "lucide-react";
import { RichMathText } from "./MathBlock";

interface MentorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contextModuleTitle?: string;
}

interface ChatTurn {
  role: "user" | "model";
  text: string;
}

const STARTER_QUESTIONS = [
  "Walk me step-by-step through deriving hydrostatic equilibrium dP/dr = -GMρ/r².",
  "Why does the CNO cycle require a convective core while the pp-chain produces a radiative core?",
  "How do astronomers separate measured parallax uncertainty from dust extinction in Betelgeuse?",
];

export function MentorDrawer({
  isOpen,
  onClose,
  contextModuleTitle,
}: MentorDrawerProps) {
  const [history, setHistory] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function sendMessage(textToSend?: string) {
    const query = (textToSend ?? input).trim();
    if (!query || loading) return;

    setError(null);
    const nextHistory: ChatTurn[] = [...history, { role: "user", text: query }];
    setHistory(nextHistory);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/mentor/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history,
          message: query,
          contextModule: contextModuleTitle,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to reach astrophysics mentor.");
      }
      setHistory([...nextHistory, { role: "model", text: data.reply }]);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Request failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Astrophysics Professor & Research Mentor"
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs"
    >
      <div className="w-full max-w-xl h-full bg-[#0A0E17] border-l border-slate-800 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 className="font-display text-base font-semibold text-slate-100">
              Astrophysics Professor &amp; Mentor
            </h2>
            <p className="text-xs text-slate-400">
              {contextModuleTitle
                ? `Active context · ${contextModuleTitle}`
                : "Derivations, stellar models & observational data interpretation"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close mentor panel"
            className="p-2 text-slate-400 hover:text-slate-100 rounded-md hover:bg-slate-800/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {history.length === 0 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-300 leading-relaxed">
                Ask for first-principles derivations, clarification on nuclear reaction networks,
                guidance on reading stellar evolution papers, or help interpreting observational
                spectra and Gaia parallax errors.
              </p>
              <div className="space-y-2">
                <div className="text-xs font-mono text-slate-400">
                  Suggested questions
                </div>
                {STARTER_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => sendMessage(q)}
                    className="w-full text-left p-3 text-xs text-slate-200 border border-slate-800 rounded-md bg-[#07090E] hover:border-cyan-500/60 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {history.map((turn, idx) => (
            <div
              key={idx}
              className={`space-y-1.5 ${
                turn.role === "user"
                  ? "pl-8 text-right"
                  : "pr-4 border-b border-slate-800/70 pb-4"
              }`}
            >
              <div className="text-xs font-mono text-slate-400">
                {turn.role === "user" ? "Researcher" : "Astrophysics Professor"}
              </div>
              <div
                className={`text-sm leading-relaxed whitespace-pre-wrap ${
                  turn.role === "user"
                    ? "inline-block text-left px-4 py-2.5 rounded-md bg-slate-800/80 text-slate-100"
                    : "text-slate-200"
                }`}
              >
                <RichMathText text={turn.text} />
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-xs font-mono text-cyan-400">
              Synthesizing astrophysics explanation...
            </div>
          )}

          {error && (
            <div className="p-3 rounded-md border border-rose-500/40 bg-rose-950/30 text-xs text-rose-300">
              {error}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="p-4 border-t border-slate-800 bg-[#07090E] flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask an astrophysics question or request a derivation..."
            className="flex-1 px-3.5 py-2.5 text-sm bg-[#0B0F17] border border-slate-800 rounded-md text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold bg-cyan-400 text-slate-950 rounded-md hover:bg-cyan-300 disabled:opacity-40 transition-colors whitespace-nowrap shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
