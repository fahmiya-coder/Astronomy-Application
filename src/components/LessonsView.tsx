import { useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Send,
  BookMarked,
} from "lucide-react";
import { CURRICULUM_MODULES } from "../data/curriculumModules";
import { STELLAR_TYPES } from "../data/stellarTypes";
import {
  DifficultyTier,
  EvaluationResponse,
} from "../types/astrophysics";
import { MathBlock, RichMathText } from "./MathBlock";

interface LessonsViewProps {
  selectedModuleId: number;
  onSelectModule: (id: number) => void;
  completedModules: number[];
  onToggleComplete: (id: number) => void;
}

const TIERS: DifficultyTier[] = [
  "Beginner",
  "Intermediate",
  "University Research",
];

const MASS_REGIME_MATRIX = [
  {
    regime: "Low-Mass Stars",
    mass: "0.08 – 0.50 M☉",
    corePhysics: "Fully convective (<0.35 M☉); pp-I chain; never ignites helium",
    lifespan: "50 Gyr – 10+ Tyr",
    finalFate: "Helium White Dwarf (no planetary nebula)",
  },
  {
    regime: "Sun-Like Stars",
    mass: "0.80 – 2.00 M☉",
    corePhysics: "Radiative core + convective envelope; degenerate He flash at RGB tip",
    lifespan: "1.5 – 15 Gyr",
    finalFate: "Planetary Nebula + C/O White Dwarf (~0.5–0.65 M☉)",
  },
  {
    regime: "Intermediate-Mass",
    mass: "2.00 – 8.00 M☉",
    corePhysics: "CNO convective core; smooth non-degenerate He ignition; AGB dredge-up",
    lifespan: "40 Myr – 1.5 Gyr",
    finalFate: "Massive C/O or O/Ne/Mg White Dwarf (up to ~1.3 M☉)",
  },
  {
    regime: "Massive Stars",
    mass: "8.0 – 40 M☉",
    corePhysics: "Sequential C, Ne, O, Si onion-shell burning to Fe/Ni core collapse",
    lifespan: "5 – 40 Myr",
    finalFate: "Type II / Ib / Ic Supernova → Neutron Star or Black Hole",
  },
  {
    regime: "Extremely Massive",
    mass: "> 40 – 260 M☉",
    corePhysics: "Eddington LBV eruptions, Wolf-Rayet winds, or e⁻e⁺ Pair Instability",
    lifespan: "2 – 5 Myr",
    finalFate: "Collapsar Black Hole or Pair-Instability SN (zero remnant)",
  },
];

