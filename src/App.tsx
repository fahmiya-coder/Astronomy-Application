import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { RoadmapView } from "./components/RoadmapView";
import { LessonsView } from "./components/LessonsView";
import { StarAtlasView } from "./components/StarAtlasView";
import { SimulatorsView } from "./components/SimulatorsView";
import { ResearchLabView } from "./components/ResearchLabView";
import { MentorDrawer } from "./components/MentorDrawer";
import { CURRICULUM_MODULES } from "./data/curriculumModules";
import { WorkspaceView } from "./types/astrophysics";

const STORAGE_KEY = "stellar_observatory_completed_modules";

export default function App() {
  const [activeView, setActiveView] = useState<WorkspaceView>("roadmap");
  const [selectedModuleId, setSelectedModuleId] = useState<number>(1);
  const [mentorOpen, setMentorOpen] = useState<boolean>(false);
  const [completedModules, setCompletedModules] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as number[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedModules));
    } catch {
      // Ignore storage quota errors
    }
  }, [completedModules]);

  function handleSelectModule(moduleId: number) {
    setSelectedModuleId(moduleId);
    setActiveView("lessons");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleNavigate(view: WorkspaceView) {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleToggleComplete(id: number) {
    setCompletedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  }

  const activeModule = CURRICULUM_MODULES.find(
    (m) => m.id === selectedModuleId
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-slate-100">
      <Header
        activeView={activeView}
        onNavigate={handleNavigate}
        onOpenMentor={() => setMentorOpen(true)}
      />

      <div className="flex-1">
        {activeView === "roadmap" && (
          <RoadmapView
            completedModules={completedModules}
            onSelectModule={handleSelectModule}
            onNavigate={handleNavigate}
          />
        )}

        {activeView === "lessons" && (
          <LessonsView
            selectedModuleId={selectedModuleId}
            onSelectModule={setSelectedModuleId}
            completedModules={completedModules}
            onToggleComplete={handleToggleComplete}
          />
        )}

        {activeView === "atlas" && <StarAtlasView />}

        {activeView === "simulators" && <SimulatorsView />}

        {activeView === "research" && <ResearchLabView />}
      </div>

      <footer className="border-t border-slate-800/80 py-6 px-6 text-xs text-slate-500">
        <div className="mx-auto max-w-[1380px] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Stellar Observatory · Interactive Astrophysics Exploration Platform</span>
          <span>Data calibrated to IAU, Gaia DR3, VLTI/CHARA &amp; NASA/ESA/ESO references</span>
        </div>
      </footer>

      <MentorDrawer
        isOpen={mentorOpen}
        onClose={() => setMentorOpen(false)}
        contextModuleTitle={
          activeView === "lessons" && activeModule ? activeModule.title : undefined
        }
      />
    </div>
  );
}
