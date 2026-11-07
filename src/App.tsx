import React, { useState } from 'react';
import { Header, ActiveTab } from './components/Header';
import { DynastyTreeView } from './components/DynastyTreeView';
import { PathfinderView } from './components/PathfinderView';
import { InbreedingView } from './components/InbreedingView';
import { TimelineTerritoryView } from './components/TimelineTerritoryView';
import { PersonDetailDrawer } from './components/PersonDetailDrawer';
import { FloatingTimeline } from './components/FloatingTimeline';
import { HabsburgPerson } from './types/habsburg';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('tree');
  const [selectedPerson, setSelectedPerson] = useState<HabsburgPerson | null>(
    null
  );
  const [pathfinderFromId, setPathfinderFromId] = useState<string | null>(null);

  const handleTraceFromPerson = (personId: string) => {
    setSelectedPerson(null);
    setPathfinderFromId(personId);
    setActiveTab('pathfinder');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-100">
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onSelectPerson={(p) => setSelectedPerson(p)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'tree' && (
          <DynastyTreeView onSelectPerson={(p) => setSelectedPerson(p)} />
        )}
        {activeTab === 'pathfinder' && (
          <PathfinderView
            initialFromId={pathfinderFromId}
            onSelectPerson={(p) => setSelectedPerson(p)}
          />
        )}
        {activeTab === 'inbreeding' && (
          <InbreedingView onSelectPerson={(p) => setSelectedPerson(p)} />
        )}
        {activeTab === 'timeline' && (
          <TimelineTerritoryView onSelectPerson={(p) => setSelectedPerson(p)} />
        )}
      </main>

      {activeTab === 'tree' && (
        <FloatingTimeline onSelectPerson={(p) => setSelectedPerson(p)} />
      )}

      <PersonDetailDrawer
        person={selectedPerson}
        onClose={() => setSelectedPerson(null)}
        onSelectPerson={(p) => setSelectedPerson(p)}
        onTraceFromPerson={handleTraceFromPerson}
      />

      <footer className="border-t border-slate-800/80 bg-[#070a12] py-6 px-4 sm:px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-serif font-bold">
              🏰 합스부르크 왕조 750년 가계도 아카이브
            </span>
            <span>·</span>
            <span>루돌프 1세(1273) ~ 페르디난트 즈보니미르(현재)</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="http://www.nalm.info/projects/habsburg/"
              className="hover:text-amber-300 transition"
            >
              기존 페이지 ↗
            </a>
            <a
              href="http://www.nalm.info/projects/"
              className="hover:text-amber-300 transition"
            >
              nalm.info 만든 것 ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
