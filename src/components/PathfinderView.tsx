import React, { useState, useMemo, useEffect } from 'react';
import {
  Compass,
  ArrowRight,
  GitBranch,
  Sparkles,
  RefreshCw,
  Crown,
  Heart,
} from 'lucide-react';
import { PERSONS } from '../data/persons';
import { PATHFINDER_PRESETS } from '../data/events';
import { findShortestLineagePath } from '../utils/lineageGraph';
import { HabsburgPerson } from '../types/habsburg';

interface PathfinderViewProps {
  initialFromId?: string | null;
  onSelectPerson: (person: HabsburgPerson) => void;
}

export const PathfinderView: React.FC<PathfinderViewProps> = ({
  initialFromId,
  onSelectPerson,
}) => {
  const [fromId, setFromId] = useState<string>(initialFromId || 'rudolf1');
  const [toId, setToId] = useState<string>('ferdinand_zvonimir');
  const [bloodlineOnly, setBloodlineOnly] = useState<boolean>(false);

  useEffect(() => {
    if (initialFromId) {
      setFromId(initialFromId);
      if (initialFromId === toId) {
        setToId('karl1');
      }
    }
  }, [initialFromId]);

  const pathSteps = useMemo(
    () => findShortestLineagePath(fromId, toId, bloodlineOnly),
    [fromId, toId, bloodlineOnly]
  );

  const handleSwap = () => {
    setFromId(toId);
    setToId(fromId);
  };

  return (
    <div className="space-y-6">
      {/* Intro & Scenario Presets */}
      <div className="bg-[#0e1526]/90 border border-amber-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-amber-300 flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              <span>혈연 · 제위 승계 경로 추적기 (Lineage Pathfinder)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              750년 합스부르크 가계도 내 임의의 두 인물을 선택하면 부모-자식 혈연선과 정략결혼 혼맥을 따라 최단 연결 경로를 시뮬레이션합니다.
            </p>
          </div>
        </div>

        {/* Presets */}
        <div className="mb-5">
          <div className="text-xs font-bold text-amber-300/90 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> 추천 역사 시나리오 프리셋 (클릭하여 즉시 시뮬레이션)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {PATHFINDER_PRESETS.map((preset) => {
              const isSelected =
                fromId === preset.fromId && toId === preset.toId;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setFromId(preset.fromId);
                    setToId(preset.toId);
                  }}
                  className={`text-left p-3 rounded-xl border transition ${
                    isSelected
                      ? 'bg-emerald-950/50 border-emerald-400 text-emerald-100 shadow-lg'
                      : 'bg-slate-900/70 hover:bg-slate-800/80 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-amber-300">
                      {preset.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                      {preset.badge}
                    </span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-300 mb-1">
                    {preset.subtitle}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {preset.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Selector Controls */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center bg-slate-900/90 p-4 rounded-xl border border-slate-800">
          <div className="md:col-span-5">
            <label className="block text-xs font-semibold text-amber-300 mb-1">
              출발 인물 (Person A)
            </label>
            <select
              value={fromId}
              onChange={(e) => setFromId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
            >
              {PERSONS.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.generation}세대] {p.nameKo} ({p.lifespan})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-1 flex justify-center pt-2 md:pt-5">
            <button
              onClick={handleSwap}
              className="p-2.5 rounded-full bg-slate-800 hover:bg-amber-500/20 text-amber-300 border border-slate-700 transition"
              title="출발·도착 인물 맞바꾸기"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="md:col-span-5">
            <label className="block text-xs font-semibold text-emerald-300 mb-1">
              도착 인물 (Person B)
            </label>
            <select
              value={toId}
              onChange={(e) => setToId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-emerald-400"
            >
              {PERSONS.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.generation}세대] {p.nameKo} ({p.lifespan})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
          <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={bloodlineOnly}
              onChange={(e) => setBloodlineOnly(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500"
            />
            <span>배우자(혼인) 연결을 제외하고 순수 부모-자녀 혈연선으로만 탐색</span>
          </label>
          {pathSteps.length > 1 && (
            <div className="text-xs font-semibold text-emerald-300">
              총 <span className="text-amber-300 font-bold">{pathSteps.length - 1}단계</span> 연결 · 세대 차이:{' '}
              <span className="text-amber-300 font-bold">
                {Math.abs(
                  pathSteps[pathSteps.length - 1].person.generation -
                    pathSteps[0].person.generation
                )}
                세대
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Path Visualization */}
      <div className="bg-[#0d1323]/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-amber-300 mb-4 flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-amber-400" />
          <span>추적된 단계별 계보 체인 (클릭 시 인물 상세 아카이브 열림)</span>
        </h3>

        {pathSteps.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">
            두 인물 사이의 경로를 찾을 수 없습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {pathSteps.map((step, index) => {
              const p = step.person;
              const isStart = index === 0;
              const isEnd = index === pathSteps.length - 1;

              return (
                <React.Fragment key={`${p.id}-${index}`}>
                  {index > 0 && (
                    <div className="flex items-center gap-3 pl-6 py-1">
                      <div className="w-0.5 h-6 bg-gradient-to-b from-amber-400 to-emerald-400" />
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${
                          step.edgeType === 'spouse'
                            ? 'bg-pink-500/20 text-pink-200 border-pink-500/40'
                            : 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40'
                        }`}
                      >
                        {step.edgeType === 'spouse' ? (
                          <Heart className="w-3.5 h-3.5 text-pink-400" />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                        {step.relationFromPrev}
                      </span>
                    </div>
                  )}

                  <div
                    onClick={() => onSelectPerson(p)}
                    className={`cursor-pointer p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isStart
                        ? 'bg-gradient-to-r from-amber-500/20 via-slate-900 to-slate-900 border-amber-400'
                        : isEnd
                        ? 'bg-gradient-to-r from-emerald-500/20 via-slate-900 to-slate-900 border-emerald-400'
                        : 'bg-slate-900/90 hover:bg-slate-800/80 border-slate-800 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-300">
                          Step {index + 1} · {p.generation}세대
                        </span>
                        <span className="font-serif text-base sm:text-lg font-bold text-white">
                          {p.nameKo}
                        </span>
                        <span className="text-xs text-slate-400">
                          {p.nameEn} ({p.lifespan})
                        </span>
                        {p.reign && (
                          <span className="text-xs px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium">
                            <Crown className="w-3 h-3 inline mr-1" />
                            {p.reign}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-2">
                        {p.summary}
                      </p>
                    </div>
                    <div className="text-xs font-semibold text-amber-300 shrink-0">
                      상세 보기 →
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
