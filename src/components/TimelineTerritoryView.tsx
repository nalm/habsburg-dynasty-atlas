import React, { useState } from 'react';
import {
  ScrollText,
  MapPin,
  Heart,
  Swords,
  Crown,
  AlertTriangle,
  Scale,
} from 'lucide-react';
import { HISTORICAL_EVENTS } from '../data/events';
import { getPersonById } from '../data/persons';
import { HabsburgPerson, HistoricalEvent } from '../types/habsburg';

interface TimelineTerritoryViewProps {
  onSelectPerson: (person: HabsburgPerson) => void;
}

const TERRITORY_PILLARS = [
  {
    year: '1278–1363',
    region: '오스트리아 · 슈타이어마르크 · 티롤',
    method: '전쟁(마르히펠트) & 상속 계약',
    monarch: '루돌프 1세 ~ 루돌프 4세',
    personId: 'rudolf1',
    desc: '스위스 아르가우 백작에서 출발해 도나우강 중류와 알프스 회랑을 가문의 핵심 세습 영지로 확립했습니다.',
  },
  {
    year: '1477',
    region: '부르고뉴 네덜란드 (벨기에·네덜란드·룩셈부르크)',
    method: '정략결혼 (막시밀리안 1세 × 부르고뉴의 마리)',
    monarch: '막시밀리안 1세',
    personId: 'maximilian1',
    desc: '유럽에서 가장 부유한 상공업 지역인 저지대를 혼인으로 확보하며 서유럽 강대국으로 도약했습니다.',
  },
  {
    year: '1496–1516',
    region: '스페인 왕국 · 남이탈리아 · 아메리카 신대륙',
    method: '정략결혼 (미남왕 필리프 1세 × 카스티야의 후아나)',
    monarch: '필리프 1세 & 카를 5세',
    personId: 'karl5',
    desc: '스페인 직계 후계자들의 잇단 사망으로 카를 5세가 이베리아와 아메리카 대륙 전체를 물려받았습니다.',
  },
  {
    year: '1515–1526',
    region: '보헤미아 왕국 · 헝가리 왕국 · 크로아티아',
    method: '빈 이중결혼 (페르디난트 1세 × 야기에우오의 안나)',
    monarch: '페르디난트 1세',
    personId: 'ferdinand1',
    desc: '1526년 모하치 전투 이후 보헤미아·헝가리 왕위를 결합하여 1918년까지 이어진 도나우 다민족 제국을 완성했습니다.',
  },
  {
    year: '1699–1714',
    region: '헝가리 전역 탈환 & 남네덜란드·밀라노·나폴리',
    method: '카를로비츠 조약(1699) & 라슈타트 조약(1714)',
    monarch: '레오폴트 1세 & 카를 6세',
    personId: 'leopold1',
    desc: '스페인 본토는 부르봉에 내주었으나 오스만으로부터 헝가리 전역을 해방하고 이탈리아·벨기에를 확보했습니다.',
  },
  {
    year: '1804–1918',
    region: '오스트리아 제국 → 오스트리아-헝가리 이중제국 해체',
    method: '신성로마 해체(1806) · 대타협(1867) · 1차대전 패전(1918)',
    monarch: '프란츠 2세/1세 ~ 카를 1세',
    personId: 'franz_joseph1',
    desc: '민족주의 물결 속에서 이중제국으로 타협했으나 사라예보 암살과 제1차 세계대전 패전으로 제국이 해체되었습니다.',
  },
];

