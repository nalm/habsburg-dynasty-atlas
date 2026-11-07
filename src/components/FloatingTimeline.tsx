import React, { useState } from 'react';
import { Scroll, ChevronRight, ChevronLeft } from 'lucide-react';
import { VISIBLE_PERSONS } from '../data/persons';
import { HabsburgPerson } from '../types/habsburg';

interface FloatingTimelineProps {
  onSelectPerson: (person: HabsburgPerson) => void;
}

export const FloatingTimeline: React.FC<FloatingTimelineProps> = ({
  onSelectPerson,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const rulers = VISIBLE_PERSONS.filter(
    (p) =>
      p.role === 'emperor' ||
      p.role === 'empress_regnant' ||
      p.role === 'spanish_king' ||
      p.role === 'head_of_house'
  );

  const handleClick = (person: HabsburgPerson) => {
    const el = document.getElementById(`person-card-${person.id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    onSelectPerson(person);
  };

  return (
    <div className="hidden xl:block fixed right-4 top-1/2 -translate-y-1/2 z-30">
      {collapsed ? (
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-l-xl bg-[#0d1323]/95 border border-amber-500/40 text-amber-300 shadow-xl hover:bg-slate-900 transition text-xs font-bold"
          title="황제 연대표 열기"
        >
          <ChevronLeft className="w-4 h-4" />
          <Scroll className="w-4 h-4" />
          <span>연대표</span>
        </button>
      ) : (
        <div className="w-56 bg-[#0b101e]/95 backdrop-blur-md border border-amber-500/40 rounded-xl shadow-2xl p-3 max-h-[76vh] flex flex-col">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-500/20">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              📜 750년 군주·수장 연대표
            </span>
            <button
              onClick={() => setCollapsed(true)}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              title="연대표 접기"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-y-auto space-y-1 pr-1">
            {rulers.map((r) => {
              const isSpanish = r.branch === 'spanish';
              const isLorraine =
                r.branch === 'lorraine' || r.branch === 'lorraine_branch';
              const isModern = r.branch === 'modern';
              return (
                <button
                  key={r.id}
                  onClick={() => handleClick(r)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-r-md border-l-2 text-[11px] transition flex items-center justify-between gap-1 ${
                    isSpanish
                      ? 'border-rose-500 hover:bg-rose-500/15 text-rose-200'
                      : isLorraine
                      ? 'border-purple-400 hover:bg-purple-500/15 text-purple-200'
                      : isModern
                      ? 'border-sky-400 hover:bg-sky-500/15 text-sky-200'
                      : 'border-amber-400 hover:bg-amber-500/15 text-amber-100'
                  }`}
                >
                  <span className="font-semibold truncate">{r.nameKo}</span>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {r.reign
                      ? r.reign.replace(/.*(\d{4}[–-]\d{2,4}).*/, '$1')
                      : r.birthYear}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