export function LessonsView({
  selectedModuleId,
  onSelectModule,
  completedModules,
  onToggleComplete,
}: LessonsViewProps) {
  const activeModule =
    CURRICULUM_MODULES.find((m) => m.id === selectedModuleId) ??
    CURRICULUM_MODULES[0];

  const [tier, setTier] = useState<DifficultyTier>("Beginner");
  const [selectedStellarTypeId, setSelectedStellarTypeId] = useState<string>(
    STELLAR_TYPES[0].id
  );
  const [revealedSolutions, setRevealedSolutions] = useState<
    Record<string, boolean>
  >({});
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  const [openAnswers, setOpenAnswers] = useState<Record<string, string>>({});
  const [evaluations, setEvaluations] = useState<
    Record<string, EvaluationResponse>
  >({});
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  const [evalError, setEvalError] = useState<Record<string, string>>({});
  const [revealedRubrics, setRevealedRubrics] = useState<
    Record<string, boolean>
  >({});

  const selectedStellarType =
    STELLAR_TYPES.find((t) => t.id === selectedStellarTypeId) ??
    STELLAR_TYPES[0];

  const moduleMcqScore = activeModule.mcqs.reduce((acc, q) => {
    return acc + (mcqAnswers[q.id] === q.correctIndex ? 1 : 0);
  }, 0);
  const moduleMcqAnswered = activeModule.mcqs.filter(
    (q) => mcqAnswers[q.id] !== undefined
  ).length;

  async function handleEvaluateOpen(
    qId: string,
    question: string,
    rubric: string
  ) {
    const answer = (openAnswers[qId] ?? "").trim();
    if (!answer || evaluatingId) return;

    setEvaluatingId(qId);
    setEvalError((prev) => ({ ...prev, [qId]: "" }));

    try {
      const res = await fetch("/api/mentor/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleTitle: activeModule.title,
          question,
          rubric,
          userAnswer: answer,
          currentTier: tier,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Evaluation failed.");
      }
      setEvaluations((prev) => ({ ...prev, [qId]: data as EvaluationResponse }));
    } catch (err: unknown) {
      setEvalError((prev) => ({
        ...prev,
        [qId]:
          err instanceof Error
            ? err.message
            : "Could not evaluate response right now.",
      }));
    } finally {
      setEvaluatingId(null);
    }
  }

  const isCompleted = completedModules.includes(activeModule.id);

  return (
    <div className="mx-auto max-w-[1380px] px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Module Navigation Rail */}
      <aside
        aria-label="Curriculum module index"
        className="lg:col-span-3 lg:sticky lg:top-20 border border-slate-800/90 rounded-lg bg-[#0B0F17] overflow-hidden"
      >
        <div className="px-4 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Modules 01–10
          </span>
          <span className="text-xs font-mono tabular-nums text-cyan-400">
            {completedModules.length}/10 done
          </span>
        </div>
        <div className="divide-y divide-slate-800/70 max-h-[72vh] overflow-y-auto">
          {CURRICULUM_MODULES.map((mod) => {
            const active = mod.id === activeModule.id;
            const done = completedModules.includes(mod.id);
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => onSelectModule(mod.id)}
                className={`w-full text-left px-4 py-3 transition-colors flex items-start gap-2.5 ${
                  active
                    ? "bg-cyan-500/10 text-slate-100"
                    : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
                }`}
              >
                <span className="font-mono text-xs tabular-nums mt-0.5 shrink-0 text-cyan-400">
                  {String(mod.id).padStart(2, "0")}
                </span>
                <span className="text-xs leading-snug font-medium flex-1">
                  {mod.title.replace(/^Module \d+:\s*|^Lesson 1:\s*/, "")}
                </span>
                {done && (
                  <CheckCircle2
                    aria-label="Completed"
                    className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5"
                  />
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Module Content & Assessment Workbench */}
      <main className="lg:col-span-9 space-y-10 min-w-0">
        {/* Module Header & Depth Controller */}
        <section className="border-b border-slate-800/80 pb-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <span className="text-cyan-400">{activeModule.roadmapStage}</span>
              <span aria-hidden="true">·</span>
              <span>Module {String(activeModule.id).padStart(2, "0")}</span>
            </div>

            <button
              type="button"
              onClick={() => onToggleComplete(activeModule.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                isCompleted
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                  : "border-slate-700 text-slate-300 hover:border-slate-500"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isCompleted ? "Module Completed" : "Mark Complete"}</span>
            </button>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-100 text-balance">
            {activeModule.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
            {activeModule.overview}
          </p>

          {/* Depth Segmented Control */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-400">
              Explanation Rigor Tier
            </div>
            <div
              role="group"
              aria-label="Select explanation rigor tier"
              className="inline-flex items-center p-1 rounded-md bg-[#0B0F17] border border-slate-800"
            >
              {TIERS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTier(t)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                    tier === t
                      ? "bg-cyan-400 text-slate-950 font-semibold"
                      : "text-slate-400 hover:text-slate-100"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Learning Outcomes */}
        <section className="space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Target Learning Outcomes
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-300">
            {activeModule.learningOutcomes.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-md border border-slate-800/80 bg-[#0B0F17]/70"
              >
                <span className="font-mono text-xs text-cyan-400 mt-0.5">
                  0{idx + 1}.
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Contextual Scientific Illustrations for Key Modules */}
        {(activeModule.id === 1 || activeModule.id === 6) && (
          <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch border border-slate-800 rounded-lg bg-[#0B0F17] overflow-hidden">
            <div className="md:col-span-6 min-h-[240px] bg-black">
              <img
                src="/src/assets/images/diagram_solar_interior_1794929685319.jpg"
                alt="Cross-section diagram of a G2V main-sequence star interior"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:col-span-6 p-6 flex flex-col justify-center space-y-3">
              <div className="text-xs font-mono text-amber-400">
                Structural Reference · G2V Internal Architecture
              </div>
              <h3 className="font-display text-lg font-semibold text-slate-100">
                Radial Energy &amp; Pressure Stratification
              </h3>
              <dl className="space-y-2 text-xs text-slate-300 divide-y divide-slate-800/80">
                <div className="pt-1 flex justify-between gap-4">
                  <dt className="text-slate-400">Fusion Core (0–0.25 R☉)</dt>
                  <dd className="font-mono tabular-nums text-slate-100">15.7 MK · 1.5×10⁵ kg/m³</dd>
                </div>
                <div className="pt-2 flex justify-between gap-4">
                  <dt className="text-slate-400">Radiative Zone (0.25–0.71 R☉)</dt>
                  <dd className="font-mono tabular-nums text-slate-100">Photon diffusion (~10⁵ yr)</dd>
                </div>
                <div className="pt-2 flex justify-between gap-4">
                  <dt className="text-slate-400">Convective Zone (0.71–1.00 R☉)</dt>
                  <dd className="font-mono tabular-nums text-slate-100">Adiabatic plasma cells</dd>
                </div>
                <div className="pt-2 flex justify-between gap-4">
                  <dt className="text-slate-400">Photosphere &amp; Corona</dt>
                  <dd className="font-mono tabular-nums text-slate-100">5,772 K → 1–3 MK</dd>
                </div>
              </dl>
            </div>
          </section>
        )}

        {activeModule.id === 5 && (
          <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch border border-slate-800 rounded-lg bg-[#0B0F17] overflow-hidden">
            <div className="md:col-span-6 min-h-[240px] bg-black">
              <img
                src="/src/assets/images/extreme_magnetar_remnant_1794929685889.jpg"
                alt="Magnetized pulsar and supernova remnant shell"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:col-span-6 p-6 flex flex-col justify-center space-y-3">
              <div className="text-xs font-mono text-cyan-400">
                Extreme Compact Remnant · Neutron Star &amp; Magnetar Physics
              </div>
              <h3 className="font-display text-lg font-semibold text-slate-100">
                Supranuclear Density &amp; Dipolar Magnetospheres
              </h3>
              <dl className="space-y-2 text-xs text-slate-300 divide-y divide-slate-800/80">
                <div className="pt-1 flex justify-between gap-4">
                  <dt className="text-slate-400">Typical Mass / Radius</dt>
                  <dd className="font-mono tabular-nums text-slate-100">1.4–2.1 M☉ · ~12 km</dd>
                </div>
                <div className="pt-2 flex justify-between gap-4">
                  <dt className="text-slate-400">Central Density</dt>
                  <dd className="font-mono tabular-nums text-slate-100">~4–8 × 10¹⁷ kg/m³</dd>
                </div>
                <div className="pt-2 flex justify-between gap-4">
                  <dt className="text-slate-400">Radio Pulsar Field</dt>
                  <dd className="font-mono tabular-nums text-slate-100">10¹¹ – 10¹³ Gauss</dd>
                </div>
                <div className="pt-2 flex justify-between gap-4">
                  <dt className="text-slate-400">Magnetar Field</dt>
                  <dd className="font-mono tabular-nums text-amber-400">10¹⁴ – 10¹⁵ Gauss</dd>
                </div>
              </dl>
            </div>
          </section>
        )}

        {/* Core Lesson Sections */}
        <div className="space-y-10 divide-y divide-slate-800/80">
          {activeModule.sections.map((section) => {
            const narrative =
              tier === "Beginner"
                ? section.beginner
                : tier === "Intermediate"
                ? section.intermediate
                : section.research;

            return (
              <article key={section.id} className="pt-8 first:pt-0 space-y-5">
                <div className="space-y-1">
                  {section.kicker && (
                    <div className="text-xs font-mono text-cyan-400">
                      {section.kicker}
                    </div>
                  )}
                  <h2 className="font-display text-xl font-semibold text-slate-100">
                    {section.title}
                  </h2>
                </div>

                <div className="text-[15px] text-slate-200 leading-[1.7] whitespace-pre-line">
                  <RichMathText text={narrative} />
                </div>

                {/* Key Takeaways */}
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-mono text-slate-400">
                    Core Physical Takeaways
                  </div>
                  <ul className="space-y-1.5 text-sm text-slate-300">
                    {section.keyTakeaways.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-cyan-400 mt-0.5" aria-hidden="true">
                          ›
                        </span>
                        <RichMathText text={point} />
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Equations & Step-by-Step Breakdown */}
                {section.equations && section.equations.length > 0 && (
                  <div className="space-y-4 pt-2">
                    {section.equations.map((eq, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-lg border border-slate-800 bg-[#0B0F17] space-y-4"
                      >
                        <div className="text-xs font-mono text-amber-400">
                          Mathematical Formulation · {eq.title}
                        </div>
                        <div className="py-2 overflow-x-auto">
                          <MathBlock latex={eq.latex} displayMode={true} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3 border-t border-slate-800/80 text-xs">
                          <div className="space-y-1.5">
                            <div className="font-mono text-slate-400">
                              Variables &amp; Units
                            </div>
                            <ul className="space-y-1 text-slate-300">
                              {eq.variables.map((v, vIdx) => (
                                <li key={vIdx} className="flex items-baseline gap-2">
                                  <span className="font-mono text-cyan-300 shrink-0">
                                    <MathBlock latex={v.symbol} displayMode={false} />
                                  </span>
                                  <span>— {v.meaning}</span>
                                  <span className="font-mono text-slate-500 ml-auto shrink-0">
                                    [{v.units}]
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-1.5">
                            <div className="font-mono text-slate-400">
                              Physical Derivation Logic
                            </div>
                            <ol className="space-y-1 text-slate-300 list-decimal list-inside">
                              {eq.stepByStep.map((step, sIdx) => (
                                <li key={sIdx}>
                                  <RichMathText text={step} />
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {section.realExample && (
                  <div className="p-4 rounded-md border border-slate-800/90 bg-[#0B0F17]/60 text-sm">
                    <div className="text-xs font-mono text-emerald-400 mb-1">
                      Observational Benchmark · {section.realExample.title}
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {section.realExample.detail}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Module 2 Interactive Mass-Regime Matrix */}
        {activeModule.id === 2 && (
          <section className="space-y-4 pt-6 border-t border-slate-800/80">
            <h2 className="font-display text-xl font-semibold text-slate-100">
              Comparative Mass-Regime Fate Matrix
            </h2>
            <div className="overflow-x-auto border border-slate-800 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B0F17] text-slate-400 font-mono border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Mass Regime</th>
                    <th className="py-3 px-4">Initial Mass</th>
                    <th className="py-3 px-4">Interior &amp; Burning Physics</th>
                    <th className="py-3 px-4">MS Lifespan</th>
                    <th className="py-3 px-4">Final Remnant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 text-slate-200">
                  {MASS_REGIME_MATRIX.map((row) => (
                    <tr key={row.regime} className="hover:bg-slate-900/40">
                      <td className="py-3 px-4 font-semibold text-slate-100 whitespace-nowrap">
                        {row.regime}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-cyan-300 whitespace-nowrap">
                        {row.mass}
                      </td>
                      <td className="py-3 px-4 text-slate-300">{row.corePhysics}</td>
                      <td className="py-3 px-4 font-mono tabular-nums whitespace-nowrap">
                        {row.lifespan}
                      </td>
                      <td className="py-3 px-4 text-amber-300">{row.finalFate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Module 3 Interactive 17-Category Stellar Taxonomy Explorer */}
        {activeModule.id === 3 && (
          <section className="space-y-5 pt-6 border-t border-slate-800/80">
            <div>
              <h2 className="font-display text-xl font-semibold text-slate-100">
                Interactive 17-Category Stellar Taxonomy Explorer
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Select any stellar category to inspect its formation channel, interior structure, physical ranges, and astrophysical significance.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 border border-slate-800 rounded-lg bg-[#0B0F17] p-5">
              <div className="md:col-span-4 space-y-1 max-h-[420px] overflow-y-auto pr-1">
                {STELLAR_TYPES.map((st) => {
                  const active = st.id === selectedStellarType.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSelectedStellarTypeId(st.id)}
                      className={`w-full text-left px-3 py-2 rounded text-xs flex items-center justify-between gap-2 transition-colors ${
                        active
                          ? "bg-cyan-500/15 text-cyan-300 font-semibold"
                          : "text-slate-300 hover:bg-slate-800/60"
                      }`}
                    >
                      <span className="truncate">{st.name}</span>
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: st.colorHex }}
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>

              <div className="md:col-span-8 space-y-4 md:border-l md:border-slate-800/80 md:pl-6">
                <div className="flex items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
                  <div>
                    <div className="text-xs font-mono text-cyan-400">
                      {selectedStellarType.spectralOrClass}
                    </div>
                    <h3 className="font-display text-xl font-semibold text-slate-100">
                      {selectedStellarType.name}
                    </h3>
                  </div>
                  <div
                    className="w-8 h-8 rounded-full shrink-0 border border-white/20"
                    style={{
                      backgroundColor: selectedStellarType.colorHex,
                      boxShadow: `0 0 24px ${selectedStellarType.colorHex}44`,
                    }}
                    aria-hidden="true"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <div className="text-slate-400">Temperature</div>
                    <div className="mt-0.5 font-mono tabular-nums text-slate-100">
                      {selectedStellarType.temperatureRange}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Mass</div>
                    <div className="mt-0.5 font-mono tabular-nums text-slate-100">
                      {selectedStellarType.massRange}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Luminosity</div>
                    <div className="mt-0.5 font-mono tabular-nums text-slate-100">
                      {selectedStellarType.luminosityRange}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Lifespan</div>
                    <div className="mt-0.5 font-mono tabular-nums text-slate-100">
                      {selectedStellarType.lifespan}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-slate-300 leading-relaxed pt-2">
                  <div>
                    <span className="text-xs font-mono text-slate-400 block">
                      Formation Mechanism
                    </span>
                    {selectedStellarType.formation}
                  </div>
                  <div>
                    <span className="text-xs font-mono text-slate-400 block">
                      Internal Structure
                    </span>
                    {selectedStellarType.structure}
                  </div>
                  <div>
                    <span className="text-xs font-mono text-amber-400 block">
                      Scientific Significance
                    </span>
                    {selectedStellarType.scientificSignificance}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Quantitative Mathematical Problems */}
        <section className="space-y-4 pt-6 border-t border-slate-800/80">
          <h2 className="font-display text-xl font-semibold text-slate-100">
            Worked Mathematical Problems
          </h2>
          <div className="space-y-4">
            {activeModule.mathProblems.map((prob) => {
              const open = Boolean(revealedSolutions[prob.id]);
              return (
                <div
                  key={prob.id}
                  className="p-5 rounded-lg border border-slate-800 bg-[#0B0F17] space-y-3"
                >
                  <div className="text-xs font-mono text-cyan-400">
                    {prob.title}
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    <RichMathText text={prob.prompt} />
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-slate-400">
                    {prob.given.map((g, idx) => (
                      <span key={idx}>Given: {g}</span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setRevealedSolutions((prev) => ({
                        ...prev,
                        [prob.id]: !prev[prob.id],
                      }))
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300 pt-1"
                  >
                    {open ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                    <span>{open ? "Hide Derivation" : "Show Step-by-Step Solution"}</span>
                  </button>
                  {open && (
                    <div className="pt-3 border-t border-slate-800/80 space-y-2 text-sm text-slate-300">
                      <ol className="list-decimal list-inside space-y-1.5">
                        {prob.solutionSteps.map((step, idx) => (
                          <li key={idx}>
                            <RichMathText text={step} />
                          </li>
                        ))}
                      </ol>
                      <div className="pt-2 text-xs font-mono text-emerald-400">
                        Result: {prob.finalAnswer}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Module 13: Adaptive Learning & Assessment */}
        <section className="space-y-8 pt-6 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-xl font-semibold text-slate-100">
                Module Assessment &amp; Research Evaluation
              </h2>
              <p className="text-sm text-slate-400">
                5 Multiple-Choice Questions · 3 Conceptual Prompts · 2 Research-Oriented Prompts
              </p>
            </div>
            <div className="text-xs font-mono tabular-nums text-cyan-400">
              MCQ Score: {moduleMcqScore}/{activeModule.mcqs.length} ({moduleMcqAnswered} answered)
            </div>
          </div>

          {/* 5 MCQs */}
          <div className="space-y-5">
            {activeModule.mcqs.map((q, qIndex) => {
              const chosen = mcqAnswers[q.id];
              const isAnswered = chosen !== undefined;
              return (
                <div
                  key={q.id}
                  className="p-5 rounded-lg border border-slate-800 bg-[#0B0F17] space-y-3"
                >
                  <div className="text-sm font-medium text-slate-100">
                    <span className="font-mono text-xs text-cyan-400 mr-2">
                      Q{qIndex + 1}.
                    </span>
                    <RichMathText text={q.question} />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = chosen === optIdx;
                      const isCorrect = q.correctIndex === optIdx;
                      let btnStyle =
                        "border-slate-800 bg-[#07090E] text-slate-300 hover:border-slate-600";

                      if (isAnswered) {
                        if (isCorrect) {
                          btnStyle =
                            "border-emerald-500/60 bg-emerald-500/10 text-emerald-200";
                        } else if (isSelected) {
                          btnStyle =
                            "border-rose-500/60 bg-rose-500/10 text-rose-200";
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() =>
                            setMcqAnswers((prev) => ({
                              ...prev,
                              [q.id]: optIdx,
                            }))
                          }
                          className={`w-full text-left px-3.5 py-2.5 text-xs sm:text-sm rounded border transition-colors ${btnStyle}`}
                        >
                          <span className="font-mono text-slate-400 mr-2">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {isAnswered && (
                    <div className="pt-2 text-xs text-slate-300 border-t border-slate-800/80">
                      <span
                        className={`font-mono font-semibold mr-2 ${
                          chosen === q.correctIndex
                            ? "text-emerald-400"
                            : "text-rose-400"
                        }`}
                      >
                        {chosen === q.correctIndex ? "● Correct" : "✖ Review"}
                      </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 3 Conceptual + 2 Research-Oriented Questions with Gemini Professor Evaluation */}
          <div className="space-y-5">
            <h3 className="font-display text-lg font-semibold text-slate-100">
              Conceptual &amp; Research-Oriented Prompts (Professor-Evaluated)
            </h3>

            {activeModule.openQuestions.map((oq, idx) => {
              const evalRes = evaluations[oq.id];
              const isEvalLoading = evaluatingId === oq.id;
              const rubricOpen = Boolean(revealedRubrics[oq.id]);

              return (
                <div
                  key={oq.id}
                  className="p-5 rounded-lg border border-slate-800 bg-[#0B0F17] space-y-3"
                >
                  <div className="flex items-center justify-between gap-4 text-xs font-mono">
                    <span
                      className={
                        oq.kind === "Research-Oriented"
                          ? "text-amber-400"
                          : "text-cyan-400"
                      }
                    >
                      {oq.kind} Prompt 0{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setRevealedRubrics((prev) => ({
                          ...prev,
                          [oq.id]: !prev[oq.id],
                        }))
                      }
                      className="text-slate-400 hover:text-slate-200 underline underline-offset-2"
                    >
                      {rubricOpen ? "Hide Reference Solution" : "Reference Solution"}
                    </button>
                  </div>

                  <p className="text-sm text-slate-100 leading-relaxed">
                    <RichMathText text={oq.question} />
                  </p>

                  <textarea
                    rows={3}
                    value={openAnswers[oq.id] ?? ""}
                    onChange={(e) =>
                      setOpenAnswers((prev) => ({
                        ...prev,
                        [oq.id]: e.target.value,
                      }))
                    }
                    placeholder="Write your physical explanation, equations, and observational reasoning..."
                    className="w-full p-3 text-sm bg-[#07090E] border border-slate-800 rounded-md text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                  />

                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      disabled={isEvalLoading || !(openAnswers[oq.id] ?? "").trim()}
                      onClick={() =>
                        handleEvaluateOpen(oq.id, oq.question, oq.rubric)
                      }
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-cyan-400 text-slate-950 rounded-md hover:bg-cyan-300 disabled:opacity-40 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>
                        {isEvalLoading ? "Evaluating Reasoning..." : "Submit for Evaluation"}
                      </span>
                    </button>
                  </div>

                  {evalError[oq.id] && (
                    <div className="text-xs text-rose-400">{evalError[oq.id]}</div>
                  )}

                  {evalRes && (
                    <div className="mt-3 p-4 rounded-md border border-cyan-500/30 bg-[#07090E] space-y-3 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2">
                        <span className="font-mono font-semibold text-cyan-300">
                          Professor Evaluation · {evalRes.masteryVerdict} ({evalRes.scoreOutOf10}/10)
                        </span>
                        <button
                          type="button"
                          onClick={() => setTier(evalRes.recommendedNextTier)}
                          className="text-amber-400 hover:text-amber-300 underline underline-offset-2"
                        >
                          Switch to recommended tier: {evalRes.recommendedNextTier}
                        </button>
                      </div>
                      <p className="text-sm text-slate-200 leading-relaxed">
                        <RichMathText text={evalRes.professorFeedback} />
                      </p>
                      {evalRes.strengths.length > 0 && (
                        <div>
                          <div className="font-mono text-emerald-400 mb-1">
                            Strengths
                          </div>
                          <ul className="space-y-1 text-slate-300">
                            {evalRes.strengths.map((s, sIdx) => (
                              <li key={sIdx}>• {s}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {evalRes.misconceptionsOrGaps.length > 0 && (
                        <div>
                          <div className="font-mono text-rose-400 mb-1">
                            Misconceptions / Missing Steps
                          </div>
                          <ul className="space-y-1 text-slate-300">
                            {evalRes.misconceptionsOrGaps.map((g, gIdx) => (
                              <li key={gIdx}>• {g}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="pt-2 border-t border-slate-800/80 text-slate-300">
                        <span className="font-mono text-amber-400 mr-1.5">
                          Revision Note:
                        </span>
                        {evalRes.revisionNote}
                      </div>
                    </div>
                  )}

                  {rubricOpen && (
                    <div className="p-4 rounded-md border border-slate-800 bg-[#07090E] text-xs space-y-2 text-slate-300">
                      <div className="font-mono text-emerald-400">
                        Professor Reference Model Answer
                      </div>
                      <p className="text-sm leading-relaxed">
                        <RichMathText text={oq.modelAnswer} />
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Vocabulary & Revision Notes */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-800/80">
          <div className="p-5 rounded-lg border border-slate-800 bg-[#0B0F17] space-y-3">
            <h3 className="font-display text-base font-semibold text-slate-100">
              Scientific Vocabulary
            </h3>
            <dl className="divide-y divide-slate-800/70 text-xs">
              {activeModule.vocabulary.map((v) => (
                <div key={v.term} className="py-2.5 first:pt-0 last:pb-0">
                  <dt className="font-semibold text-cyan-300">{v.term}</dt>
                  <dd className="mt-1 text-slate-300 leading-relaxed">
                    {v.definition}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="p-5 rounded-lg border border-slate-800 bg-[#0B0F17] space-y-3">
            <div className="flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-amber-400" />
              <h3 className="font-display text-base font-semibold text-slate-100">
                Revision Notes
              </h3>
            </div>
            <ul className="space-y-2.5 text-sm text-slate-300">
              {activeModule.revisionNotes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-mono text-xs text-amber-400 mt-0.5">
                    0{idx + 1}.
                  </span>
                  <span>
                    <RichMathText text={note} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
