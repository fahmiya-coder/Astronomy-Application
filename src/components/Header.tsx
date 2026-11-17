import { WorkspaceView } from "../types/astrophysics";

interface HeaderProps {
  activeView: WorkspaceView;
  onNavigate: (view: WorkspaceView) => void;
  onOpenMentor: () => void;
}

const NAV_ITEMS: Array<{ id: WorkspaceView; label: string }> = [
  { id: "roadmap", label: "Roadmap" },
  { id: "lessons", label: "Lessons" },
  { id: "atlas", label: "Star Atlas" },
  { id: "simulators", label: "Simulators" },
  { id: "research", label: "Research Lab" },
];

export function Header({ activeView, onNavigate, onOpenMentor }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/90 bg-[#07090E]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1380px] items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Single-line Wordmark */}
        <button
          type="button"
          onClick={() => onNavigate("roadmap")}
          className="font-display text-lg font-bold tracking-tight text-slate-100 whitespace-nowrap shrink-0 hover:text-cyan-300 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400"
        >
          Stellar Observatory
        </button>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav
          aria-label="Primary workspace navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400 ${
                  isActive
                    ? "text-cyan-400"
                    : "text-slate-400 hover:text-slate-100"
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[15px] h-[2px] bg-cyan-400"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary CTA */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenMentor}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 rounded-md hover:bg-cyan-300 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          >
            Ask Professor
          </button>
        </div>
      </div>

      {/* Mobile compact nav row (only visible on small screens) */}
      <nav
        aria-label="Mobile workspace navigation"
        className="flex md:hidden items-center gap-5 overflow-x-auto border-t border-slate-800/80 px-6 py-2 text-xs font-medium"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`whitespace-nowrap shrink-0 py-1 ${
                isActive ? "text-cyan-400 border-b border-cyan-400" : "text-slate-400"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
