import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { STARS_CATALOG } from "../data/starsCatalog";
import { MeasurementCertainty, StarProfile } from "../types/astrophysics";

const SPECTRAL_FILTERS = ["All", "O", "B", "A", "F", "G", "M", "LBV"] as const;

function certaintyStyle(certainty: MeasurementCertainty): {
  glyph: string;
  color: string;
} {
  if (certainty === "Measured") {
    return { glyph: "● Measured", color: "text-emerald-400" };
  }
  if (certainty === "Model-Estimated") {
    return { glyph: "▲ Model-Estimated", color: "text-amber-400" };
  }
  return { glyph: "◆ Uncertain / Debated", color: "text-rose-400" };
}

/**
 * Normalized Planck spectral radiance B_lambda(T) normalized to peak = 1.0 per star
 * across wavelength range 100 nm to 2400 nm.
 */
function planckNormalizedCurve(teffK: number, wavelengthsNm: number[]): number[] {
  const hcOverK = 1.438776877e7; // nm * K
  const raw = wavelengthsNm.map((lam) => {
    const x = Math.min(700, hcOverK / (lam * teffK));
    const denom = Math.exp(x) - 1.0;
    if (denom <= 0) return 0;
    return 1.0 / (Math.pow(lam, 5) * denom);
  });
  const maxVal = Math.max(...raw, 1e-30);
  return raw.map((v) => v / maxVal);
}