export const TimelineTerritoryView: React.FC<TimelineTerritoryViewProps> = ({
  onSelectPerson,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<
    HistoricalEvent['category'] | 'all'
  >('all');

  const filteredEvents = HISTORICAL_EVENTS.filter(
    (e) => categoryFilter === 'all' || e.category === categoryFilter
  );

  const getCategoryBadge = (cat: HistoricalEvent['category']) => {
    switch (cat) {
      case 'marriage':
        return {
          label: '💒 정략결혼·혼맥',
          cls: 'bg-pink-500/20 text-pink-200 border-pink-500/40',
          icon: <Heart className="w-3.5 h-3.5 text-pink-400" />,
        };
      case 'war':
        return {
          label: '⚔️ 주요 전쟁',
          cls: 'bg-orange-500/20 text-orange-200 border-orange-500/40',
          icon: <Swords className="w-3.5 h-3.5 text-orange-400" />,
        };
      case 'treaty':
        return {
          label: '📜 조약·법령',
          cls: 'bg-sky-500/20 text-sky-200 border-sky-500/40',
          icon: <Scale className="w-3.5 h-3.5 text-sky-400" />,
        };
      case 'succession':
        return {
          label: '👑 왕위·방계 승계',
          cls: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
          icon: <Crown className="w-3.5 h-3.5 text-emerald-400" />,
        };
      case 'tragedy':
        return {
          label: '🩸 비극·왕조 단절',
          cls: 'bg-rose-500/20 text-rose-200 border-rose-500/40',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />,
        };
      default:
        return {
          label: '🦅 제국 변곡점',
          cls: 'bg-amber-500/20 text-amber-200 border-amber-500/40',
          icon: <ScrollText className="w-3.5 h-3.5 text-amber-400" />,
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Territorial Expansion & Marriage Pillars */}
      <div className="bg-[#0e1526]/90 border border-amber-500/30 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="mb-4">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Bella gerant alii, tu felix Austria nube
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-amber-200 mt-0.5">
            “전쟁은 다른 이들이 하게 두고, 행복한 오스트리아여 결혼하라!” — 6대 영토 변천 판도
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            합스부르크 제국이 어떻게 결혼과 조약으로 유럽과 신대륙을 묶었는지 보여주는 핵심 영토 이정표입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {TERRITORY_PILLARS.map((item, idx) => {
            const p = getPersonById(item.personId);
            return (
              <div
                key={idx}
                onClick={() => p && onSelectPerson(p)}
                className="cursor-pointer p-4 rounded-xl bg-slate-900/85 hover:bg-slate-800/85 border border-slate-800 hover:border-amber-500/50 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {item.year}
                    </span>
                    <span className="text-[11px] text-slate-400">{item.monarch}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5 mb-1">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{item.region}</span>
                  </h3>
                  <div className="text-xs text-pink-300 font-medium mb-2">
                    {item.method}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-amber-300 font-semibold">
                  주역 군주 상세 보기 →
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Chronological Events Timeline */}
      <div className="bg-[#0d1323]/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-800">
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-amber-300 flex items-center gap-2">
              <ScrollText className="w-5 h-5 text-purple-400" />
              <span>750년 합스부르크 핵심 역사 사건 · 영토 타임라인 (1273–1989)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              사건별 관련 인물 배지를 클릭하면 해당 인물의 상세 아카이브로 바로 연결됩니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: '전체 사건' },
              { id: 'marriage', label: '💒 정략결혼' },
              { id: 'war', label: '⚔️ 전쟁' },
              { id: 'treaty', label: '📜 조약' },
              { id: 'succession', label: '👑 승계' },
              { id: 'tragedy', label: '🩸 비극·단절' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setCategoryFilter(tab.id as typeof categoryFilter)
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                  categoryFilter === tab.id
                    ? 'bg-amber-500/25 text-amber-200 border-amber-400'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative pl-4 sm:pl-6 border-l-2 border-amber-500/40 space-y-5">
          {filteredEvents.map((evt) => {
            const badge = getCategoryBadge(evt.category);
            return (
              <div
                key={evt.id}
                className="relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-xl p-4 sm:p-5 transition shadow"
              >
                {/* Dot on timeline */}
                <div className="absolute -left-[23px] sm:-left-[31px] top-6 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-[#090d16]" />

                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs sm:text-sm font-mono font-bold text-amber-300">
                    {evt.dateLabel}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badge.cls}`}
                  >
                    {badge.icon}
                    {badge.label}
                  </span>
                </div>

                <h4 className="font-serif text-base sm:text-lg font-bold text-white mb-1.5">
                  {evt.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-2">
                  {evt.summary}
                </p>
                <div className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 mb-2.5">
                  <strong className="text-amber-300">역사적 파장:</strong> {evt.impact}
                </div>

                {evt.territoryChange && (
                  <div className="text-xs font-semibold text-emerald-300 mb-2.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>영토/판도 변화: {evt.territoryChange}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 mr-1">관련 인물:</span>
                  {evt.relatedPersonIds.map((pid) => {
                    const p = getPersonById(pid);
                    if (!p) return null;
                    return (
                      <button
                        key={pid}
                        onClick={() => onSelectPerson(p)}
                        className="text-xs px-2.5 py-1 rounded-md bg-slate-800 hover:bg-amber-500/20 text-amber-200 border border-slate-700 hover:border-amber-400/50 transition"
                      >
                        👑 {p.nameKo}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
