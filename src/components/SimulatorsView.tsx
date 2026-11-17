import { useMemo, useState } from "react";
import { STARS_CATALOG } from "../data/starsCatalog";
import { StarProfile } from "../types/astrophysics";

type SimulatorTab = "hr" | "evolution" | "spectroscopy" | "supernova";

const HR_WIDTH = 760;
const HR_HEIGHT = 490;
const PAD = { l: 64, r: 28, t: 32, b: 54 };

function xForTemp(teff: number): number {
  // Reverse log scale: 50,000 K (left) -> 2,400 K (right)
  const logMax = Math.log10(55000);
  const logMin = Math.log10(2300);
  const logT = Math.min(logMax, Math.max(logMin, Math.log10(teff)));
  const frac = (logMax - logT) / (logMax - logMin);
  return PAD.l + frac * (HR_WIDTH - PAD.l - PAD.r);
}

function yForLum(lumSolar: number): number {
  // Log scale: 10^7 (top) -> 10^-5 (bottom)
  const logMax = 7;
  const logMin = -5;
  const logL = Math.min(logMax, Math.max(logMin, Math.log10(lumSolar)));
  const frac = (logMax - logL) / (logMax - logMin);
  return PAD.t + frac * (HR_HEIGHT - PAD.t - PAD.b);
}

function tempForX(x: number): number {
  const logMax = Math.log10(55000);
  const logMin = Math.log10(2300);
  const frac = (x - PAD.l) / (HR_WIDTH - PAD.l - PAD.r);
  const logT = logMax - frac * (logMax - logMin);
  return Math.pow(10, logT);
}

function lumForY(y: number): number {
  const logMax = 7;
  const logMin = -5;
  const frac = (y - PAD.t) / (HR_HEIGHT - PAD.t - PAD.b);
  const logL = logMax - frac * (logMax - logMin);
  return Math.pow(10, logL);
}

const MS_LOCUS: Array<[number, number]> = [
  [45000, 500000],
  [30000, 35000],
  [20000, 2200],
  [12000, 110],
  [9600, 35],
  [7200, 5.5],
  [5772, 1.0],
  [4500, 0.18],
  [3400, 0.018],
  [2700, 0.0008],
];

const WD_LOCUS: Array<[number, number]> = [
  [40000, 0.8],
  [25000, 0.056],
  [14000, 0.004],
  [8000, 0.0004],
  [5000, 0.00006],
];

