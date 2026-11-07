import React, { useState } from 'react';
import {
  Crown,
  ChevronDown,
  ChevronUp,
  Sparkles,
  GitBranch,
  Dna,
  MapPin,
  Info,
  Network,
  LayoutGrid,
} from 'lucide-react';
import { ERAS } from '../data/eras';
import { VISIBLE_PERSONS, getPersonById } from '../data/persons';
import { EraId, HabsburgPerson, RoleBadge } from '../types/habsburg';
import { VisualFamilyTree } from './VisualFamilyTree';

interface DynastyTreeViewProps {
  onSelectPerson: (person: HabsburgPerson) => void;
}

export const DynastyTreeView: React.FC<DynastyTreeViewProps> = ({
  onSelectPerson,
}) => {
  const [viewMode, setViewMode] = useState<'visual_tree' | 'cards'>('visual_tree');
  const [selectedEra, setSelectedEra] = useState<EraId | 'all'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'rulers' | 'consanguinity' | 'tragic'>('all');
  const [expandedChildrenMap, setExpandedChildrenMap] = useState<Record<string, boolean>>({});

  const toggleExpandChildren = (personId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedChildrenMap((prev) => ({ ...prev, [personId]: !prev[personId] }));
  };

  const getRulerCardStyle = (p: HabsburgPerson) => {
    if (p.id === 'karl1') {
      return 'bg-gradient-to-br from-rose-600 via-red-600 to-rose-800 text-white border-rose-300 shadow-rose-500/30';
    }
    if (p.role === 'empress_regnant') {
      return 'bg-gradient-to-br from-purple-500 via-fuchsia-600 to-purple-800 text-white border-amber-300 shadow-purple-500/30';
    }
    if (p.role === 'spanish_king') {
      return 'bg-gradient-to-br from-rose-500 via-red-600 to-amber-700 text-white border-amber-300 shadow-rose-500/30';
    }
    if (p.branch === 'modern') {
      return 'bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-800 text-white border-sky-300 shadow-sky-500/30';
    }
    if (p.role === 'emperor') {
      return 'bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 text-slate-950 border-yellow-100 shadow-amber-500/30';
    }
    return 'bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-slate-100 border-amber-400/60 shadow-slate-900/40';
  };

  const getChildCardStyle = (role: RoleBadge) => {
    switch (role) {
      case 'heir':
      case 'emperor':
      case 'empress_regnant':
        return 'bg-gradient-to-br from-emerald-600 to-green-800 text-white border-2 border-amber-300 shadow-emerald-500/30';
      case 'spanish_king':
        return 'bg-gradient-to-br from-rose-600 to-red-800 text-white border-2 border-amber-300 shadow-rose-500/30';
      case 'branch_heir':
        return 'bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 font-semibold border-2 border-yellow-200 shadow-amber-500/30';
      case 'notable_royalty':
        return 'bg-gradient-to-br from-orange-600 to-amber-800 text-white border border-orange-400/50';
      case 'tragic':
        return 'bg-gradient-to-br from-red-700 to-rose-900 text-rose-100 border border-rose-400/50';
      default:
        return 'bg-gradient-to-br from-blue-600 to-indigo-800 text-white border border-blue-400/30';
    }
  };

  const filterPerson = (p: HabsburgPerson) => {
    if (roleFilter === 'rulers') {
      return (
        p.role === 'emperor' ||
        p.role === 'empress_regnant' ||
        p.role === 'spanish_king' ||
        p.role === 'head_of_house'
      );
    }
    if (roleFilter === 'consanguinity') {
      return (
        (p.inbreedingCoefficient !== undefined && p.inbreedingCoefficient >= 0.03) ||
        p.spouses.some((s) => s.isConsanguineous)
      );
    }
    if (roleFilter === 'tragic') {
      return (
        p.role === 'tragic' ||
        p.children.some((c) => c.role === 'tragic') ||
        p.id === 'franz_joseph1' ||
        p.id === 'carlos2'
      );
    }
    return true;
  };

  const visibleEras = ERAS.filter(
    (era) => selectedEra === 'all' || era.id === selectedEra
  );

  return (
    <div className="space-y-6">
      {/* View Mode Switcher: 2D Visual Family Tree vs Detailed Era Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0c1324] border border-amber-500/35 rounded-2xl p-3.5 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30">
            가계도 보기 방식
          </span>
          <span className="text-xs text-slate-300">
            {viewMode === 'visual_tree'
              ? '1~24세대 분파·방계 승계·근친혼 연결선을 한눈에 조망하는 2D 트리 다이어그램입니다.'
              : '시대별 군주의 배우자·전체 자녀(+N명 펼치기)와 방계 박스를 자세히 읽는 카드 뷰입니다.'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setViewMode('visual_tree')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border ${
              viewMode === 'visual_tree'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 border-yellow-200 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Network className="w-4 h-4" />
            🌳 2D 시각 가계도 트리
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border ${
              viewMode === 'cards'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 border-yellow-200 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            🗂️ 시대별 상세 가족 카드
          </button>
        </div>
      </div>

      {viewMode === 'visual_tree' ? (
        <VisualFamilyTree onSelectPerson={onSelectPerson} />
      ) : (
        <>
      {/* Top Legend & Filter Bar */}
      <div className="bg-[#0e1526]/90 border border-amber-500/25 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-amber-300 flex items-center gap-2">
              <span>🏰 루돌프 1세(1273) ~ 현대 수장(현재) 750년 통합 계보</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              인물 카드나 자녀 카드를 클릭하면 생애·업적·혼맥·근친교배 계수(F) 상세 아카이브가 열립니다.
            </p>
          </div>

          {/* Role / Theme Filter */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: '전체 인물 보기' },
              { id: 'rulers', label: '👑 역대 황제·국왕·수장' },
              { id: 'consanguinity', label: '🧬 근친혼·겹사돈 집중' },
              { id: 'tragic', label: '🩸 비극적 가족사 집중' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setRoleFilter(f.id as typeof roleFilter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                  roleFilter === f.id
                    ? 'bg-amber-500/25 text-amber-200 border-amber-400'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Era Quick Selector */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedEra('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
              selectedEra === 'all'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 border-yellow-200 shadow'
                : 'bg-slate-900/70 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            전체 시대 (1~6기)
          </button>
          {ERAS.map((era) => (
            <button
              key={era.id}
              onClick={() => setSelectedEra(era.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border flex items-center gap-1.5 ${
                selectedEra === era.id
                  ? 'bg-amber-500/20 text-amber-200 border-amber-400 shadow'
                  : 'bg-slate-900/70 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>{era.icon}</span>
              <span>{era.shortTitle}</span>
              <span className="text-[10px] text-slate-400">({era.period})</span>
            </button>
          ))}
        </div>

        {/* Color Legend (preserving original page's legend + expanded badges) */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-gradient-to-br from-amber-300 to-amber-500 inline-block" />
            <span>신성로마·오스트리아 황제</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-gradient-to-br from-rose-500 to-red-700 inline-block" />
            <span>스페인 합스부르크 국왕</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-gradient-to-br from-pink-500 to-rose-700 inline-block" />
            <span>황후 / 배우자</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-gradient-to-br from-emerald-500 to-green-700 border border-amber-300 inline-block" />
            <span>직계 후계자</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-gradient-to-br from-amber-500 to-orange-600 border border-yellow-200 inline-block" />
            <span>방계 승계선</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-gradient-to-br from-red-700 to-rose-900 inline-block" />
            <span>비극(암살·자살·처형·요절)</span>
          </div>
        </div>
      </div>

      {/* Era Sections */}
      {visibleEras.map((era) => {
        const eraPersons = VISIBLE_PERSONS.filter(
          (p) => p.era === era.id && filterPerson(p)
        );
        if (eraPersons.length === 0) return null;

        const mainPersons = eraPersons.filter((p) => p.display !== 'collateral');
        const collateralPersons = eraPersons.filter((p) => p.display === 'collateral');

        return (
          <section key={era.id} className="space-y-5">
            {/* Era Banner */}
            <div
              className={`p-5 rounded-2xl bg-gradient-to-r ${era.bannerGradient} border shadow-lg`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-amber-200">
                  {era.title}
                </h3>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-black/40 text-amber-300 border border-amber-500/30 self-start">
                  {era.period}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">
                {era.description}
              </p>
              <div className="mt-2.5 text-[11px] text-amber-300/90 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>핵심 키워드: {era.historicalContext}</span>
              </div>
            </div>

            {/* Family Units (Main Line) */}
            <div className="space-y-3 pl-2 sm:pl-5 border-l-2 border-amber-500/30">
              {mainPersons.map((person, idx) => {
                const isExpanded = !!expandedChildrenMap[person.id];
                const extraList = person.extraChildrenList || [];
                const displayedChildren = isExpanded
                  ? [...person.children, ...extraList]
                  : person.children;

                return (
                  <React.Fragment key={person.id}>
                    <div
                      id={`person-card-${person.id}`}
                      className="relative bg-[#0d1426]/85 hover:bg-[#111a30] border border-slate-800/90 hover:border-amber-500/40 rounded-2xl p-4 sm:p-5 transition shadow-lg"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4 sm:gap-6">
                        {/* Emperor / Ruler Card */}
                        <div
                          onClick={() => onSelectPerson(person)}
                          className={`cursor-pointer relative rounded-xl p-4 min-w-[230px] sm:min-w-[250px] border-2 shadow-lg transition transform hover:-translate-y-0.5 ${getRulerCardStyle(
                            person
                          )}`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-black/25">
                              {person.generation}세대 ·{' '}
                              {person.role === 'emperor'
                                ? '👑 황제/독일왕'
                                : person.role === 'empress_regnant'
                                ? '👑 여대공·여왕'
                                : person.role === 'spanish_king'
                                ? '⚜️ 스페인 국왕'
                                : '🛡️ 가문 수장'}
                            </span>
                            {person.inbreedingCoefficient !== undefined && (
                              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-rose-950/90 text-rose-200 border border-rose-400/50">
                                F={person.inbreedingCoefficient.toFixed(3)}
                              </span>
                            )}
                          </div>

                          <div className="text-lg font-serif font-extrabold tracking-tight">
                            {person.nameKo}
                          </div>
                          <div className="text-xs opacity-80 font-medium mb-2">
                            {person.nameEn} ({person.lifespan})
                          </div>

                          {person.reign && (
                            <div className="text-xs font-bold px-2.5 py-1 rounded-lg bg-black/20 inline-block mb-1.5">
                              재위/수장: {person.reign}
                            </div>
                          )}

                          {person.epithet && (
                            <div className="text-xs opacity-90 mt-1 bg-black/15 px-2 py-1 rounded">
                              별칭: “{person.epithet}”
                            </div>
                          )}

                          <div className="mt-2.5 pt-2 border-t border-black/15 flex items-center justify-between text-[11px] font-semibold opacity-90">
                            <span>상세 아카이브 열기</span>
                            <Info className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        {/* Spouses & Children Section */}
                        <div className="flex-1 space-y-3">
                          {/* Spouses */}
                          <div className="flex flex-wrap gap-2.5">
                            {person.spouses.map((s) => {
                              const linkedSpouse = getPersonById(s.linkedPersonId);
                              return (
                                <div
                                  key={s.id}
                                  onClick={() => linkedSpouse && onSelectPerson(linkedSpouse)}
                                  className={`rounded-xl px-3.5 py-2.5 border shadow-md ${
                                    linkedSpouse ? 'cursor-pointer hover:brightness-110' : ''
                                  } ${
                                    s.isEmperorConsort
                                      ? 'bg-gradient-to-br from-indigo-600 to-blue-800 border-amber-300 text-white'
                                      : s.nameKo === '미혼'
                                      ? 'bg-slate-800 border-slate-700 text-slate-300'
                                      : 'bg-gradient-to-br from-pink-600 to-rose-800 border-pink-400/50 text-white'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs sm:text-sm font-bold">
                                      💒 {s.nameKo}
                                    </span>
                                    {s.marriageYear && (
                                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-black/25">
                                        결혼 {s.marriageYear}
                                      </span>
                                    )}
                                    {s.isConsanguineous && (
                                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-300 text-slate-950 font-bold flex items-center gap-1">
                                        <Dna className="w-3 h-3" /> {s.relationNote || '근친혼'}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-pink-100/90 mt-0.5">
                                    {s.originHouse}
                                    {s.note ? ` · ${s.note}` : ''}
                                  </div>
                                  {s.territoryGained && (
                                    <div className="text-[11px] text-amber-200 font-semibold mt-1 flex items-center gap-1">
                                      <MapPin className="w-3 h-3 shrink-0" /> 획득 영토: {s.territoryGained}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Children Grid */}
                          {displayedChildren.length > 0 && (
                            <div className="pl-3 sm:pl-4 border-l-2 border-blue-500/50 space-y-2">
                              <div className="flex flex-wrap gap-2">
                                {displayedChildren.map((ch) => {
                                  const linkedChild = getPersonById(ch.linkedPersonId);
                                  return (
                                    <div
                                      key={ch.id}
                                      onClick={() => linkedChild && onSelectPerson(linkedChild)}
                                      className={`rounded-lg px-3 py-2 text-xs transition shadow ${
                                        linkedChild
                                          ? 'cursor-pointer hover:scale-[1.03]'
                                          : ''
                                      } ${getChildCardStyle(ch.role)}`}
                                    >
                                      <div className="font-bold flex items-center gap-1">
                                        <span>{ch.nameKo}</span>
                                        {linkedChild && <span>↓</span>}
                                      </div>
                                      <div className="text-[10px] opacity-85">{ch.lifespan}</div>
                                      {ch.note && (
                                        <div className="text-[10px] italic opacity-95 mt-0.5">
                                          {ch.note}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}

                                {/* Expandable Extra Children Button */}
                                {extraList.length > 0 && (
                                  <button
                                    onClick={(e) => toggleExpandChildren(person.id, e)}
                                    className="rounded-lg px-3 py-2 text-xs font-bold bg-slate-800/90 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 transition"
                                  >
                                    {isExpanded ? (
                                      <>
                                        <ChevronUp className="w-3.5 h-3.5" /> 추가 자녀 접기
                                      </>
                                    ) : (
                                      <>
                                        <ChevronDown className="w-3.5 h-3.5" /> + {extraList.length}명 자녀 펼쳐보기
                                      </>
                                    )}
                                  </button>
                                )}

                                {extraList.length === 0 &&
                                  person.extraChildrenCount &&
                                  person.extraChildrenCount > 0 && (
                                    <div
                                      onClick={() => onSelectPerson(person)}
                                      className="cursor-pointer rounded-lg px-3 py-2 text-xs bg-slate-800/70 hover:bg-slate-800 text-slate-300 border border-slate-700 flex items-center"
                                    >
                                      + 기타 자녀 {person.extraChildrenCount}명
                                    </div>
                                  )}
                              </div>
                            </div>
                          )}

                          {/* Succession Note Badge */}
                          {person.successionNote && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold">
                              <GitBranch className="w-3.5 h-3.5 shrink-0" />
                              <span>{person.successionNote}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Succession Indicator between rulers */}
                    {idx < mainPersons.length - 1 && (
                      <div className="flex items-center gap-2 pl-8 py-0.5 text-amber-400/90 text-xs font-bold">
                        <div className="w-1 h-5 bg-gradient-to-b from-emerald-400 to-amber-400 rounded-full" />
                        <span>⬇ 제위 / 가문 계승</span>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Collateral Box for this Era if collateral persons exist */}
            {collateralPersons.length > 0 && (
              <div className="mt-4 ml-2 sm:ml-6 p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-950/70 via-slate-900/90 to-slate-950 border-2 border-amber-500/60 shadow-xl relative">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500 text-slate-950 font-extrabold text-xs mb-3 shadow">
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>
                    {era.id === 'era5_lorraine'
                      ? '🔀 프란츠 카를 대공 방계 승계 계보 & 주요 황족 (프란츠 요제프 1세 → 카를 1세)'
                      : era.id === 'era4_austria'
                      ? '🔀 내오스트리아 방계 승계 계보 (카를 2세 → 페르디난트 2세)'
                      : '🔀 주요 방계 · 분가 인물 계보'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {collateralPersons.map((cp) => (
                    <div
                      key={cp.id}
                      id={`person-card-${cp.id}`}
                      onClick={() => onSelectPerson(cp)}
                      className="cursor-pointer p-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-amber-500/30 hover:border-amber-400 transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-sm font-bold text-amber-300">
                            {cp.nameKo}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {cp.lifespan}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mb-1.5">
                          {cp.titles[0]}
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {cp.summary}
                        </p>
                      </div>
                      {cp.successionNote && (
                        <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-amber-300 font-medium">
                          ▸ {cp.successionNote}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        );
      })}
        </>
      )}
    </div>
  );
};
