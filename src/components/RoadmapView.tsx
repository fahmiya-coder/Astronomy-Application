import { ArrowRight, BookOpen, Compass, FlaskConical, Telescope } from "lucide-react";
import { CURRICULUM_MODULES, ROADMAP_STAGES } from "../data/curriculumModules";
import { WorkspaceView } from "../types/astrophysics";
import { RichMathText } from "./MathBlock";

interface RoadmapViewProps {
  completedModules: number[];
  onSelectModule: (moduleId: number) => void;
  onNavigate: (view: WorkspaceView) => void;
}

export function RoadmapView({
  completedModules,
  onSelectModule,
  onNavigate,
}: RoadmapViewProps) {
  const lesson1 = CURRICULUM_MODULES[0];

  return (
    <div className="mx-auto max-w-[1380px] px-6 py-10 space-y-16">
      {/* Hero Split Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <p className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              Astrophysics Curriculum · Modules 01–13 · Observation to Computation
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-slate-100 text-balance leading-[1.12]">
              Stellar Exploration &amp; Astrophysics Research Platform
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Progress systematically from the birth of protostars inside cold molecular clouds to
              quantum-degenerate interiors, relativistic compact objects, multi-wavelength
              spectroscopy, and reproducible Python analysis of Gaia DR3 data.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => onSelectModule(1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-cyan-400 text-slate-950 rounded-md hover:bg-cyan-300 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Begin Lesson 1: What Is a Star?</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate("simulators")}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-200 border border-slate-700 rounded-md hover:border-slate-500 hover:bg-slate-900/60 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Open Interactive Simulators</span>
            </button>
          </div>

          {/* Clean unboxed quantitative index row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-slate-800/80">
            <div>
              <div className="text-xs text-slate-400">Curriculum Scope</div>
              <div className="mt-1 font-mono tabular-nums text-xl font-semibold text-slate-100">
                10 <span className="text-xs font-normal text-slate-400">core modules</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Famous Star Dossiers</div>
              <div className="mt-1 font-mono tabular-nums text-xl font-semibold text-slate-100">
                15 <span className="text-xs font-normal text-slate-400">benchmarked</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Stellar Categories</div>
              <div className="mt-1 font-mono tabular-nums text-xl font-semibold text-slate-100">
                17 <span className="text-xs font-normal text-slate-400">classifications</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Your Mastery</div>
              <div className="mt-1 font-mono tabular-nums text-xl font-semibold text-cyan-400">
                {completedModules.length}/10{" "}
                <span className="text-xs font-normal text-slate-400">completed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Focal Anchor */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="relative flex-1 min-h-[280px] overflow-hidden rounded-lg border border-slate-800 bg-[#0B0E17]">
            <img
              src="/src/assets/images/hero_stellar_nursery_1794929685239.jpg"
              alt="Molecular cloud pillar collapsing into an accreting protostar with bipolar Herbig-Haro outflows"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#07090E] via-[#07090E]/80 to-transparent p-5">
              <div className="text-xs font-mono text-cyan-300">
                Stage 01 · Protostellar Accretion &amp; Bipolar Outflows
              </div>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                Cold molecular filaments (~10–20 K) exceed the Jeans mass, forming a rotating disk
                and magnetocentrifugal jets that shed angular momentum.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Complete 5-Stage Star Exploration Roadmap */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-slate-100">
              Complete Star Exploration Roadmap
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Five progressive tracks taking you from foundational astronomy to computational stellar modeling.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Select any module below to launch its lesson, equations &amp; assessment
          </div>
        </div>

        <div className="divide-y divide-slate-800/80 border border-slate-800/90 rounded-lg bg-[#0B0F17]">
          {ROADMAP_STAGES.map((stage) => {
            const stageModules = CURRICULUM_MODULES.filter((m) =>
              stage.moduleIds.includes(m.id)
            );
            const doneCount = stageModules.filter((m) =>
              completedModules.includes(m.id)
            ).length;

            return (
              <div
                key={stage.id}
                className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
              >
                <div className="lg:col-span-5 space-y-2.5">
                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                    <span className="text-cyan-400 font-semibold">
                      0{stage.id}.
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">
                      {doneCount}/{stageModules.length} modules completed
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-slate-100 capitalize">
                    {stage.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {stage.summary}
                  </p>
                  <ul className="pt-2 space-y-1.5 text-xs text-slate-400">
                    {stage.coreSkills.map((skill, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-cyan-400 mt-0.5" aria-hidden="true">
                          ›
                        </span>
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lg:col-span-7 space-y-3">
                  {stageModules.map((mod) => {
                    const isDone = completedModules.includes(mod.id);
                    return (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => onSelectModule(mod.id)}
                        className="w-full text-left p-4 rounded-md border border-slate-800/90 bg-[#07090E]/70 hover:border-cyan-500/60 hover:bg-slate-900/60 transition-colors flex items-center justify-between gap-4 group"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                            <span>Module {String(mod.id).padStart(2, "0")}</span>
                            <span aria-hidden="true">·</span>
                            <span>{mod.sections.length} sections</span>
                            <span aria-hidden="true">·</span>
                            <span
                              className={
                                isDone ? "text-emerald-400" : "text-slate-400"
                              }
                            >
                              {isDone ? "● Completed" : "○ Ready"}
                            </span>
                          </div>
                          <div className="font-medium text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
                            {mod.title}
                          </div>
                          <div className="text-xs text-slate-400 line-clamp-1">
                            {mod.subtitle}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* First Task Launchpad: Begin Lesson 1 Preview */}
      <section className="border border-slate-800 rounded-lg bg-[#0B0F17] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <div className="text-xs font-mono text-amber-400">
              First Task · Lesson 1 Entry
            </div>
            <h2 className="mt-1 font-display text-2xl font-semibold text-slate-100">
              {lesson1.title}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {lesson1.overview}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectModule(1)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-cyan-400 text-slate-950 rounded-md hover:bg-cyan-300 transition-colors whitespace-nowrap shrink-0"
          >
            <BookOpen className="w-4 h-4" />
            <span>Enter Full Lesson 1 &amp; Quiz</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="text-xs font-mono text-cyan-400">01. Core Concept</div>
            <h3 className="text-base font-semibold text-slate-100">
              What Defines a Star?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              <RichMathText text="A self-gravitating plasma sphere balanced in hydrostatic equilibrium ($dP/dr = -GM\\rho/r^2$) that replenishes radiative surface losses through sustained core nuclear fusion above the ~0.08 $M_\\odot$ hydrogen-ignition threshold." />
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono text-cyan-400">02. Interactive Lab</div>
            <h3 className="text-base font-semibold text-slate-100">
              Explore 15 Famous Stars &amp; H-R Tracks
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Inspect verified Gaia DR3 parallaxes, CHARA interferometric radii, and Planck
              blackbody curves across 15 benchmark stars—from Proxima Centauri to R136a1.
            </p>
            <button
              type="button"
              onClick={() => onNavigate("atlas")}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300 pt-1"
            >
              <Telescope className="w-3.5 h-3.5" />
              <span>Browse Star Atlas</span>
            </button>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono text-cyan-400">03. Research Methods</div>
            <h3 className="text-base font-semibold text-slate-100">
              Python Modeling &amp; Literature Synthesis
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Run Lane-Emden structure solvers and Gaia Color-Magnitude pipelines, or query
              NASA/ESA/ESO peer-reviewed findings in the grounded Research Lab.
            </p>
            <div className="flex items-center gap-4 pt-1">
              <button
                type="button"
                onClick={() => onNavigate("simulators")}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Simulators</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate("research")}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Research Lab</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
