import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Crown, Compass, Dna, ScrollText, Search, X, Sparkles } from 'lucide-react';
import { PERSONS } from '../data/persons';
import { HabsburgPerson } from '../types/habsburg';

export type ActiveTab = 'tree' | 'pathfinder' | 'inbreeding' | 'timeline';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onSelectPerson: (person: HabsburgPerson) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onSelectPerson,
}) => {
  const [query, setQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PERSONS.filter(
      (p) =>
        p.nameKo.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        (p.epithet && p.epithet.toLowerCase().includes(q)) ||
        p.titles.some((t) => t.toLowerCase().includes(q)) ||
        p.summary.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  const tabs: { id: ActiveTab; label: string; sub: string; icon: React.ReactNode }[] = [
    {
      id: 'tree',
      label: '황실 가계도 아카이브',
      sub: '1273–현재 · 6대 시대 & 방계 계보',
      icon: <Crown className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'pathfinder',
      label: '혈연·승계 경로 추적기',
      sub: '촌수·계승선 탐색 & 시뮬레이션',
      icon: <Compass className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'inbreeding',
      label: '근친혼 & 유전 분석실',
      sub: '겹사돈 루프 & F-계수(0.254)',
      icon: <Dna className="w-4 h-4 text-rose-400" />,
    },
    {
      id: 'timeline',
      label: '제국 연대기 & 영토 변천',
      sub: '정략결혼·전쟁·제국 해체사',
      icon: <ScrollText className="w-4 h-4 text-purple-400" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#090d16]/90 border-b border-amber-500/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 pb-2">
        {/* Top Row: Brand & Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-700 p-[1.5px] shadow-lg shadow-amber-500/20 shrink-0">
              <div className="w-full h-full bg-[#0d1220] rounded-[10px] flex items-center justify-center text-2xl">
                🦅
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href="http://www.nalm.info/projects/"
                  className="text-xs font-medium text-amber-400/80 hover:text-amber-300 transition-colors"
                >
                  nalm.info/projects
                </a>
                <span className="text-slate-600 text-xs">/</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  <Sparkles className="w-3 h-3" /> 1273–현재 (750년 전 시대)
                </span>
              </div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent">
                합스부르크 왕조 750년 가계도 아카이브
              </h1>
            </div>
          </div>

          {/* Global Person Search */}
          <div ref={searchRef} className="relative w-full md:w-80">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={query}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                placeholder="인물·칭호·사건 검색 (예: 카를 5세, 시시, 마리아 테레지아)..."
                className="w-full pl-9 pr-8 py-2 rounded-lg bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/70 focus:ring-1 focus:ring-amber-400/40 transition"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-200"
                  aria-label="검색어 지우기"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {isSearchOpen && query.trim() !== '' && (
              <div className="absolute left-0 right-0 mt-1.5 bg-[#0f1628] border border-amber-500/30 rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    검색 결과가 없습니다.
                  </div>
                ) : (
                  searchResults.map((person) => (
                    <button
                      key={person.id}
                      onClick={() => {
                        onSelectPerson(person);
                        setIsSearchOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-amber-500/10 border-b border-slate-800/70 last:border-none flex items-center justify-between gap-2 transition"
                    >
                      <div>
                        <div className="text-sm font-semibold text-amber-200 flex items-center gap-1.5">
                          <span>{person.nameKo}</span>
                          <span className="text-xs font-normal text-slate-400">
                            ({person.lifespan})
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 line-clamp-1">
                          {person.titles[0]} {person.reign ? `· 재위 ${person.reign}` : ''}
                        </div>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-amber-300 shrink-0">
                        {person.generation}세대
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row: Navigation Tabs */}
        <nav className="grid grid-cols-2 lg:grid-cols-4 gap-2 pt-2.5" aria-label="주요 탐색 뷰">
          {tabs.map((t) => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTab(t.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-left transition-all border ${
                  active
                    ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border-amber-400/70 text-amber-200 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    active ? 'bg-amber-500/20' : 'bg-slate-800/80'
                  }`}
                >
                  {t.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold truncate">{t.label}</div>
                  <div className="text-[11px] text-slate-400 truncate hidden sm:block">
                    {t.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
