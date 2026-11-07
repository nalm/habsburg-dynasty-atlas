import React from 'react';
import {
  X,
  Crown,
  Heart,
  Users,
  Sparkles,
  AlertTriangle,
  MapPin,
  ArrowRight,
  Compass,
  Dna,
} from 'lucide-react';
import { HabsburgPerson } from '../types/habsburg';
import { getPersonById } from '../data/persons';
import { ERAS } from '../data/eras';

interface PersonDetailDrawerProps {
  person: HabsburgPerson | null;
  onClose: () => void;
  onSelectPerson: (person: HabsburgPerson) => void;
  onTraceFromPerson: (personId: string) => void;
}

export const PersonDetailDrawer: React.FC<PersonDetailDrawerProps> = ({
  person,
  onClose,
  onSelectPerson,
  onTraceFromPerson,
}) => {
  if (!person) return null;

  const father = getPersonById(person.fatherId);
  const mother = getPersonById(person.motherId);
  const predecessor = getPersonById(person.predecessorId);
  const successor = getPersonById(person.successorId);
  const eraMeta = ERAS.find((e) => e.id === person.era);

  const allChildren = [
    ...person.children,
    ...(person.extraChildrenList || []),
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-label="배경 클릭하여 닫기"
      />
      <aside className="relative z-10 w-full max-w-2xl bg-[#0c1222] border-l border-amber-500/30 h-full overflow-y-auto shadow-2xl p-5 sm:p-7 text-slate-100">
        {/* Top Bar */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              {eraMeta && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium">
                  {eraMeta.icon} {eraMeta.shortTitle}
                </span>
              )}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                루돌프 1세 기준 {person.generation}세대
              </span>
              {person.epithet && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30">
                  “{person.epithet}”
                </span>
              )}
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-300 flex items-center gap-2 flex-wrap">
              <span>{person.nameKo}</span>
              <span className="text-base sm:text-lg font-sans font-normal text-slate-400">
                {person.nameEn}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              생몰: <strong>{person.lifespan}</strong>
              {person.reign && (
                <>
                  {' '}
                  · 재위/수장: <strong className="text-amber-300">{person.reign}</strong>
                </>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            aria-label="상세 패널 닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Titles & Action */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <div className="flex flex-wrap gap-1.5">
            {person.titles.map((title, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-200 border border-amber-500/25"
              >
                <Crown className="w-3 h-3 text-amber-400" />
                {title}
              </span>
            ))}
          </div>
          <button
            onClick={() => onTraceFromPerson(person.id)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition shrink-0"
          >
            <Compass className="w-3.5 h-3.5" /> 이 인물로 혈연·승계 경로 추적
          </button>
        </div>

        {/* Inbreeding Coefficient Box if present */}
        {person.inbreedingCoefficient !== undefined && (
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-rose-950/60 via-red-950/40 to-slate-900 border border-rose-500/40">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                <Dna className="w-4 h-4 text-rose-400" /> 근친교배 계수 (Inbreeding Coefficient, F)
              </span>
              <span className="text-sm font-mono font-bold px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-200 border border-rose-500/40">
                F = {person.inbreedingCoefficient.toFixed(3)} (
                {(person.inbreedingCoefficient * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 rounded-full"
                style={{
                  width: `${Math.min(100, (person.inbreedingCoefficient / 0.26) * 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-rose-200/90 leading-relaxed">
              {person.inbreedingNote} (참고: 사촌 결혼 출생 <code>0.0625</code> · 친남매/부모-자식 간 출생{' '}
              <code>0.250</code>)
            </p>
          </div>
        )}

        {/* Summary */}
        <div className="mt-5">
          <h3 className="text-sm font-bold text-amber-300 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> 생애 및 역사적 의의
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800/90">
            {person.summary}
          </p>
        </div>

        {/* Parents & Succession Links */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="text-xs text-slate-400 mb-2 font-semibold">부모 (혈연 상위)</div>
            <div className="space-y-1.5">
              {father ? (
                <button
                  onClick={() => onSelectPerson(father)}
                  className="w-full text-left text-xs px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-amber-500/20 text-amber-200 flex items-center justify-between transition"
                >
                  <span>👨 부: {father.nameKo}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              ) : (
                <div className="text-xs text-slate-500">부친 기록 (시조 또는 외부 가문)</div>
              )}
              {mother ? (
                <button
                  onClick={() => onSelectPerson(mother)}
                  className="w-full text-left text-xs px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-rose-500/20 text-rose-200 flex items-center justify-between transition"
                >
                  <span>👩 모: {mother.nameKo}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
                </button>
              ) : person.motherName ? (
                <div className="text-xs text-slate-300 px-2.5 py-1">👩 모: {person.motherName}</div>
              ) : null}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="text-xs text-slate-400 mb-2 font-semibold">제위 / 가문 수장 승계</div>
            <div className="space-y-1.5">
              {predecessor && (
                <button
                  onClick={() => onSelectPerson(predecessor)}
                  className="w-full text-left text-xs px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-amber-500/20 text-slate-200 flex items-center justify-between transition"
                >
                  <span>⬅ 전임: {predecessor.nameKo}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              )}
              {successor && (
                <button
                  onClick={() => onSelectPerson(successor)}
                  className="w-full text-left text-xs px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-emerald-500/20 text-emerald-300 flex items-center justify-between transition"
                >
                  <span>➡ 후임: {successor.nameKo}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              )}
              {person.successionNote && (
                <p className="text-[11px] text-amber-300/90 mt-1 leading-snug">
                  ※ {person.successionNote}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Spouses */}
        <div className="mt-5">
          <h3 className="text-sm font-bold text-pink-300 mb-2.5 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-pink-400" /> 배우자 및 혼맥 ({person.spouses.length})
          </h3>
          {person.spouses.length === 0 ? (
            <p className="text-xs text-slate-400 italic">미혼</p>
          ) : (
            <div className="space-y-2.5">
              {person.spouses.map((s) => {
                const linkedSpouse = getPersonById(s.linkedPersonId);
                return (
                  <div
                    key={s.id}
                    className="p-3.5 rounded-xl bg-gradient-to-r from-pink-950/40 via-slate-900/80 to-slate-900 border border-pink-500/30"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <span className="text-sm font-bold text-pink-200">{s.nameKo}</span>
                        <span className="text-xs text-slate-400 ml-1.5">({s.nameEn})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {s.marriageYear && (
                          <span className="text-[11px] px-2 py-0.5 rounded bg-pink-500/20 text-pink-200">
                            결혼 {s.marriageYear}
                          </span>
                        )}
                        {s.isConsanguineous && (
                          <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500/25 text-rose-200 border border-rose-500/40 font-semibold">
                            🧬 근친혼: {s.relationNote}
                          </span>
                        )}
                        {linkedSpouse && (
                          <button
                            onClick={() => onSelectPerson(linkedSpouse)}
                            className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40"
                          >
                            인물 보기 →
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-slate-300 mt-1">
                      출신 가문: <span className="text-slate-200 font-medium">{s.originHouse}</span>
                      {s.lifespan ? ` · ${s.lifespan}` : ''}
                    </div>
                    {s.territoryGained && (
                      <div className="mt-1.5 text-xs text-amber-300 flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 shrink-0" /> 혼인으로 획득한 영토/권리:{' '}
                        {s.territoryGained}
                      </div>
                    )}
                    {s.note && <p className="text-xs text-slate-400 mt-1">{s.note}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Children */}
        <div className="mt-5">
          <h3 className="text-sm font-bold text-sky-300 mb-2.5 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-sky-400" /> 주요 자녀 ({allChildren.length}명 수록
            {person.extraChildrenCount ? ` + 기타 ${person.extraChildrenCount}명` : ''})
          </h3>
          {allChildren.length === 0 ? (
            <p className="text-xs text-slate-400 italic">자녀 없음</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allChildren.map((ch) => {
                const linked = getPersonById(ch.linkedPersonId);
                return (
                  <div
                    key={ch.id}
                    onClick={() => linked && onSelectPerson(linked)}
                    className={`p-2.5 rounded-lg border text-xs transition ${
                      linked
                        ? 'cursor-pointer bg-slate-900/90 hover:bg-slate-800 border-amber-500/40'
                        : 'bg-slate-900/50 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-slate-100">{ch.nameKo}</span>
                      <span className="text-[11px] text-slate-400">{ch.lifespan}</span>
                    </div>
                    {ch.note && <p className="text-[11px] text-slate-300 mt-0.5">{ch.note}</p>}
                    {linked && (
                      <span className="inline-block mt-1 text-[10px] text-amber-300 font-semibold">
                        클릭하여 상세 보기 →
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Achievements & Tragedies */}
        {person.achievements.length > 0 && (
          <div className="mt-5">
            <h3 className="text-sm font-bold text-emerald-300 mb-2 flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-emerald-400" /> 주요 업적 및 사건
            </h3>
            <ul className="space-y-1.5 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-200">
              {person.achievements.map((ach, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">▸</span>
                  <span>{ach}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {person.tragediesOrTrivia && person.tragediesOrTrivia.length > 0 && (
          <div className="mt-5 mb-4">
            <h3 className="text-sm font-bold text-amber-300 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> 비화 · 비극 · 역사 노트
            </h3>
            <ul className="space-y-1.5 bg-amber-950/20 p-3.5 rounded-xl border border-amber-500/25 text-xs sm:text-sm text-amber-100/90">
              {person.tragediesOrTrivia.map((tr, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  <span>{tr}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
};
