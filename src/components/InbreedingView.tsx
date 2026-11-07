import React, { useState } from 'react';
import { Dna, AlertTriangle, Heart, Users, Info } from 'lucide-react';
import { CONSANGUINITY_LOOPS } from '../data/events';
import { getPersonById } from '../data/persons';
import { HabsburgPerson } from '../types/habsburg';

interface InbreedingViewProps {
  onSelectPerson: (person: HabsburgPerson) => void;
}

const F_CHART_DATA = [
  { id: 'philip1', name: '필리프 1세 (1478)', branch: '통합', f: 0.025, note: '6촌 수준 · 초기 기점' },
  { id: 'karl5', name: '카를 5세 (1500)', branch: '통합', f: 0.037, note: '합스부르크 턱 발현 시작' },
  { id: 'ferdinand3', name: '레오폴트 1세 (1640)', branch: '오스트리아', f: 0.105, note: '고종사촌 부모 출생' },
  { id: 'philip4', name: '펠리페 4세 (1605)', branch: '스페인', f: 0.115, note: '겹사촌 부모 출생' },
  { id: 'philip2', name: '펠리페 2세 (1527)', branch: '스페인', f: 0.123, note: '고종사촌 부모 누적' },
  { id: 'don_carlos', name: '돈 카를로스 (1545)', branch: '스페인', f: 0.211, note: '이중 4촌 부모 (증조부 4명)' },
  { id: 'philip3', name: '펠리페 3세 (1578)', branch: '스페인', f: 0.218, note: '외삼촌 × 친조카 출생' },
  { id: 'margarita_teresa', name: '마르가리타 테레사 (1651)', branch: '스페인/오스트리아', f: 0.254, note: '외삼촌 × 친조카 누적 (21세 사망)' },
  { id: 'carlos2', name: '카를로스 2세 (1661)', branch: '스페인', f: 0.254, note: '친남매 출생(0.250) 초과 · 불임 단절' },
];

