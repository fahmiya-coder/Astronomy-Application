import { useState } from "react";
import { Check, Copy, Download, ExternalLink, Search } from "lucide-react";
import { PYTHON_PROJECTS } from "../data/pythonProjects";
import { RichMathText } from "./MathBlock";

const SUGGESTED_INVESTIGATIONS = [
  {
    star: "Betelgeuse",
    query:
      "What are the latest JWST, HST, and radial-velocity findings on Betelgeuse's Great Dimming and possible binary companion?",
  },
  {
    star: "R136a1",
    query:
      "How did Gemini South Zorro speckle imaging and VLT observations revise the mass of R136a1 and the stellar upper mass limit?",
  },
  {
    star: "Polaris",
    query:
      "Summarize the 2024 CHARA interferometry and Gaia DR3 Polaris B constraints on Polaris's dynamical mass, radius, and Cepheid mass discrepancy.",
  },
  {
    star: "Thorne-Zytkow Objects",
    query:
      "What is the current peer-reviewed scientific consensus and debate regarding Thorne-Zytkow object candidate HV 2112?",
  },
];

interface GroundedResponse {
  synthesis: string;
  sources: Array<{ title: string; uri: string }>;
  investigatedAt: string;
}

export function ResearchLabView() {
  const [query, setQuery] = useState("");
  const [focusStar, setFocusStar] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GroundedResponse | null>(null);

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    PYTHON_PROJECTS[0].id
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeProject =
    PYTHON_PROJECTS.find((p) => p.id === selectedProjectId) ??
    PYTHON_PROJECTS[0];

  async function runInvestigation(customQuery?: string, customStar?: string) {
    const q = (customQuery ?? query).trim();
    if (!q || loading) return;

    if (customQuery) setQuery(customQuery);
    if (customStar !== undefined) setFocusStar(customStar);

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/research/investigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          focusStar: customStar ?? focusStar,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Research investigation failed.");
      }
      setResult(data as GroundedResponse);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to complete literature synthesis."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleCopyCode(id: string, code: string) {
    navigator.clipboard?.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  }

  function handleDownloadScript(id: string, code: string) {
    const blob = new Blob([code], { type: "text/x-python" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${id}.py`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-[1380px] px-6 py-8 space-y-14">
      {/* MODULE 12: GROUNDED SCIENTIFIC RESEARCH ASSISTANT */}
      <section className="space-y-6">
        <div className="space-y-2 border-b border-slate-800/80 pb-5">
          <div className="text-xs font-mono text-cyan-400">
            Module 12 · Grounded Scientific Literature &amp; Discovery Assistant
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-100">
            Astrophysics Research &amp; Computational Lab
          </h1>
          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            Query current astrophysics literature prioritized from NASA, ESA, ESO, and
            peer-reviewed journals. Responses separate empirically confirmed observations from
            theoretical models, conflicting studies, and open scientific questions.
          </p>
        </div>

        <div className="border border-slate-800 rounded-lg bg-[#0B0F17] p-6 space-y-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runInvestigation();
            }}
            className="grid grid-cols-1 md:grid-cols-12 gap-3"
          >
            <input
              type="text"
              value={focusStar}
              onChange={(e) => setFocusStar(e.target.value)}
              placeholder="Target star or object (optional)"
              aria-label="Target star or object"
              className="md:col-span-3 px-3.5 py-2.5 text-sm bg-[#07090E] border border-slate-800 rounded-md text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter an astrophysics research question (e.g. JWST observations of Betelgeuse dust)..."
              aria-label="Astrophysics research question"
              className="md:col-span-7 px-3.5 py-2.5 text-sm bg-[#07090E] border border-slate-800 rounded-md text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="md:col-span-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-cyan-400 text-slate-950 rounded-md hover:bg-cyan-300 disabled:opacity-40 transition-colors whitespace-nowrap shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{loading ? "Investigating..." : "Investigate"}</span>
            </button>
          </form>

          {/* Suggested peer-reviewed inquiries */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-400">
              Benchmark Research Inquiries
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {SUGGESTED_INVESTIGATIONS.map((item) => (
                <button
                  key={item.star}
                  type="button"
                  onClick={() => runInvestigation(item.query, item.star)}
                  className="text-left p-3 rounded border border-slate-800/90 bg-[#07090E]/70 hover:border-cyan-500/60 transition-colors text-xs text-slate-300"
                >
                  <span className="font-mono text-cyan-400 mr-2">
                    {item.star} ·
                  </span>
                  {item.query}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-md border border-rose-500/40 bg-rose-950/30 text-xs text-rose-300">
              {error}
            </div>
          )}

          {result && (
            <div className="pt-5 border-t border-slate-800 space-y-6">
              <div className="text-sm text-slate-200 leading-[1.75] whitespace-pre-wrap">
                <RichMathText text={result.synthesis} />
              </div>

              {result.sources.length > 0 && (
                <div className="pt-4 border-t border-slate-800/80 space-y-2">
                  <div className="text-xs font-mono text-emerald-400">
                    Verified Grounding Sources &amp; Observatory References
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {result.sources.map((src, idx) => (
                      <li key={idx}>
                        <a
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-2 p-2.5 rounded border border-slate-800 bg-[#07090E] text-cyan-300 hover:border-cyan-500/60 transition-colors"
                        >
                          <span className="truncate">{src.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* MODULE 10: COMPUTATIONAL PYTHON STELLAR RESEARCH WORKBENCH */}
      <section className="space-y-6 pt-4 border-t border-slate-800/80">
        <div>
          <div className="text-xs font-mono text-amber-400">
            Module 10 · University-Level Computational Stellar Research
          </div>
          <h2 className="font-display text-2xl font-semibold text-slate-100">
            Python Astrophysics Pipelines (NumPy · SciPy · Matplotlib · Astropy · Pandas)
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 space-y-2">
            {PYTHON_PROJECTS.map((proj) => {
              const active = proj.id === activeProject.id;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => setSelectedProjectId(proj.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors space-y-1.5 ${
                    active
                      ? "border-cyan-500/60 bg-cyan-500/10"
                      : "border-slate-800 bg-[#0B0F17] hover:border-slate-700"
                  }`}
                >
                  <div className="text-xs font-mono text-cyan-400">
                    {proj.libraries.join(" · ")}
                  </div>
                  <div className="text-sm font-semibold text-slate-100 leading-snug">
                    {proj.title}
                  </div>
                  <div className="text-xs text-slate-400">
                    {proj.datasetSource}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-8 border border-slate-800 rounded-lg bg-[#0B0F17] p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div className="space-y-1">
                <h3 className="font-display text-lg font-semibold text-slate-100">
                  {activeProject.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeProject.objective}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    handleCopyCode(activeProject.id, activeProject.code)
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-700 rounded text-slate-200 hover:border-slate-500"
                >
                  {copiedId === activeProject.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedId === activeProject.id ? "Copied" : "Copy"}</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleDownloadScript(activeProject.id, activeProject.code)
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-cyan-400 text-slate-950 rounded hover:bg-cyan-300"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .py</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-mono text-slate-400 block mb-1">
                  Physical Principles
                </span>
                <span className="text-slate-200">
                  {activeProject.astrophysicsConcept}
                </span>
              </div>
              <div>
                <span className="font-mono text-slate-400 block mb-1">
                  Expected Scientific Output
                </span>
                <span className="text-emerald-300">
                  {activeProject.expectedOutput}
                </span>
              </div>
            </div>

            <pre className="p-4 rounded-md bg-[#07090E] border border-slate-800 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed">
              <code>{activeProject.code}</code>
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