export function StarAtlasView() {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] =
    useState<(typeof SPECTRAL_FILTERS)[number]>("All");
  const [selectedStarId, setSelectedStarId] = useState<string>("sun");
  const [compareIds, setCompareIds] = useState<string[]>([
    "sun",
    "sirius",
    "betelgeuse",
  ]);
  const [scaleMode, setScaleMode] = useState<"log" | "linear">("log");

  const filteredStars = useMemo(() => {
    return STARS_CATALOG.filter((star) => {
      const matchesClass =
        classFilter === "All" || star.spectralClassGroup === classFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        star.name.toLowerCase().includes(q) ||
        star.spectralType.toLowerCase().includes(q) ||
        star.constellation.toLowerCase().includes(q) ||
        star.classification.toLowerCase().includes(q);
      return matchesClass && matchesSearch;
    });
  }, [search, classFilter]);

  const activeStar: StarProfile =
    STARS_CATALOG.find((s) => s.id === selectedStarId) ?? STARS_CATALOG[0];

  const comparedStars: StarProfile[] = useMemo(() => {
    return compareIds
      .map((id) => STARS_CATALOG.find((s) => s.id === id))
      .filter((s): s is StarProfile => Boolean(s));
  }, [compareIds]);

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.length > 1 ? prev.filter((item) => item !== id) : prev;
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  }

  // Planck blackbody wavelengths (100 nm to 2200 nm)
  const wavelengthsNm = useMemo(() => {
    const arr: number[] = [];
    for (let lam = 100; lam <= 2200; lam += 30) {
      arr.push(lam);
    }
    return arr;
  }, []);

  const maxLinearRadius = useMemo(() => {
    return Math.max(
      ...comparedStars.map((s) => s.radius.numericValue ?? 1),
      1
    );
  }, [comparedStars]);

  return (
    <div className="mx-auto max-w-[1380px] px-6 py-8 space-y-12">
      {/* Header & Controls */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-800/80 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="text-xs font-mono text-cyan-400">
            Module 09 &amp; 11 · Famous &amp; Extraordinary Star Research Profiles
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-100">
            Stellar Atlas &amp; Comparative Observatory
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Every parameter below explicitly distinguishes empirical{" "}
            <span className="text-emerald-400 font-mono text-xs">● Measured</span>{" "}
            data (Gaia DR3 parallaxes, VLTI/CHARA diameters, Keplerian binaries) from{" "}
            <span className="text-amber-400 font-mono text-xs">▲ Model-Estimated</span>{" "}
            and{" "}
            <span className="text-rose-400 font-mono text-xs">◆ Uncertain / Debated</span>{" "}
            values.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search star, spectral type..."
              aria-label="Search stars"
              className="pl-8 pr-3 py-2 text-xs bg-[#0B0F17] border border-slate-800 rounded-md text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 w-56"
            />
          </div>

          <div
            role="group"
            aria-label="Filter by spectral group"
            className="flex items-center gap-1 p-1 rounded-md bg-[#0B0F17] border border-slate-800 overflow-x-auto"
          >
            {SPECTRAL_FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setClassFilter(f)}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap shrink-0 ${
                  classFilter === f
                    ? "bg-cyan-400 text-slate-950 font-semibold"
                    : "text-slate-400 hover:text-slate-100"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Split: Catalog Selector + 12-Point Scientific Dossier */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Star List */}
        <div className="lg:col-span-4 border border-slate-800 rounded-lg bg-[#0B0F17] divide-y divide-slate-800/70 max-h-[680px] overflow-y-auto">
          {filteredStars.map((star) => {
            const selected = star.id === activeStar.id;
            const inCompare = compareIds.includes(star.id);
            return (
              <div
                key={star.id}
                className={`p-4 flex items-center justify-between gap-3 transition-colors ${
                  selected ? "bg-cyan-500/10" : "hover:bg-slate-900/50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedStarId(star.id)}
                  className="flex-1 text-left min-w-0 space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: star.colorHex }}
                      aria-hidden="true"
                    />
                    <span className="font-medium text-sm text-slate-100 truncate">
                      {star.name}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-400 flex items-center gap-2 truncate">
                    <span>{star.spectralType}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">
                      {star.distance.numericValue !== undefined &&
                      star.distance.numericValue < 0.01
                        ? "1.00 AU"
                        : `${star.distance.numericValue?.toLocaleString()} ly`}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => toggleCompare(star.id)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded border transition-colors whitespace-nowrap shrink-0 ${
                    inCompare
                      ? "border-cyan-400 text-cyan-300 bg-cyan-500/10"
                      : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                  }`}
                >
                  {inCompare ? "Compared" : "+ Compare"}
                </button>
              </div>
            );
          })}
          {filteredStars.length === 0 && (
            <div className="p-6 text-xs text-slate-400">
              No stars match your current filter.
            </div>
          )}
        </div>

        {/* 12-Point Dossier */}
        <div className="lg:col-span-8 border border-slate-800 rounded-lg bg-[#0B0F17] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800/80 pb-5">
            <div className="space-y-1.5">
              <div className="text-xs font-mono text-slate-400 flex flex-wrap items-center gap-2">
                <span>{activeStar.designation}</span>
                <span aria-hidden="true">·</span>
                <span>{activeStar.constellation}</span>
                <span aria-hidden="true">·</span>
                <span className="text-cyan-400">{activeStar.spectralType}</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-100">
                {activeStar.name}
              </h2>
              <p className="text-sm text-slate-300">{activeStar.classification}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div
                className="w-12 h-12 rounded-full border border-white/20"
                style={{
                  backgroundColor: activeStar.colorHex,
                  boxShadow: `0 0 28px ${activeStar.colorHex}55`,
                }}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* 1-8 Quantitative & Physical Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: "01. Galactic Location", text: activeStar.galacticLocation },
              { label: "09. Evolutionary Stage", text: activeStar.evolutionaryStage },
            ].map((item) => (
              <div
                key={item.label}
                className="p-4 rounded-md border border-slate-800/80 bg-[#07090E]/70 space-y-1"
              >
                <div className="text-xs font-mono text-slate-400">
                  {item.label}
                </div>
                <div className="text-sm text-slate-200 leading-relaxed">
                  {item.text}
                </div>
              </div>
            ))}
          </div>

          <div className="divide-y divide-slate-800/80 border border-slate-800/90 rounded-md bg-[#07090E]/70">
            {[
              { idx: "02", label: "Distance from Earth", q: activeStar.distance },
              { idx: "04", label: "Mass", q: activeStar.mass },
              { idx: "05", label: "Radius", q: activeStar.radius },
              { idx: "06", label: "Surface Temperature", q: activeStar.temperature },
              { idx: "07", label: "Luminosity", q: activeStar.luminosity },
              { idx: "08", label: "Age", q: activeStar.age },
            ].map(({ idx, label, q }) => {
              const badge = certaintyStyle(q.certainty);
              return (
                <div
                  key={label}
                  className="p-4 grid grid-cols-1 sm:grid-cols-12 gap-2 items-baseline"
                >
                  <div className="sm:col-span-4 text-xs font-mono text-slate-400">
                    {idx}. {label}
                  </div>
                  <div className="sm:col-span-8 space-y-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-mono tabular-nums text-sm font-semibold text-slate-100">
                        {q.value}
                      </span>
                      <span className={`text-xs font-mono ${badge.color}`}>
                        {badge.glyph}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {q.note}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 10-12 Scientific Significance, Unusual Features & Latest Research */}
          <div className="space-y-4 pt-2">
            <div>
              <h3 className="text-xs font-mono text-cyan-400 mb-1">
                10. Scientific Importance
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                {activeStar.scientificImportance}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-mono text-amber-400 mb-1">
                11. Unusual Characteristics
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                {activeStar.unusualCharacteristics}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-mono text-emerald-400 mb-1">
                12. Latest Scientific Research
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                {activeStar.latestResearch}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Multi-Star Comparator (Scale + Planck Blackbody + Table) */}
      <section className="border border-slate-800 rounded-lg bg-[#0B0F17] p-6 sm:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="text-xs font-mono text-cyan-400">
              Module 11 · Multi-Star Physical Comparator
            </div>
            <h2 className="font-display text-2xl font-semibold text-slate-100">
              Relative Scale &amp; Planck Blackbody Radiation Comparison
            </h2>
          </div>

          <div
            role="group"
            aria-label="Radius scale mode"
            className="inline-flex items-center p-1 rounded-md bg-[#07090E] border border-slate-800"
          >
            <button
              type="button"
              onClick={() => setScaleMode("log")}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
                scaleMode === "log"
                  ? "bg-cyan-400 text-slate-950 font-semibold"
                  : "text-slate-400 hover:text-slate-100"
              }`}
            >
              Logarithmic Scale
            </button>
            <button
              type="button"
              onClick={() => setScaleMode("linear")}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
                scaleMode === "linear"
                  ? "bg-cyan-400 text-slate-950 font-semibold"
                  : "text-slate-400 hover:text-slate-100"
              }`}
            >
              True Linear Scale
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Relative Size Scale Visualizer */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-100">
              Stellar Radius Comparison Relative to the Sun (1.0 R☉)
            </h3>
            <div className="p-5 rounded-md border border-slate-800 bg-[#07090E] space-y-5">
              {comparedStars.map((star) => {
                const rVal = star.radius.numericValue ?? 1;
                const logPct = Math.max(
                  4,
                  ((Math.log10(rVal) + 1.5) / (Math.log10(1600) + 1.5)) * 100
                );
                const linearPct = Math.max(
                  1.5,
                  (rVal / maxLinearRadius) * 100
                );
                const pct =
                  scaleMode === "log"
                    ? Math.min(100, logPct)
                    : Math.min(100, linearPct);

                return (
                  <div key={star.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-200">
                        {star.name}
                      </span>
                      <span className="font-mono tabular-nums text-cyan-300">
                        {rVal.toLocaleString()} R☉
                      </span>
                    </div>
                    <div className="h-6 bg-slate-900 rounded overflow-hidden flex items-center px-1">
                      <div
                        className="h-4 rounded-sm transition-all duration-300"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: star.colorHex,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              <p className="text-[11px] font-mono text-slate-500">
                {scaleMode === "log"
                  ? "Logarithmic scale spans 0.1 R☉ to 1,600 R☉ so dwarfs and hypergiants remain simultaneously legible."
                  : "Linear scale shows true proportional radius relative to the largest selected star."}
              </p>
            </div>
          </div>

          {/* Live Planck Blackbody Radiation SVG */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-100">
              Normalized Planck Blackbody Spectrum &amp; Wien Peak
            </h3>
            <div className="p-4 rounded-md border border-slate-800 bg-[#07090E]">
              <svg
                viewBox="0 0 540 250"
                className="w-full h-auto"
                role="img"
                aria-label="Normalized Planck blackbody spectral energy curves"
              >
                {/* Visible spectrum band 380 - 750 nm */}
                <defs>
                  <linearGradient id="visBand" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity="0.18" />
                    <stop offset="35%" stopColor="#22D3EE" stopOpacity="0.18" />
                    <stop offset="65%" stopColor="#4ADE80" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0.18" />
                  </linearGradient>
                </defs>

                {(() => {
                  const padL = 46;
                  const padR = 16;
                  const padT = 18;
                  const padB = 38;
                  const plotW = 540 - padL - padR;
                  const plotH = 250 - padT - padB;
                  const xForLam = (lam: number) =>
                    padL + ((lam - 100) / (2200 - 100)) * plotW;

                  const x380 = xForLam(380);
                  const x750 = xForLam(750);

                  return (
                    <>
                      <rect
                        x={x380}
                        y={padT}
                        width={x750 - x380}
                        height={plotH}
                        fill="url(#visBand)"
                      />
                      <text
                        x={(x380 + x750) / 2}
                        y={padT + 13}
                        textAnchor="middle"
                        fill="#94A3B8"
                        fontSize="9"
                        fontFamily="IBM Plex Mono"
                      >
                        Visible (380–750 nm)
                      </text>

                      {/* Grid lines */}
                      {[0.25, 0.5, 0.75, 1].map((frac) => {
                        const y = padT + plotH * (1 - frac);
                        return (
                          <line
                            key={frac}
                            x1={padL}
                            x2={padL + plotW}
                            y1={y}
                            y2={y}
                            stroke="#1E293B"
                            strokeDasharray="3 3"
                          />
                        );
                      })}

                      {/* Curves */}
                      {comparedStars.map((star) => {
                        const teff = star.temperature.numericValue ?? 5772;
                        const normVals = planckNormalizedCurve(
                          teff,
                          wavelengthsNm
                        );
                        const dPath = wavelengthsNm
                          .map((lam, i) => {
                            const x = xForLam(lam);
                            const y = padT + plotH * (1 - normVals[i]);
                            return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
                          })
                          .join(" ");

                        return (
                          <path
                            key={star.id}
                            d={dPath}
                            fill="none"
                            stroke={star.colorHex}
                            strokeWidth="2.2"
                          />
                        );
                      })}

                      {/* Axes */}
                      <line
                        x1={padL}
                        x2={padL + plotW}
                        y1={padT + plotH}
                        y2={padT + plotH}
                        stroke="#475569"
                      />
                      <line
                        x1={padL}
                        x2={padL}
                        y1={padT}
                        y2={padT + plotH}
                        stroke="#475569"
                      />

                      {[200, 500, 1000, 1500, 2000].map((tick) => (
                        <text
                          key={tick}
                          x={xForLam(tick)}
                          y={padT + plotH + 16}
                          textAnchor="middle"
                          fill="#94A3B8"
                          fontSize="10"
                          fontFamily="IBM Plex Mono"
                        >
                          {tick} nm
                        </text>
                      ))}
                      <text
                        x={padL + plotW / 2}
                        y={244}
                        textAnchor="middle"
                        fill="#64748B"
                        fontSize="10"
                        fontFamily="IBM Plex Mono"
                      >
                        Wavelength λ (UV → Visible → Near-Infrared)
                      </text>
                    </>
                  );
                })()}
              </svg>

              <div className="mt-3 flex flex-wrap gap-4 text-xs font-mono">
                {comparedStars.map((star) => {
                  const teff = star.temperature.numericValue ?? 5772;
                  const peakNm = Math.round(2897771 / teff);
                  return (
                    <div key={star.id} className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: star.colorHex }}
                      />
                      <span className="text-slate-200">{star.name.split(" ")[0]}:</span>
                      <span className="text-slate-400 tabular-nums">
                        {teff.toLocaleString()} K (λ_max ≈ {peakNm} nm)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Quantitative Comparison Table */}
        <div className="overflow-x-auto border border-slate-800 rounded-md">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#07090E] text-slate-400 font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Star</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Distance</th>
                <th className="py-3 px-4">Mass (M☉)</th>
                <th className="py-3 px-4">Radius (R☉)</th>
                <th className="py-3 px-4">Teff (K)</th>
                <th className="py-3 px-4">Luminosity (L☉)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-200 font-mono tabular-nums">
              {comparedStars.map((s) => (
                <tr key={s.id} className="hover:bg-slate-900/40">
                  <td className="py-3 px-4 font-sans font-semibold text-slate-100">
                    {s.name}
                  </td>
                  <td className="py-3 px-4 text-cyan-300">{s.spectralType}</td>
                  <td className="py-3 px-4">{s.distance.value.split("(")[0]}</td>
                  <td className="py-3 px-4">{s.mass.numericValue ?? "—"}</td>
                  <td className="py-3 px-4">{s.radius.numericValue?.toLocaleString() ?? "—"}</td>
                  <td className="py-3 px-4">{s.temperature.numericValue?.toLocaleString() ?? "—"}</td>
                  <td className="py-3 px-4">{s.luminosity.numericValue?.toLocaleString() ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