export function SimulatorsView() {
  const [activeTab, setActiveTab] = useState<SimulatorTab>("hr");

  // Lab 1: H-R Diagram state
  const [selectedHrStar, setSelectedHrStar] = useState<StarProfile>(
    STARS_CATALOG[0]
  );
  const [showRadiusLines, setShowRadiusLines] = useState(true);
  const [showInstabilityStrip, setShowInstabilityStrip] = useState(true);
  const [hoverCoords, setHoverCoords] = useState<{
    teff: number;
    lum: number;
    radius: number;
  } | null>(null);

  // Lab 2: Stellar Evolution & Nucleosynthesis state
  const [simMass, setSimMass] = useState(1.0);
  const [simMetallicity, setSimMetallicity] = useState(0.014);

  // Lab 3: Spectroscopy & Transit/RV state
  const [specTeff, setSpecTeff] = useState(9600);
  const [specVr, setSpecVr] = useState(0);
  const [transitRpEarth, setTransitRpEarth] = useState(4.0);
  const [rvMassEarth, setRvMassEarth] = useState(15.0);
  const [orbitInclination, setOrbitInclination] = useState(89.0);

  // Lab 4: Supernova & EOS explorer
  const [snScenario, setSnScenario] = useState<"core-collapse" | "type-ia" | "pisn">(
    "core-collapse"
  );

  // Derived stellar evolution physics
  const evoModel = useMemo(() => {
    const m = simMass;
    const zRatio = simMetallicity / 0.014;

    // Approximate ZAMS luminosity (piecewise power law)
    let lumSolar: number;
    if (m < 0.43) lumSolar = 0.23 * Math.pow(m, 2.3);
    else if (m < 2.0) lumSolar = Math.pow(m, 3.9);
    else if (m < 55) lumSolar = 1.4 * Math.pow(m, 3.5);
    else lumSolar = 32000 * m;

    // Approximate ZAMS radius
    const radSolar = m < 1.0 ? Math.pow(m, 0.8) : Math.pow(m, 0.57);
    const teffK = Math.round(
      5772 * Math.pow(lumSolar / (radSolar * radSolar), 0.25)
    );

    // Main-sequence lifetime (Gyr)
    const lifetimeGyr = 10.0 * (m / lumSolar) * (m < 0.4 ? 1.5 : 1.0);
    let lifetimeLabel: string;
    if (lifetimeGyr >= 1000) {
      lifetimeLabel = `${(lifetimeGyr / 1000).toFixed(2)} Trillion yr`;
    } else if (lifetimeGyr >= 1.0) {
      lifetimeLabel = `${lifetimeGyr.toFixed(2)} Gyr`;
    } else {
      lifetimeLabel = `${(lifetimeGyr * 1000).toFixed(1)} Myr`;
    }

    const fusionCycle =
      m < 1.25
        ? "Proton-Proton (pp) Chain Dominant"
        : "CNO Cycle Dominant (ε ∝ T¹⁶)";

    const transportStructure =
      m < 0.35
        ? "Fully Convective Interior"
        : m < 1.25
        ? "Radiative Core · Convective Outer Envelope"
        : "Convective Core · Radiative Envelope";

    const spectralClass =
      teffK >= 30000
        ? "O"
        : teffK >= 10000
        ? "B"
        : teffK >= 7500
        ? "A"
        : teffK >= 6000
        ? "F"
        : teffK >= 5200
        ? "G"
        : teffK >= 3700
        ? "K"
        : "M";

    // Burning shells reached
    const shells: Array<{ label: string; color: string }> = [
      { label: "H Envelope", color: "#38BDF8" },
    ];
    if (m >= 0.5) shells.push({ label: "He Shell / Core", color: "#FBBF24" });
    if (m >= 8.0) {
      shells.push({ label: "C Burning", color: "#FB923C" });
      shells.push({ label: "Ne / O Burning", color: "#F87171" });
      shells.push({ label: "Si → Fe/Ni Core", color: "#94A3B8" });
    }

    let remnant: string;
    let stages: string[];
    let yields: Array<{ element: string; pct: number; color: string }>;

    if (m < 0.5) {
      remnant = "Helium White Dwarf (in >50 Gyr)";
      stages = ["Molecular Cloud", "Protostar", "Fully Convective Red Dwarf", "Helium White Dwarf"];
      yields = [
        { element: "Helium-4 (retained)", pct: 95, color: "#FBBF24" },
        { element: "Carbon / Oxygen", pct: 5, color: "#38BDF8" },
      ];
    } else if (m < 8.0) {
      remnant =
        m < 6.0
          ? "Carbon-Oxygen White Dwarf (~0.5–1.0 M☉)"
          : "O/Ne/Mg White Dwarf (~1.1–1.3 M☉)";
      stages = [
        "Protostar",
        "Main Sequence",
        "Red Giant Branch",
        m < 2.0 ? "Degenerate He Flash" : "Smooth He Ignition",
        "AGB Thermal Pulses",
        "Planetary Nebula + WD",
      ];
      yields = [
        { element: "Helium-4", pct: 55, color: "#FBBF24" },
        { element: "Carbon & Nitrogen (AGB)", pct: 35, color: "#38BDF8" },
        { element: "s-process Heavy Isotopes", pct: 10, color: "#34D399" },
      ];
    } else if (m < 22.0) {
      remnant = "Type II / Ib Core-Collapse SN → Neutron Star (~1.4 M☉)";
      stages = [
        "Massive O/B Main Sequence",
        "Red/Blue Supergiant",
        "C → Ne → O → Si Burning",
        "Iron Core Collapse",
        "Core-Collapse SN → Neutron Star",
      ];
      yields = [
        { element: "Oxygen / Carbon / Neon", pct: 58, color: "#38BDF8" },
        { element: "Silicon / Sulfur / Calcium", pct: 24, color: "#FB923C" },
        { element: "Iron / Nickel Peak", pct: 18, color: "#94A3B8" },
      ];
    } else if (m < 100 || zRatio > 0.3) {
      remnant =
        m >= 40 && zRatio < 0.2
          ? "Pair-Instability / Direct Black Hole (>25 M☉)"
          : "Hypernova / Collapsar → Stellar-Mass Black Hole";
      stages = [
        "Very Massive O-Star",
        "LBV Eruptions / Wolf-Rayet",
        "Rapid Onion-Shell Burning",
        "Direct Collapse / Collapsar GRB",
        "Black Hole Remnant",
      ];
      yields = [
        { element: "Wolf-Rayet C/N/He Winds", pct: 48, color: "#38BDF8" },
        { element: "α-Elements (O, Mg, Si)", pct: 36, color: "#FB923C" },
        { element: "Fe / r-process Collapsar Disk", pct: 16, color: "#A855F7" },
      ];
    } else {
      remnant = "Pair-Instability Supernova (Total Disruption — 0 M☉ Remnant)";
      stages = [
        "Low-Z Supermassive O-Star",
        "Radiation-Dominated Core",
        "e⁻e⁺ Pair Instability (Γ₁ < 4/3)",
        "Runaway O/Si Thermonuclear Disruption",
      ];
      yields = [
        { element: "Silicon / Sulfur / Argon", pct: 45, color: "#FB923C" },
        { element: "Nickel-56 → Iron-56", pct: 40, color: "#94A3B8" },
        { element: "Oxygen", pct: 15, color: "#38BDF8" },
      ];
    }

    return {
      lumSolar,
      radSolar,
      teffK,
      lifetimeLabel,
      fusionCycle,
      transportStructure,
      spectralClass,
      shells,
      remnant,
      stages,
      yields,
    };
  }, [simMass, simMetallicity]);

  // Derived spectroscopy absorption line strengths (Saha-Boltzmann phenomenology)
  const specLines = useMemo(() => {
    const t = specTeff;
    const dopplerFactor = 1 + specVr / 299792.458;

    // Balmer H peaks sharply near 9600 K
    const balmerStrength = Math.exp(-Math.pow((t - 9600) / 4200, 2));
    // Ca II H&K peaks around 5000 K
    const caStrength = Math.exp(-Math.pow((t - 5200) / 2300, 2));
    // Na I D doublet strong in cool G/K/M
    const naStrength = Math.exp(-Math.pow((t - 3800) / 1700, 2));
    // He I / II strong above 16,000 K
    const heStrength = t > 12000 ? Math.min(1, (t - 12000) / 18000) : 0.02;
    // TiO bands strong below 3900 K
    const tioStrength = t < 4100 ? Math.min(1, (4100 - t) / 1300) : 0;

    const lines = [
      { label: "Ca II K", restNm: 393.4, strength: caStrength * 0.9 },
      { label: "Hγ", restNm: 434.0, strength: balmerStrength * 0.78 },
      { label: "He I", restNm: 447.1, strength: heStrength * 0.75 },
      { label: "Hβ", restNm: 486.1, strength: balmerStrength * 0.88 },
      { label: "Mg I b", restNm: 517.3, strength: caStrength * 0.65 },
      { label: "Na I D", restNm: 589.3, strength: naStrength * 0.82 },
      { label: "TiO Band", restNm: 618.0, strength: tioStrength * 0.85 },
      { label: "Hα", restNm: 656.3, strength: balmerStrength * 0.96 },
    ];

    return lines.map((l) => ({
      ...l,
      obsNm: l.restNm * dopplerFactor,
    }));
  }, [specTeff, specVr]);

  // Transit & RV calculations (assuming 1 M_sun, 1 R_sun host, 10-day orbit)
  const exoMetrics = useMemo(() => {
    const rEarthInSolar = 0.00917;
    const transitDepthPct =
      Math.pow(transitRpEarth * rEarthInSolar, 2) * 100; // %
    const mEarthInJupiter = 1 / 317.8;
    const sinI = Math.sin((orbitInclination * Math.PI) / 180);
    // K for 10-day orbit around 1 M_sun: ~28.43 m/s * (P/1yr)^(-1/3) * M_p(M_J) * sin i
    // (10 / 365.25)^(-1/3) = 3.318
    const kAmplitudeMs =
      28.43 * 3.318 * (rvMassEarth * mEarthInJupiter) * sinI;
    const trueMassEarth = rvMassEarth;
    const obsMinMass = rvMassEarth * sinI;
    const bulkDensityGcm3 =
      (trueMassEarth / Math.pow(transitRpEarth, 3)) * 5.51;

    return {
      transitDepthPct,
      kAmplitudeMs,
      obsMinMass,
      bulkDensityGcm3,
    };
  }, [transitRpEarth, rvMassEarth, orbitInclination]);

  return (
    <div className="mx-auto max-w-[1380px] px-6 py-8 space-y-8">
      {/* Top Simulator Selector */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="text-xs font-mono text-cyan-400">
            Module 11 · Interactive Astrophysics Workbench
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-100">
            Stellar Simulators &amp; Observational Labs
          </h1>
        </div>

        <div
          role="tablist"
          aria-label="Choose interactive simulator"
          className="flex flex-wrap items-center gap-1 p-1 rounded-md bg-[#0B0F17] border border-slate-800"
        >
          {[
            { id: "hr" as const, label: "H-R Diagram Explorer" },
            { id: "evolution" as const, label: "Evolution & Nucleosynthesis" },
            { id: "spectroscopy" as const, label: "Spectroscopy & Transits" },
            { id: "supernova" as const, label: "Supernova & EOS Lab" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={activeTab === t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                activeTab === t.id
                  ? "bg-cyan-400 text-slate-950 font-semibold"
                  : "text-slate-400 hover:text-slate-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* LAB 1: INTERACTIVE HERTZSPRUNG-RUSSELL DIAGRAM */}
      {activeTab === "hr" && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Controls & Telemetry Column */}
          <div className="lg:col-span-4 border border-slate-800 rounded-lg bg-[#0B0F17] p-5 space-y-5">
            <div className="space-y-2 border-b border-slate-800/80 pb-4">
              <div className="text-xs font-mono text-cyan-400">
                Diagram Layer Controls
              </div>
              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer py-1">
                <span>Constant-Radius Iso-Lines (R☉)</span>
                <input
                  type="checkbox"
                  checked={showRadiusLines}
                  onChange={(e) => setShowRadiusLines(e.target.checked)}
                  className="accent-cyan-400"
                />
              </label>
              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer py-1">
                <span>Cepheid Instability Strip</span>
                <input
                  type="checkbox"
                  checked={showInstabilityStrip}
                  onChange={(e) => setShowInstabilityStrip(e.target.checked)}
                  className="accent-cyan-400"
                />
              </label>
            </div>

            {/* Selected Star Readout */}
            <div className="space-y-3">
              <div className="text-xs font-mono text-amber-400">
                Selected Star Telemetry
              </div>
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20"
                  style={{ backgroundColor: selectedHrStar.colorHex }}
                />
                <h2 className="font-display text-lg font-semibold text-slate-100">
                  {selectedHrStar.name}
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                {selectedHrStar.classification}
              </p>

              <dl className="divide-y divide-slate-800/80 text-xs pt-2">
                <div className="py-2 flex justify-between gap-2">
                  <dt className="text-slate-400">Teff</dt>
                  <dd className="font-mono tabular-nums text-slate-100">
                    {selectedHrStar.hrCoordinates.teffK.toLocaleString()} K
                  </dd>
                </div>
                <div className="py-2 flex justify-between gap-2">
                  <dt className="text-slate-400">Luminosity</dt>
                  <dd className="font-mono tabular-nums text-slate-100">
                    {selectedHrStar.hrCoordinates.lumSolar.toLocaleString()} L☉
                  </dd>
                </div>
                <div className="py-2 flex justify-between gap-2">
                  <dt className="text-slate-400">Radius</dt>
                  <dd className="font-mono tabular-nums text-slate-100">
                    {selectedHrStar.radius.numericValue?.toLocaleString()} R☉
                  </dd>
                </div>
                <div className="py-2 flex justify-between gap-2">
                  <dt className="text-slate-400">Stage</dt>
                  <dd className="text-right text-cyan-300 max-w-[190px]">
                    {selectedHrStar.evolutionaryStage}
                  </dd>
                </div>
              </dl>
            </div>

            {hoverCoords && (
              <div className="p-3 rounded bg-[#07090E] border border-slate-800 text-[11px] font-mono tabular-nums text-slate-300 space-y-1">
                <div className="text-cyan-400">Crosshair Probe</div>
                <div>
                  Teff: {Math.round(hoverCoords.teff).toLocaleString()} K · L:{" "}
                  {hoverCoords.lum >= 10
                    ? Math.round(hoverCoords.lum).toLocaleString()
                    : hoverCoords.lum.toExponential(2)}{" "}
                  L☉
                </div>
                <div>
                  Implied Radius:{" "}
                  {hoverCoords.radius >= 1
                    ? hoverCoords.radius.toFixed(1)
                    : hoverCoords.radius.toFixed(3)}{" "}
                  R☉
                </div>
              </div>
            )}
          </div>

          {/* Main SVG H-R Stage */}
          <div className="lg:col-span-8 border border-slate-800 rounded-lg bg-[#07090E] p-4">
            <svg
              viewBox={`0 0 ${HR_WIDTH} ${HR_HEIGHT}`}
              className="w-full h-auto cursor-crosshair select-none"
              role="img"
              aria-label="Interactive Hertzsprung-Russell Diagram"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const sx = ((e.clientX - rect.left) / rect.width) * HR_WIDTH;
                const sy = ((e.clientY - rect.top) / rect.height) * HR_HEIGHT;
                if (
                  sx >= PAD.l &&
                  sx <= HR_WIDTH - PAD.r &&
                  sy >= PAD.t &&
                  sy <= HR_HEIGHT - PAD.b
                ) {
                  const teff = tempForX(sx);
                  const lum = lumForY(sy);
                  const radius =
                    Math.sqrt(lum) * Math.pow(5772 / teff, 2);
                  setHoverCoords({ teff, lum, radius });
                } else {
                  setHoverCoords(null);
                }
              }}
              onMouseLeave={() => setHoverCoords(null)}
            >
              {/* Grid lines */}
              {[1e6, 1e4, 1e2, 1, 1e-2, 1e-4].map((lum) => {
                const y = yForLum(lum);
                return (
                  <g key={lum}>
                    <line
                      x1={PAD.l}
                      x2={HR_WIDTH - PAD.r}
                      y1={y}
                      y2={y}
                      stroke="#1E293B"
                      strokeWidth="1"
                    />
                    <text
                      x={PAD.l - 8}
                      y={y + 3}
                      textAnchor="end"
                      fill="#94A3B8"
                      fontSize="10"
                      fontFamily="IBM Plex Mono"
                    >
                      10^{Math.round(Math.log10(lum))}
                    </text>
                  </g>
                );
              })}

              {[40000, 20000, 10000, 6000, 4000, 3000].map((t) => {
                const x = xForTemp(t);
                return (
                  <g key={t}>
                    <line
                      x1={x}
                      x2={x}
                      y1={PAD.t}
                      y2={HR_HEIGHT - PAD.b}
                      stroke="#1E293B"
                      strokeWidth="1"
                    />
                    <text
                      x={x}
                      y={HR_HEIGHT - PAD.b + 16}
                      textAnchor="middle"
                      fill="#94A3B8"
                      fontSize="10"
                      fontFamily="IBM Plex Mono"
                    >
                      {t.toLocaleString()} K
                    </text>
                  </g>
                );
              })}

              {/* Constant-radius lines L = R^2 * (T/5772)^4 */}
              {showRadiusLines &&
                [0.01, 1, 100, 1000].map((rConst) => {
                  const t1 = 48000;
                  const t2 = 2500;
                  const l1 = rConst * rConst * Math.pow(t1 / 5772, 4);
                  const l2 = rConst * rConst * Math.pow(t2 / 5772, 4);
                  return (
                    <g key={rConst}>
                      <line
                        x1={xForTemp(t1)}
                        y1={yForLum(l1)}
                        x2={xForTemp(t2)}
                        y2={yForLum(l2)}
                        stroke="#334155"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={xForTemp(3200)}
                        y={Math.max(PAD.t + 12, Math.min(HR_HEIGHT - PAD.b - 6, yForLum(rConst * rConst * Math.pow(3200 / 5772, 4)) - 5))}
                        fill="#64748B"
                        fontSize="9"
                        fontFamily="IBM Plex Mono"
                      >
                        {rConst} R☉
                      </text>
                    </g>
                  );
                })}

              {/* Instability Strip */}
              {showInstabilityStrip && (
                <polygon
                  points={`${xForTemp(7400)},${yForLum(100000)} ${xForTemp(5600)},${yForLum(100000)} ${xForTemp(6400)},${yForLum(30)} ${xForTemp(7900)},${yForLum(30)}`}
                  fill="#F59E0B"
                  fillOpacity="0.09"
                  stroke="#F59E0B"
                  strokeOpacity="0.3"
                  strokeDasharray="3 3"
                />
              )}

              {/* Main Sequence Band */}
              <path
                d={MS_LOCUS.map(
                  ([t, l], idx) =>
                    `${idx === 0 ? "M" : "L"}${xForTemp(t).toFixed(1)},${yForLum(l).toFixed(1)}`
                ).join(" ")}
                fill="none"
                stroke="#06B6D4"
                strokeOpacity="0.35"
                strokeWidth="18"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* White Dwarf Locus */}
              <path
                d={WD_LOCUS.map(
                  ([t, l], idx) =>
                    `${idx === 0 ? "M" : "L"}${xForTemp(t).toFixed(1)},${yForLum(l).toFixed(1)}`
                ).join(" ")}
                fill="none"
                stroke="#CBD5E1"
                strokeOpacity="0.35"
                strokeWidth="6"
                strokeDasharray="4 3"
              />

              {/* Zone Labels */}
              <text x={xForTemp(4000)} y={yForLum(250000)} fill="#FB923C" fontSize="10" fontFamily="IBM Plex Mono">
                Red Supergiants
              </text>
              <text x={xForTemp(4200)} y={yForLum(450)} fill="#FBBF24" fontSize="10" fontFamily="IBM Plex Mono">
                Red Giants
              </text>
              <text x={xForTemp(18000)} y={yForLum(0.002)} fill="#CBD5E1" fontSize="10" fontFamily="IBM Plex Mono">
                White Dwarfs
              </text>

              {/* Plot Catalog Stars */}
              {STARS_CATALOG.map((star) => {
                const cx = xForTemp(star.hrCoordinates.teffK);
                const cy = yForLum(star.hrCoordinates.lumSolar);
                const isSel = star.id === selectedHrStar.id;
                return (
                  <g
                    key={star.id}
                    onClick={() => setSelectedHrStar(star)}
                    className="cursor-pointer"
                  >
                    {isSel && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={11}
                        fill="none"
                        stroke="#22D3EE"
                        strokeWidth="1.5"
                      />
                    )}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSel ? 6 : 4.5}
                      fill={star.colorHex}
                      stroke="#07090E"
                      strokeWidth="1.2"
                    />
                    <text
                      x={cx + 8}
                      y={cy + 3}
                      fill={isSel ? "#22D3EE" : "#CBD5E1"}
                      fontSize="9.5"
                      fontFamily="IBM Plex Sans"
                      fontWeight={isSel ? "600" : "400"}
                    >
                      {star.name.split(" (")[0]}
                    </text>
                  </g>
                );
              })}

              {/* Axes labels */}
              <text
                x={(PAD.l + HR_WIDTH - PAD.r) / 2}
                y={HR_HEIGHT - 12}
                textAnchor="middle"
                fill="#94A3B8"
                fontSize="11"
                fontFamily="IBM Plex Mono"
              >
                Effective Temperature Teff (Hot ← → Cool)
              </text>
              <text
                x={18}
                y={(PAD.t + HR_HEIGHT - PAD.b) / 2}
                textAnchor="middle"
                transform={`rotate(-90 18 ${(PAD.t + HR_HEIGHT - PAD.b) / 2})`}
                fill="#94A3B8"
                fontSize="11"
                fontFamily="IBM Plex Mono"
              >
                Luminosity (L / L☉)
              </text>
            </svg>
          </div>
        </section>
      )}

      {/* LAB 2: STELLAR EVOLUTION & NUCLEOSYNTHESIS SIMULATOR */}
      {activeTab === "evolution" && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 border border-slate-800 rounded-lg bg-[#0B0F17] p-6 space-y-6">
            <div>
              <div className="text-xs font-mono text-cyan-400">
                Initial Stellar Parameters
              </div>
              <h2 className="mt-1 font-display text-lg font-semibold text-slate-100">
                Evolution &amp; Yield Controls
              </h2>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <label htmlFor="mass-slider" className="text-slate-300">
                  Initial Mass (M_ZAMS)
                </label>
                <span className="font-mono tabular-nums text-cyan-300 font-semibold">
                  {simMass.toFixed(2)} M☉
                </span>
              </div>
              <input
                id="mass-slider"
                type="range"
                min="0.10"
                max="120"
                step="0.1"
                value={simMass}
                onChange={(e) => setSimMass(Number(e.target.value))}
                className="w-full astro-slider"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>0.1 M☉</span>
                <span>1.0 M☉</span>
                <span>25 M☉</span>
                <span>120 M☉</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {[0.2, 1.0, 4.0, 15.0, 50.0, 110.0].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setSimMass(preset)}
                    className={`px-2 py-1 text-[11px] font-mono rounded border ${
                      Math.abs(simMass - preset) < 0.05
                        ? "border-cyan-400 text-cyan-300 bg-cyan-500/10"
                        : "border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {preset} M☉
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex justify-between text-xs">
                <label htmlFor="z-slider" className="text-slate-300">
                  Metallicity (Z)
                </label>
                <span className="font-mono tabular-nums text-amber-300 font-semibold">
                  Z = {simMetallicity.toFixed(4)}
                </span>
              </div>
              <input
                id="z-slider"
                type="range"
                min="0.0001"
                max="0.030"
                step="0.0005"
                value={simMetallicity}
                onChange={(e) => setSimMetallicity(Number(e.target.value))}
                className="w-full astro-slider"
              />
              <div className="text-[11px] text-slate-400">
                {simMetallicity < 0.002
                  ? "Population II / Early Universe (weak stellar winds)"
                  : simMetallicity < 0.01
                  ? "Sub-solar Disk / LMC-like"
                  : "Solar / Population I (strong line-driven winds)"}
              </div>
            </div>

            <dl className="divide-y divide-slate-800/80 text-xs pt-2 border-t border-slate-800/80">
              <div className="py-2 flex justify-between">
                <dt className="text-slate-400">ZAMS Spectral Class</dt>
                <dd className="font-mono text-cyan-300">{evoModel.spectralClass}V</dd>
              </div>
              <div className="py-2 flex justify-between">
                <dt className="text-slate-400">Effective Temp</dt>
                <dd className="font-mono tabular-nums text-slate-100">
                  {evoModel.teffK.toLocaleString()} K
                </dd>
              </div>
              <div className="py-2 flex justify-between">
                <dt className="text-slate-400">ZAMS Luminosity</dt>
                <dd className="font-mono tabular-nums text-slate-100">
                  {evoModel.lumSolar >= 10
                    ? Math.round(evoModel.lumSolar).toLocaleString()
                    : evoModel.lumSolar.toFixed(3)}{" "}
                  L☉
                </dd>
              </div>
              <div className="py-2 flex justify-between">
                <dt className="text-slate-400">Main-Sequence Lifespan</dt>
                <dd className="font-mono tabular-nums text-amber-300">
                  {evoModel.lifetimeLabel}
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-8 space-y-6">
            {/* Fusion & Onion Shell Cross-Section */}
            <div className="border border-slate-800 rounded-lg bg-[#0B0F17] p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5 flex justify-center">
                <svg
                  viewBox="0 0 240 240"
                  className="w-52 h-52"
                  role="img"
                  aria-label="Stellar interior nuclear burning layers"
                >
                  {evoModel.shells.map((shell, idx) => {
                    const total = evoModel.shells.length;
                    const r = 104 * ((total - idx) / total);
                    return (
                      <circle
                        key={shell.label}
                        cx={120}
                        cy={120}
                        r={r}
                        fill={shell.color}
                        fillOpacity="0.22"
                        stroke={shell.color}
                        strokeWidth="1.8"
                      />
                    );
                  })}
                </svg>
              </div>

              <div className="md:col-span-7 space-y-4">
                <div>
                  <div className="text-xs font-mono text-cyan-400">
                    Interior Physics &amp; Endpoint
                  </div>
                  <h3 className="font-display text-xl font-semibold text-slate-100 mt-1">
                    {evoModel.remnant}
                  </h3>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400">Core Fusion: </span>
                    <span className="text-slate-100 font-medium">
                      {evoModel.fusionCycle}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Energy Transport: </span>
                    <span className="text-slate-100 font-medium">
                      {evoModel.transportStructure}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-mono text-slate-400">
                    Peak Nuclear Burning Shells Reached
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs font-mono">
                    {evoModel.shells.map((s) => (
                      <span key={s.label} className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: s.color }}
                        />
                        <span className="text-slate-200">{s.label}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Evolutionary Stage Timeline + Nucleosynthesis Yields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-800 rounded-lg bg-[#0B0F17] p-5 space-y-3">
                <h3 className="text-sm font-semibold text-slate-100">
                  Evolutionary Life Sequence
                </h3>
                <ol className="space-y-2 text-xs text-slate-300">
                  {evoModel.stages.map((st, idx) => (
                    <li key={st} className="flex items-center gap-2.5">
                      <span className="font-mono text-cyan-400">
                        0{idx + 1}.
                      </span>
                      <span>{st}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="border border-slate-800 rounded-lg bg-[#0B0F17] p-5 space-y-3">
                <h3 className="text-sm font-semibold text-slate-100">
                  Dominant Chemical Element Production
                </h3>
                <div className="space-y-3 pt-1">
                  {evoModel.yields.map((y) => (
                    <div key={y.element} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-200">{y.element}</span>
                        <span className="font-mono tabular-nums text-slate-400">
                          {y.pct}% relative yield
                        </span>
                      </div>
                      <div className="h-2 bg-slate-900 rounded overflow-hidden">
                        <div
                          className="h-full"
                          style={{
                            width: `${y.pct}%`,
                            backgroundColor: y.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LAB 3: OBSERVATIONAL SPECTROSCOPY, DOPPLER & TRANSIT/RV LAB */}
      {activeTab === "spectroscopy" && (
        <section className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4 border border-slate-800 rounded-lg bg-[#0B0F17] p-6 space-y-5">
              <div className="text-xs font-mono text-cyan-400">
                Stellar Spectrograph Controls
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <label htmlFor="spec-teff" className="text-slate-300">
                    Photosphere Temperature (Teff)
                  </label>
                  <span className="font-mono tabular-nums text-cyan-300">
                    {specTeff.toLocaleString()} K
                  </span>
                </div>
                <input
                  id="spec-teff"
                  type="range"
                  min="2800"
                  max="38000"
                  step="200"
                  value={specTeff}
                  onChange={(e) => setSpecTeff(Number(e.target.value))}
                  className="w-full astro-slider"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <label htmlFor="spec-vr" className="text-slate-300">
                    Radial Velocity (v_r)
                  </label>
                  <span className="font-mono tabular-nums text-amber-300">
                    {specVr > 0 ? `+${specVr}` : specVr} km/s
                  </span>
                </div>
                <input
                  id="spec-vr"
                  type="range"
                  min="-2500"
                  max="2500"
                  step="50"
                  value={specVr}
                  onChange={(e) => setSpecVr(Number(e.target.value))}
                  className="w-full astro-slider"
                />
                <p className="text-[11px] text-slate-400">
                  Exaggerated cosmic velocity scale (±2,500 km/s) makes Doppler shifts Δλ/λ₀ = v_r/c visually inspectable relative to dashed rest lines.
                </p>
              </div>
            </div>

            {/* Live Optical Absorption Spectrum Bar */}
            <div className="lg:col-span-8 border border-slate-800 rounded-lg bg-[#0B0F17] p-6 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-300">
                  Optical Absorption Spectrum (380 – 690 nm)
                </span>
                <span className="font-mono text-slate-400">
                  Dashed = Rest Wavelength · Solid Dark = Observed Shifted Line
                </span>
              </div>

              <svg
                viewBox="0 0 700 170"
                className="w-full h-auto"
                role="img"
                aria-label="Simulated optical stellar absorption spectrum"
              >
                <defs>
                  <linearGradient id="optSpectrum" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#6D28D9" />
                    <stop offset="20%" stopColor="#2563EB" />
                    <stop offset="40%" stopColor="#06B6D4" />
                    <stop offset="55%" stopColor="#22C55E" />
                    <stop offset="72%" stopColor="#EAB308" />
                    <stop offset="88%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#DC2626" />
                  </linearGradient>
                </defs>

                <rect
                  x={20}
                  y={30}
                  width={660}
                  height={84}
                  rx={3}
                  fill="url(#optSpectrum)"
                  opacity={0.92}
                />

                {specLines.map((line) => {
                  const xForLam = (nm: number) =>
                    20 + ((nm - 380) / (690 - 380)) * 660;
                  const xRest = xForLam(line.restNm);
                  const xObs = xForLam(line.obsNm);
                  const opacity = Math.min(0.95, Math.max(0.05, line.strength));

                  return (
                    <g key={line.label}>
                      {/* Rest frame marker */}
                      <line
                        x1={xRest}
                        x2={xRest}
                        y1={24}
                        y2={120}
                        stroke="#E2E8F0"
                        strokeOpacity={0.35}
                        strokeDasharray="3 3"
                      />
                      {/* Observed absorption line */}
                      <line
                        x1={xObs}
                        x2={xObs}
                        y1={30}
                        y2={114}
                        stroke="#07090E"
                        strokeWidth={line.label === "TiO Band" ? 12 : 3.5}
                        strokeOpacity={opacity}
                      />
                      <text
                        x={xObs}
                        y={136}
                        textAnchor="middle"
                        fill="#CBD5E1"
                        fontSize="9"
                        fontFamily="IBM Plex Mono"
                      >
                        {line.label}
                      </text>
                      <text
                        x={xObs}
                        y={150}
                        textAnchor="middle"
                        fill="#64748B"
                        fontSize="8.5"
                        fontFamily="IBM Plex Mono"
                      >
                        {line.obsNm.toFixed(1)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Transit & Radial Velocity Exoplanet Lab */}
          <div className="border border-slate-800 rounded-lg bg-[#0B0F17] p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-mono text-amber-400">
                Exoplanet Detection Lab (1 M☉, 1 R☉ Host, P = 10 d)
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <label htmlFor="rp-slider" className="text-slate-300">
                    Planet Radius (R_p)
                  </label>
                  <span className="font-mono tabular-nums text-cyan-300">
                    {transitRpEarth.toFixed(1)} R⊕
                  </span>
                </div>
                <input
                  id="rp-slider"
                  type="range"
                  min="1.0"
                  max="14.0"
                  step="0.5"
                  value={transitRpEarth}
                  onChange={(e) => setTransitRpEarth(Number(e.target.value))}
                  className="w-full astro-slider"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <label htmlFor="mp-slider" className="text-slate-300">
                    Planet Mass (M_p)
                  </label>
                  <span className="font-mono tabular-nums text-cyan-300">
                    {rvMassEarth.toFixed(0)} M⊕
                  </span>
                </div>
                <input
                  id="mp-slider"
                  type="range"
                  min="1"
                  max="350"
                  step="1"
                  value={rvMassEarth}
                  onChange={(e) => setRvMassEarth(Number(e.target.value))}
                  className="w-full astro-slider"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <label htmlFor="inc-slider" className="text-slate-300">
                    Orbital Inclination (i)
                  </label>
                  <span className="font-mono tabular-nums text-cyan-300">
                    {orbitInclination.toFixed(1)}°
                  </span>
                </div>
                <input
                  id="inc-slider"
                  type="range"
                  min="80"
                  max="90"
                  step="0.2"
                  value={orbitInclination}
                  onChange={(e) => setOrbitInclination(Number(e.target.value))}
                  className="w-full astro-slider"
                />
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="p-4 rounded bg-[#07090E] border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400">Transit Depth (ΔF/F)</div>
                <div className="font-mono tabular-nums text-xl font-semibold text-cyan-300">
                  {exoMetrics.transitDepthPct.toFixed(3)}%
                </div>
                <div className="text-[11px] font-mono text-slate-500">
                  (R_p / R☉)² photometry dip
                </div>
              </div>
              <div className="p-4 rounded bg-[#07090E] border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400">RV Semi-Amplitude (K)</div>
                <div className="font-mono tabular-nums text-xl font-semibold text-amber-300">
                  {exoMetrics.kAmplitudeMs.toFixed(2)} m/s
                </div>
                <div className="text-[11px] font-mono text-slate-500">
                  M sin i = {exoMetrics.obsMinMass.toFixed(1)} M⊕
                </div>
              </div>
              <div className="p-4 rounded bg-[#07090E] border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400">Inferred Bulk Density</div>
                <div className="font-mono tabular-nums text-xl font-semibold text-emerald-300">
                  {exoMetrics.bulkDensityGcm3.toFixed(2)} g/cm³
                </div>
                <div className="text-[11px] font-mono text-slate-500">
                  {exoMetrics.bulkDensityGcm3 > 3.5
                    ? "Rocky / Iron-rich world"
                    : exoMetrics.bulkDensityGcm3 > 1.5
                    ? "Volatile-rich Ice/Sub-Neptune"
                    : "H/He Gas Giant"}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LAB 4: SUPERNOVA & EQUATION OF STATE LAB */}
      {activeTab === "supernova" && (
        <section className="border border-slate-800 rounded-lg bg-[#0B0F17] p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div>
              <div className="text-xs font-mono text-cyan-400">
                Module 02, 05 &amp; 10 · Stellar Explosions &amp; Instability Mechanisms
              </div>
              <h2 className="font-display text-2xl font-semibold text-slate-100">
                Supernova Mechanism Comparator
              </h2>
            </div>

            <div className="inline-flex p-1 rounded-md bg-[#07090E] border border-slate-800">
              {[
                { id: "core-collapse" as const, label: "Core-Collapse (Type II/Ib/Ic)" },
                { id: "type-ia" as const, label: "Thermonuclear (Type Ia)" },
                { id: "pisn" as const, label: "Pair-Instability (PISN)" },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSnScenario(s.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                    snScenario === s.id
                      ? "bg-cyan-400 text-slate-950 font-semibold"
                      : "text-slate-400 hover:text-slate-100"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {snScenario === "core-collapse" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-300 leading-relaxed">
              <div className="space-y-2">
                <div className="text-xs font-mono text-cyan-400">Trigger Physics</div>
                <p>
                  An 8–30+ M☉ supergiant builds an inert iron-nickel core exceeding the effective
                  Chandrasekhar limit (~1.4 M☉). Electron capture (p + e⁻ → n + ν_e) and iron
                  photodisintegration remove pressure support, collapsing the core at ~0.23c in
                  milliseconds.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-mono text-amber-400">Energy Budget</div>
                <p>
                  Gravitational binding energy released is ~3 × 10⁴⁶ J (3 × 10⁵³ erg), of which{" "}
                  <span className="text-slate-100 font-semibold">99% escapes as neutrinos</span>{" "}
                  (detected from SN 1987A!) and ~1% powers the shockwave and optical light curve.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-mono text-emerald-400">Observational Signature</div>
                <p>
                  Hydrogen lines present → Type II; hydrogen stripped → Type Ib; both H and He
                  stripped → Type Ic. Leaves behind a Neutron Star (Crab Pulsar) or Black Hole.
                </p>
              </div>
            </div>
          )}

          {snScenario === "type-ia" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-300 leading-relaxed">
              <div className="space-y-2">
                <div className="text-xs font-mono text-cyan-400">Trigger Physics</div>
                <p>
                  A Carbon-Oxygen White Dwarf in a binary accretes mass or merges with another WD,
                  approaching the 1.44 M☉ Chandrasekhar limit. Because degenerate pressure is
                  temperature-independent, carbon ignition causes a runaway thermonuclear detonation
                  across the star.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-mono text-amber-400">Energy Budget</div>
                <p>
                  Synthesizes ~0.6 M☉ of radioactive ⁵⁶Ni → ⁵⁶Co → ⁵⁶Fe, powering a remarkably
                  uniform peak luminosity (~4 × 10⁹ L☉) calibrated via the Phillips relation for
                  cosmological dark energy measurements.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-mono text-emerald-400">Observational Signature</div>
                <p>
                  Zero hydrogen lines, strong blueshifted Silicon II (615 nm) absorption, and{" "}
                  <span className="text-slate-100 font-semibold">complete disruption</span> leaving
                  no compact remnant behind.
                </p>
              </div>
            </div>
          )}

          {snScenario === "pisn" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-300 leading-relaxed">
              <div className="space-y-2">
                <div className="text-xs font-mono text-cyan-400">Trigger Physics</div>
                <p>
                  In extremely massive (~140–260 M☉) low-metallicity stars, high core entropy lets
                  gamma-ray photons convert into electron-positron pairs (γ + γ ↔ e⁻ + e⁺).
                  Removing photon pressure drops Γ₁ below 4/3, collapsing the core onto explosive
                  oxygen-silicon burning.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-mono text-amber-400">Energy Budget</div>
                <p>
                  Explosive O/Si fusion releases ~10⁵²–10⁵³ ergs—up to 100× more kinetic energy than
                  normal core collapse—synthesizing up to tens of solar masses of iron-group elements.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-mono text-emerald-400">Observational Signature</div>
                <p>
                  Leaves zero black hole remnant, carving out the theoretical ~60–120 M☉ pair-instability
                  black-hole mass gap tested by LIGO/Virgo gravitational-wave catalogs.
                </p>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