export const InbreedingView: React.FC<InbreedingViewProps> = ({
  onSelectPerson,
}) => {
  const [selectedLoopId, setSelectedLoopId] = useState<string>(
    CONSANGUINITY_LOOPS[7].id
  );

  const activeLoop =
    CONSANGUINITY_LOOPS.find((l) => l.id === selectedLoopId) ||
    CONSANGUINITY_LOOPS[0];

  const handlePersonClick = (id?: string) => {
    const p = getPersonById(id);
    if (p) onSelectPerson(p);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950/70 via-[#0e1526] to-[#0e1526] border border-rose-500/40 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 mb-2">
              <Dna className="w-3.5 h-3.5" /> 유전학·계보학 케이스 스터디 (Alvarez et al., 2009 PLOS ONE)
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-amber-200">
              닫힌 고리 가계도(Pedigree Collapse)와 스페인 합스부르크의 생물학적 단절
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
              1556년 제국 분할 이후 스페인 합스부르크와 오스트리아 합스부르크는 영토가 타 가문으로 유출되는 것을 막기 위해{' '}
              <strong className="text-rose-300">11번의 주요 결혼 중 9번을 근친혼(외삼촌-친조카, 이중 사촌)</strong>으로 치렀습니다. 그 결과 가계도는 가지가 뻗어나가는 나무(Tree)가 아니라 안으로 닫히는 고리(Loop)가 되었습니다.
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: F-Coefficient Chart & Pedigree Collapse Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* F-Coefficient Bar Chart */}
        <div className="lg:col-span-7 bg-[#0d1323]/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <h3 className="text-sm sm:text-base font-bold text-amber-300 flex items-center gap-2">
              <Dna className="w-4 h-4 text-rose-400" />
              <span>세대별 근친교배 계수 (Inbreeding Coefficient, F) 비교</span>
            </h3>
            <span className="text-[11px] text-slate-400">
              막대 클릭 시 해당 인물 상세 보기
            </span>
          </div>

          {/* Reference Benchmarks */}
          <div className="flex flex-wrap gap-2 mb-4 text-[11px]">
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
              일반 사촌(4촌) 출생: <strong className="text-amber-300">F = 0.0625</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
              삼촌-조카 / 이복남매: <strong className="text-orange-300">F = 0.125</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-rose-950/80 text-rose-200 border border-rose-500/40">
              친남매 / 부모-자식 출생: <strong className="text-rose-300">F = 0.250</strong>
            </span>
          </div>

          <div className="space-y-3">
            {F_CHART_DATA.map((item) => {
              const pct = Math.min(100, (item.f / 0.27) * 100);
              const isHigh = item.f >= 0.2;
              return (
                <div
                  key={item.id}
                  onClick={() => handlePersonClick(item.id)}
                  className="cursor-pointer group p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800/90 hover:border-amber-500/40 transition"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="font-bold text-slate-100 group-hover:text-amber-300 flex items-center gap-2">
                      <span>{item.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-normal">
                        {item.note}
                      </span>
                    </div>
                    <span
                      className={`font-mono font-bold ${
                        isHigh ? 'text-rose-400' : 'text-amber-300'
                      }`}
                    >
                      F = {item.f.toFixed(3)} ({(item.f * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden">
                    {/* Threshold marker at 0.250 */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-rose-400/80 z-10"
                      style={{ left: `${(0.25 / 0.27) * 100}%` }}
                      title="친남매 기준선 (0.250)"
                    />
                    <div
                      className={`h-full rounded-full transition-all ${
                        isHigh
                          ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600'
                          : 'bg-gradient-to-r from-emerald-500 to-amber-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pedigree Collapse Visual Simulator */}
        <div className="lg:col-span-5 bg-[#0d1323]/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-amber-300 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>조상 압축 현상 (Pedigree Collapse)</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              일반적인 사람은 부모(2명) + 조부모(4명) + 증조부모(8명) + 고조부모(16명)까지 4세대 동안{' '}
              <strong className="text-emerald-300">총 30명의 서로 다른 조상</strong>을 갖습니다. 그러나 카를로스 2세는 한 인물이 이모할머니이자 고모할머니이자 외증조할머니를 겸하면서 고유 조상이 극단적으로 줄어들었습니다.
            </p>

            {/* Visual Comparison Boxes */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/30">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-300 mb-2">
                  <span>일반 가계도 (4세대 조상 자리 30개)</span>
                  <span>고유 인물 30명 (100%)</span>
                </div>
                <div className="grid grid-cols-10 gap-1.5">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-4 rounded bg-emerald-500/40 border border-emerald-400/50"
                      title={`고유 조상 #${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40">
                <div className="flex items-center justify-between text-xs font-bold text-rose-300 mb-2">
                  <span>카를로스 2세의 고조부모 세대 (16자리 중)</span>
                  <span>고유 인물 단 6~10명!</span>
                </div>
                <div className="grid grid-cols-10 gap-1.5">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-4 rounded border ${
                        i < 10
                          ? 'bg-rose-500/70 border-rose-300'
                          : 'bg-slate-900/40 border-slate-800 opacity-35'
                      }`}
                      title={
                        i < 10
                          ? `실제 고유 조상 #${i + 1}`
                          : '중복 조상으로 채워진 자리'
                      }
                    />
                  ))}
                </div>
                <p className="text-[11px] text-rose-200/90 mt-2 leading-snug">
                  ※ 광녀 후아나(카를 5세의 어머니)는 카를로스 2세의 가계도에서 무려 <strong>14번</strong>이나 서로 다른 경로의 조상으로 중복 등장합니다.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-100/90 space-y-1.5">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> 왜 오스트리아 본가는 살아남았는가?
            </div>
            <p className="leading-relaxed">
              스페인 분파의 마르가리타 테레사와 결혼했던 <strong>레오폴트 1세</strong>는 첫 부인과 두 번째 부인(사촌)이 잇달아 젊어서 사망하자, 세 번째 부인으로 유전적으로 먼 <strong>팔츠-노이부르크의 엘레오노레 막달레나</strong>를 맞이했습니다. 이 결혼에서 건강한 두 아들(요제프 1세·카를 6세)이 태어나며 오스트리아 합스부르크는 유전적 위기를 탈출했습니다.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Interactive 9 Consanguineous Marriages Loop Explorer */}
      <div className="bg-[#0d1323]/90 border border-amber-500/30 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
        <div>
          <h3 className="font-serif text-lg font-bold text-amber-300 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-400" />
            <span>스페인 ↔ 오스트리아 9대 근친 정략결혼 루프 탐색기</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            아래 결혼 카드를 선택하면 부부의 촌수 관계와 자녀의 근친교배 계수(F) 변화를 상세히 확인할 수 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CONSANGUINITY_LOOPS.map((loop, idx) => {
            const active = loop.id === activeLoop.id;
            return (
              <button
                key={loop.id}
                onClick={() => setSelectedLoopId(loop.id)}
                className={`text-left p-3.5 rounded-xl border transition ${
                  active
                    ? 'bg-gradient-to-br from-rose-900/60 via-slate-900 to-slate-900 border-rose-400 shadow-lg'
                    : 'bg-slate-900/70 hover:bg-slate-800/70 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-black/40 text-amber-300">
                    #{idx + 1} · {loop.year}년 결혼
                  </span>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    자녀 F={loop.offspringF.toFixed(3)}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-white mt-1">
                  {loop.groomName} × {loop.brideName}
                </div>
                <div className="text-[11px] text-pink-300 font-semibold mt-0.5">
                  관계: {loop.relation}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 truncate">
                  출생: {loop.offspringName}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Loop Detail Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 border border-rose-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-500 text-white">
                {activeLoop.year}년 근친 혼인
              </span>
              <span className="text-sm font-bold text-amber-300">
                {activeLoop.relation}
              </span>
            </div>
            <h4 className="font-serif text-lg sm:text-xl font-bold text-white">
              🤵 {activeLoop.groomName} &nbsp;💒&nbsp; 👰 {activeLoop.brideName}
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {activeLoop.description}
            </p>
            <div className="text-xs text-rose-300 font-semibold">
              ▸ 주요 자녀: <strong>{activeLoop.offspringName}</strong> (근친교배 계수{' '}
              <code>F = {activeLoop.offspringF.toFixed(3)}</code>)
            </div>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            {getPersonById(activeLoop.groomId) && (
              <button
                onClick={() => handlePersonClick(activeLoop.groomId)}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5"
              >
                <Info className="w-3.5 h-3.5" /> 신랑 상세 보기
              </button>
            )}
            {getPersonById(activeLoop.brideId) && (
              <button
                onClick={() => handlePersonClick(activeLoop.brideId)}
                className="px-3 py-1.5 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-200 border border-pink-500/40 text-xs font-semibold flex items-center gap-1.5"
              >
                <Info className="w-3.5 h-3.5" /> 신부 상세 보기
              </button>
            )}
            {activeLoop.offspringId && getPersonById(activeLoop.offspringId) && (
              <button
                onClick={() => handlePersonClick(activeLoop.offspringId)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5"
              >
                <Info className="w-3.5 h-3.5" /> 자녀 상세 보기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
