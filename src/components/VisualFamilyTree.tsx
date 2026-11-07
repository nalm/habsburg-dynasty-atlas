import React, { useState, useMemo, useRef } from 'react';
import {
  Crown,
  GitBranch,
  Heart,
  Dna,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Eye,
  Info,
} from 'lucide-react';
import { PERSON_MAP, PERSONS } from '../data/persons';
import { HabsburgPerson } from '../types/habsburg';

interface VisualFamilyTreeProps {
  onSelectPerson: (person: HabsburgPerson) => void;
}

interface TreeNodeLayout {
  id: string;
  col: number; // 0.0 ~ 4.4 (가로 분파 트랙 위치)
  row: number; // 1 ~ 24 (세대 위치)
  deadEndLabel?: string; // 단절/비극 배지
  branchLabel?: string; // 분파 시작 배지
}

/** 24세대 5트랙 2D 가계도 정밀 좌표 매핑 */
const TREE_LAYOUT: TreeNodeLayout[] = [
  // ── 제1기: 기원과 오스트리아 정착 (1~4세대) ──
  { id: 'rudolf1', row: 1, col: 2.2, branchLabel: '🌱 합스부르크 왕조 시조 (1273)' },
  { id: 'albrecht1', row: 2, col: 2.2 },
  { id: 'friedrich_schone', row: 3, col: 1.0, deadEndLabel: '아들 요절' },
  { id: 'albrecht2_wise', row: 3, col: 2.2 },
  { id: 'rudolf4', row: 4, col: 0.7, deadEndLabel: '✖ 26세 무자녀 요절' },

  // ── 제2기: 노이베르크 분할 (1379) — 알브레히트계 vs 레오폴트계 (4~7세대) ──
  { id: 'albrecht3', row: 4, col: 1.8, branchLabel: '🏛️ 알브레히트계 (본가·1379)' },
  { id: 'leopold3', row: 4, col: 3.3, branchLabel: '🛡️ 레오폴트계 (분가·1379)' },

  { id: 'albrecht4', row: 5, col: 1.4 },
  { id: 'ernst_iron', row: 5, col: 2.9, branchLabel: '내오스트리아 계열' },
  { id: 'friedrich4_tyrol', row: 5, col: 4.1, branchLabel: '티롤 계열', deadEndLabel: '1490 본류에 양위·통합' },

  { id: 'albrecht5', row: 6, col: 1.4, branchLabel: '👑 황제 세습 시작 (1438)' },
  { id: 'friedrich3', row: 6, col: 2.9, branchLabel: '🔄 합스부르크 영지 재통합' },

  { id: 'ladislaus', row: 7, col: 1.4, deadEndLabel: '✖ 1457 알브레히트계 본가 단절 (17세 급사)' },
  { id: 'maximilian1', row: 7, col: 2.9, branchLabel: '💒 부르고뉴 혼맥 (1477)' },

  // ── 제3기: 세계 제국 도약과 2분할 (8~9세대) ──
  { id: 'philip1', row: 8, col: 2.4, branchLabel: '💒 스페인 혼맥 (광녀 후아나·1496)' },
  { id: 'karl5', row: 9, col: 1.2, branchLabel: '🌍 해가 지지 않는 제국 (1519)' },
  { id: 'ferdinand1', row: 9, col: 3.2, branchLabel: '🦅 오스트리아·보헤미아·헝가리 통합 (1526)' },

  // ── 제4기: 스페인 합스부르크(좌) vs 오스트리아 본가(중) vs 내오스트리아 방계(우) (10~14세대) ──
  { id: 'philip2', row: 10, col: 0.7, branchLabel: '⚜️ 스페인 합스부르크 분파 (1556)' },
  { id: 'maria_spain', row: 10, col: 1.8 },
  { id: 'maximilian2', row: 10, col: 2.9 },
  { id: 'karl2_inner', row: 10, col: 4.1, branchLabel: '🔀 내오스트리아 방계' },

  { id: 'don_carlos', row: 11, col: 0.1, deadEndLabel: '✖ 1568 유폐 사망 (F=0.211)' },
  { id: 'philip3', row: 11, col: 0.9 },
  { id: 'anna_austria', row: 11, col: 1.8 },
  { id: 'rudolf2', row: 11, col: 2.6, deadEndLabel: '적자 없음 (미혼)' },
  { id: 'matthias', row: 11, col: 3.4, deadEndLabel: '✖ 1619 오스트리아 본가 단절' },
  { id: 'ferdinand2', row: 11, col: 4.2, branchLabel: '⚡ 1619 방계 황제 계승' },

  { id: 'philip4', row: 12, col: 0.8 },
  { id: 'maria_anna_spain', row: 12, col: 1.9 },
  { id: 'ferdinand3', row: 12, col: 3.1 },

  { id: 'carlos2', row: 13, col: 0.6, deadEndLabel: '✖ 1700 스페인 합스부르크 단절 (F=0.254)' },
  { id: 'margarita_teresa', row: 13, col: 1.6, deadEndLabel: '21세 사망 (F=0.254)' },
  { id: 'mariana_austria', row: 13, col: 2.4 },
  { id: 'leopold1', row: 13, col: 3.3, branchLabel: '3번째 비근친 결혼으로 혈통 회복' },

  { id: 'joseph1', row: 14, col: 2.3, deadEndLabel: '✖ 1711 천연두 사망 (아들 요절)' },
  { id: 'karl6', row: 14, col: 3.3, deadEndLabel: '✖ 1740 합스부르크 순수 남계 단절 (국사조칙)' },

  // ── 제5기: 합스부르크-로트링겐 가문과 방계 승계 (15~21세대) ──
  { id: 'maria_theresa', row: 15, col: 2.3, branchLabel: '🦁 합스부르크-로트링겐 개창 (1740)' },
  { id: 'franz_stephan', row: 15, col: 3.4, branchLabel: '로트링겐 공작 · 황제 (1745)' },

  { id: 'joseph2', row: 16, col: 1.5, deadEndLabel: '✖ 후사 없음' },
  { id: 'leopold2', row: 16, col: 2.7 },
  { id: 'marie_antoinette', row: 16, col: 3.9, deadEndLabel: '✖ 1793 프랑스 혁명 처형' },

  { id: 'franz2', row: 17, col: 2.5, branchLabel: '신성로마 해체(1806) · 초대 오스트리아 황제' },

  { id: 'marie_louise', row: 18, col: 1.0, branchLabel: '나폴레옹 1세 황후' },
  { id: 'ferdinand1_austria', row: 18, col: 2.2, deadEndLabel: '✖ 1848 무자녀 퇴위' },
  { id: 'franz_karl', row: 18, col: 3.5, branchLabel: '🔀 프란츠 카를 방계 중추' },

  { id: 'franz_joseph1', row: 19, col: 1.5, branchLabel: '⚡ 1848 조카 즉위 (68년 재위)' },
  { id: 'maximilian_mexico', row: 19, col: 2.7, deadEndLabel: '✖ 1867 멕시코 황제 총살' },
  { id: 'karl_ludwig', row: 19, col: 3.8, branchLabel: '방계 승계 2세대' },

  { id: 'rudolf_crown', row: 20, col: 1.5, deadEndLabel: '✖ 1889 마이얼링 자살 (직계 단절)' },
  { id: 'franz_ferdinand', row: 20, col: 2.9, deadEndLabel: '✖ 1914 사라예보 암살 (1차대전 발발)' },
  { id: 'otto_franz', row: 20, col: 4.0, branchLabel: '방계 승계 3세대' },

  { id: 'karl1', row: 21, col: 3.4, branchLabel: '⚡ 1916 종손 즉위', deadEndLabel: '⚔️ 1918 제1차 세계대전 패전 · 제국 해체' },

  // ── 제6기: 현대 가문 수장 (22~24세대) ──
  { id: 'otto_habsburg', row: 22, col: 2.8, branchLabel: '🕊️ 마지막 황태자 · 유럽의회 의원' },
  { id: 'karl_habsburg', row: 23, col: 2.8, branchLabel: '현 합스부르크 가문 수장 (2007–)' },
  { id: 'ferdinand_zvonimir', row: 24, col: 2.8, branchLabel: '차기 가문 수장 (1997–)' },
];

interface MarriageConnector {
  fromId: string;
  toId: string;
  label: string;
  isConsanguineous: boolean;
}

const VISUAL_MARRIAGES: MarriageConnector[] = [
  { fromId: 'maximilian2', toId: 'maria_spain', label: '1548 결혼 (친사촌)', isConsanguineous: true },
  { fromId: 'philip2', toId: 'anna_austria', label: '1570 결혼 (외삼촌×친조카)', isConsanguineous: true },
  { fromId: 'ferdinand3', toId: 'maria_anna_spain', label: '1631 결혼 (고종사촌)', isConsanguineous: true },
  { fromId: 'philip4', toId: 'mariana_austria', label: '1649 결혼 (외삼촌×친조카)', isConsanguineous: true },
  { fromId: 'leopold1', toId: 'margarita_teresa', label: '1666 결혼 (외삼촌×친조카)', isConsanguineous: true },
  { fromId: 'maria_theresa', toId: 'franz_stephan', label: '1736 결혼 (합스부르크-로트링겐)', isConsanguineous: false },
];

interface CollateralJump {
  fromId: string;
  toId: string;
  label: string;
}

const COLLATERAL_JUMPS: CollateralJump[] = [
  { fromId: 'albrecht5', toId: 'friedrich3', label: '1440 제위 이동 (레오폴트계)' },
  { fromId: 'ladislaus', toId: 'friedrich3', label: '1457 본가 단절 → 영지 재통합' },
  { fromId: 'karl5', toId: 'ferdinand1', label: '1556 제국 분할·양위' },
  { fromId: 'matthias', toId: 'ferdinand2', label: '1619 내오스트리아 방계 승계' },
  { fromId: 'ferdinand1_austria', toId: 'franz_joseph1', label: '1848 퇴위 → 조카 즉위' },
  { fromId: 'franz_joseph1', toId: 'karl1', label: '1916 방계 종손 승계' },
];

const ERA_BANDS = [
  { startRow: 1, endRow: 3.5, title: '1기 · 기원과 오스트리아 정착 (1273–1379)', color: 'rgba(245, 158, 11, 0.04)' },
  { startRow: 3.5, endRow: 7.5, title: '2기 · 노이베르크 분할 (알브레히트계 vs 레오폴트계)과 재통합 (1379–1493)', color: 'rgba(234, 88, 12, 0.05)' },
  { startRow: 7.5, endRow: 9.5, title: '3기 · 정략결혼의 기적과 해가 지지 않는 세계 제국 (1493–1556)', color: 'rgba(250, 204, 21, 0.06)' },
  { startRow: 9.5, endRow: 14.5, title: '4기 · 스페인 합스부르크(좌) vs 오스트리아 본가(중) vs 내오스트리아 방계(우) (1556–1740)', color: 'rgba(225, 29, 72, 0.05)' },
  { startRow: 14.5, endRow: 21.5, title: '5기 · 합스부르크-로트링겐 가문과 비극의 방계 승계 (1740–1918)', color: 'rgba(147, 51, 234, 0.05)' },
  { startRow: 21.5, endRow: 24.6, title: '6기 · 제국 해체 이후 현대 합스부르크 가문 수장 (1918–현재)', color: 'rgba(14, 165, 233, 0.05)' },
];

const BOOKMARKS = [
  { label: '🌱 1273 시조 루돌프 1세', row: 1, focusId: 'rudolf1' },
  { label: '⚖️ 1379 알브레히트·레오폴트 분기', row: 4, focusId: 'leopold3' },
  { label: '🌍 1556 카를 5세 · 스페인/오스트리아 분파', row: 9, focusId: 'karl5' },
  { label: '🔀 1619 내오스트리아 방계 승계', row: 11, focusId: 'ferdinand2' },
  { label: '🧬 1700 카를로스 2세 스페인 단절', row: 13, focusId: 'carlos2' },
  { label: '🦁 1740 마리아 테레지아 · 로트링겐', row: 15, focusId: 'maria_theresa' },
  { label: '🩸 1889–1916 루돌프·사라예보 → 카를 1세', row: 19, focusId: 'franz_joseph1' },
  { label: '🕊️ 1918–현재 현대 수장', row: 22, focusId: 'otto_habsburg' },
];

export const VisualFamilyTree: React.FC<VisualFamilyTreeProps> = ({
  onSelectPerson,
}) => {
  const [showBloodlines, setShowBloodlines] = useState(true);
  const [showSuccession, setShowSuccession] = useState(true);
  const [showMarriages, setShowMarriages] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [lockedFocusId, setLockedFocusId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeFocusId = hoveredId || lockedFocusId;

  // Layout geometry constants
  const COL_WIDTH = 265;
  const ROW_HEIGHT = 152;
  const NODE_WIDTH = 216;
  const NODE_HEIGHT = 96;
  const PADDING_X = 90;
  const PADDING_Y = 70;

  const CANVAS_WIDTH = PADDING_X * 2 + 4.4 * COL_WIDTH + NODE_WIDTH;
  const CANVAS_HEIGHT = PADDING_Y * 2 + 24 * ROW_HEIGHT;

  const layoutMap = useMemo(() => {
    const map: Record<
      string,
      TreeNodeLayout & { cx: number; cy: number; x: number; y: number }
    > = {};
    for (const item of TREE_LAYOUT) {
      const x = PADDING_X + item.col * COL_WIDTH;
      const y = PADDING_Y + (item.row - 1) * ROW_HEIGHT;
      map[item.id] = {
        ...item,
        x,
        y,
        cx: x + NODE_WIDTH / 2,
        cy: y + NODE_HEIGHT / 2,
      };
    }
    return map;
  }, []);

  // Compute highlighted ancestor & descendant set when a node is focused
  const highlightedIds = useMemo(() => {
    if (!activeFocusId) return null;
    const set = new Set<string>([activeFocusId]);

    // Walk up ancestors
    const upQueue = [activeFocusId];
    while (upQueue.length > 0) {
      const currId = upQueue.shift()!;
      const p = PERSON_MAP[currId];
      if (!p) continue;
      if (p.fatherId && layoutMap[p.fatherId] && !set.has(p.fatherId)) {
        set.add(p.fatherId);
        upQueue.push(p.fatherId);
      }
      if (p.motherId && layoutMap[p.motherId] && !set.has(p.motherId)) {
        set.add(p.motherId);
        upQueue.push(p.motherId);
      }
    }

    // Walk down descendants
    const downQueue = [activeFocusId];
    while (downQueue.length > 0) {
      const currId = downQueue.shift()!;
      for (const p of PERSONS) {
        if (
          (p.fatherId === currId || p.motherId === currId) &&
          layoutMap[p.id] &&
          !set.has(p.id)
        ) {
          set.add(p.id);
          downQueue.push(p.id);
        }
      }
    }

    return set;
  }, [activeFocusId, layoutMap]);

  // Parent -> Child bloodline edges
  const bloodlineEdges = useMemo(() => {
    const edges: {
      id: string;
      parentId: string;
      childId: string;
      isMotherEdge?: boolean;
    }[] = [];

    for (const item of TREE_LAYOUT) {
      const p = PERSON_MAP[item.id];
      if (!p) continue;
      if (p.fatherId && layoutMap[p.fatherId]) {
        edges.push({
          id: `father-${p.fatherId}-${p.id}`,
          parentId: p.fatherId,
          childId: p.id,
        });
      }
      if (p.motherId && layoutMap[p.motherId]) {
        edges.push({
          id: `mother-${p.motherId}-${p.id}`,
          parentId: p.motherId,
          childId: p.id,
          isMotherEdge: true,
        });
      }
    }
    return edges;
  }, [layoutMap]);

  const jumpToBookmark = (row: number, focusId: string) => {
    setLockedFocusId(focusId);
    const yTarget = Math.max(0, (PADDING_Y + (row - 1) * ROW_HEIGHT) * zoom - 120);
    window.scrollTo({
      top: yTarget + 320,
      behavior: 'smooth',
    });
  };

  const getNodeTheme = (p: HabsburgPerson) => {
    if (p.id === 'karl1') {
      return 'from-rose-700 via-red-800 to-slate-900 border-rose-400 text-white';
    }
    if (p.role === 'empress_regnant') {
      return 'from-purple-600 via-fuchsia-700 to-indigo-900 border-amber-300 text-white';
    }
    if (p.branch === 'spanish' && p.role === 'spanish_king') {
      return 'from-rose-600 via-red-700 to-amber-900 border-amber-300 text-white';
    }
    if (p.branch === 'modern') {
      return 'from-sky-600 via-blue-700 to-slate-900 border-sky-300 text-white';
    }
    if (p.role === 'emperor') {
      return 'from-amber-300 via-yellow-400 to-amber-500 border-yellow-100 text-slate-950';
    }
    if (p.role === 'branch_heir' || p.role === 'head_of_house') {
      return 'from-amber-600 via-orange-700 to-slate-900 border-amber-300 text-white';
    }
    if (p.role === 'tragic') {
      return 'from-red-900/90 via-rose-950 to-slate-950 border-rose-500/70 text-rose-100';
    }
    return 'from-slate-800 via-slate-900 to-slate-950 border-slate-600 text-slate-100';
  };

  return (
    <div className="space-y-4">
      {/* Control & Layer Bar */}
      <div className="bg-[#0e1526]/95 border border-amber-500/30 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-amber-300 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-amber-400" />
              <span>750년 합스부르크 2D 시각 가계도 (1~24세대 · 5대 분파 병렬 트리)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              인물에 마우스를 올리면 <strong className="text-amber-300">직계 조상 ↔ 후손 혈통 줄기</strong>가 하이라이트되고, 클릭하면 우측 상세 아카이브가 열립니다.
            </p>
          </div>

          {/* Layer Toggles & Zoom */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowBloodlines(!showBloodlines)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 ${
                showBloodlines
                  ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              부모-자식 혈연선
            </button>

            <button
              onClick={() => setShowSuccession(!showSuccession)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 ${
                showSuccession
                  ? 'bg-amber-500/20 text-amber-200 border-amber-400'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              방계 제위 승계선
            </button>

            <button
              onClick={() => setShowMarriages(!showMarriages)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 ${
                showMarriages
                  ? 'bg-pink-500/20 text-pink-200 border-pink-400'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
            >
              <Heart className="w-3 h-3 text-pink-400" />
              근친 정략결혼선
            </button>

            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg overflow-hidden ml-1">
              <button
                onClick={() => setZoom((z) => Math.max(0.65, +(z - 0.1).toFixed(2)))}
                className="p-1.5 hover:bg-slate-800 text-slate-300"
                title="축소"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 text-xs font-mono text-amber-300">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(1.25, +(z + 0.1).toFixed(2)))}
                className="p-1.5 hover:bg-slate-800 text-slate-300"
                title="확대"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setZoom(1);
                  setLockedFocusId(null);
                }}
                className="p-1.5 hover:bg-slate-800 text-slate-400 border-l border-slate-800"
                title="초기화"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bookmark Quick-Jump Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-amber-400 mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> 핵심 분기점 포커스:
          </span>
          {BOOKMARKS.map((bm) => {
            const active = lockedFocusId === bm.focusId;
            return (
              <button
                key={bm.focusId}
                onClick={() => jumpToBookmark(bm.row, bm.focusId)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition border ${
                  active
                    ? 'bg-amber-400 text-slate-950 border-yellow-200 font-bold'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
              >
                {bm.label}
              </button>
            );
          })}
          {lockedFocusId && (
            <button
              onClick={() => setLockedFocusId(null)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-rose-500/20 text-rose-200 border border-rose-500/40"
            >
              ✕ 하이라이트 고정 해제
            </button>
          )}
        </div>
      </div>

      {/* Column Track Header Guide */}
      <div className="grid grid-cols-5 gap-2 text-center text-[11px] font-bold px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
        <div className="text-rose-300">◀ 좌측 트랙: 스페인 합스부르크 (1556–1700)</div>
        <div className="text-amber-200">알브레히트계 본가 · 교차 혼맥 공주</div>
        <div className="text-amber-400">👑 중앙 본류: 황제 직계 · 로트링겐 · 현대 수장</div>
        <div className="text-orange-300">레오폴트계 · 프란츠 카를 방계</div>
        <div className="text-emerald-300">우측 트랙: 티롤 · 내오스트리아 방계 ▶</div>
      </div>

      {/* 2D Scrollable Family Tree Canvas */}
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto bg-[#070b14] border border-amber-500/30 rounded-2xl shadow-2xl p-2 sm:p-4"
      >
        <div
          style={{
            width: CANVAS_WIDTH * zoom,
            height: CANVAS_HEIGHT * zoom,
          }}
          className="mx-auto relative transition-all"
        >
          <div
            style={{
              width: CANVAS_WIDTH,
              height: CANVAS_HEIGHT,
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
            }}
            className="relative select-none"
          >
            {/* Era Background Horizontal Bands */}
            {ERA_BANDS.map((band, i) => {
              const top = PADDING_Y + (band.startRow - 1) * ROW_HEIGHT - 28;
              const height = (band.endRow - band.startRow) * ROW_HEIGHT;
              return (
                <div
                  key={i}
                  style={{
                    top,
                    height,
                    backgroundColor: band.color,
                  }}
                  className="absolute left-3 right-3 rounded-2xl border border-slate-800/70 pointer-events-none px-4 py-2"
                >
                  <span className="text-xs font-serif font-bold text-amber-300/80 tracking-wide">
                    {band.title}
                  </span>
                </div>
              );
            })}

            {/* Generation Number Labels on Left Margin */}
            {Array.from({ length: 24 }).map((_, idx) => {
              const gen = idx + 1;
              const top = PADDING_Y + idx * ROW_HEIGHT + NODE_HEIGHT / 2 - 12;
              return (
                <div
                  key={gen}
                  style={{ top }}
                  className="absolute left-4 w-14 text-right pr-2 text-[11px] font-mono font-bold text-slate-500 pointer-events-none"
                >
                  {gen}세대
                </div>
              );
            })}

            {/* SVG Layer for All Connectors */}
            <svg
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="absolute inset-0 pointer-events-none z-10"
            >
              <defs>
                <marker
                  id="arrow-gold"
                  viewBox="0 0 10 10"
                  refX="7"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#fbbf24" />
                </marker>
                <marker
                  id="arrow-emerald"
                  viewBox="0 0 10 10"
                  refX="7"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#34d399" />
                </marker>
              </defs>

              {/* 1. Parent -> Child Bloodline Orthogonal Paths */}
              {showBloodlines &&
                bloodlineEdges.map((edge) => {
                  const pNode = layoutMap[edge.parentId];
                  const cNode = layoutMap[edge.childId];
                  if (!pNode || !cNode) return null;

                  const isHighlighted =
                    highlightedIds &&
                    highlightedIds.has(edge.parentId) &&
                    highlightedIds.has(edge.childId);
                  const isDimmed = highlightedIds && !isHighlighted;

                  const x1 = pNode.cx + (edge.isMotherEdge ? 14 : 0);
                  const y1 = pNode.y + NODE_HEIGHT;
                  const x2 = cNode.cx + (edge.isMotherEdge ? 14 : 0);
                  const y2 = cNode.y;
                  const midY = y1 + (y2 - y1) * (edge.isMotherEdge ? 0.62 : 0.48);

                  const d = `M ${x1} ${y1} V ${midY} H ${x2} V ${y2}`;

                  return (
                    <path
                      key={edge.id}
                      d={d}
                      fill="none"
                      stroke={
                        isHighlighted
                          ? '#34d399'
                          : edge.isMotherEdge
                          ? '#f472b6'
                          : '#475569'
                      }
                      strokeWidth={isHighlighted ? 3.5 : edge.isMotherEdge ? 1.8 : 2.2}
                      strokeDasharray={edge.isMotherEdge ? '4 3' : undefined}
                      opacity={isDimmed ? 0.15 : isHighlighted ? 1 : 0.75}
                      markerEnd={isHighlighted ? 'url(#arrow-emerald)' : undefined}
                    />
                  );
                })}

              {/* 2. Consanguineous & Key Marriage Cross-Lines */}
              {showMarriages &&
                VISUAL_MARRIAGES.map((m) => {
                  const a = layoutMap[m.fromId];
                  const b = layoutMap[m.toId];
                  if (!a || !b) return null;

                  const isHighlighted =
                    highlightedIds &&
                    (highlightedIds.has(m.fromId) || highlightedIds.has(m.toId));
                  const isDimmed = highlightedIds && !isHighlighted;

                  const sameRow = a.row === b.row;
                  const x1 = a.cx < b.cx ? a.x + NODE_WIDTH : a.x;
                  const y1 = a.cy;
                  const x2 = a.cx < b.cx ? b.x : b.x + NODE_WIDTH;
                  const y2 = b.cy;

                  const pathD = sameRow
                    ? `M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1 - 28}, ${(x1 + x2) / 2} ${
                        y2 - 28
                      }, ${x2} ${y2}`
                    : `M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`;

                  const labelX = (x1 + x2) / 2;
                  const labelY = sameRow ? y1 - 22 : (y1 + y2) / 2 - 6;

                  return (
                    <g key={`${m.fromId}-${m.toId}`} opacity={isDimmed ? 0.15 : 0.95}>
                      <path
                        d={pathD}
                        fill="none"
                        stroke={m.isConsanguineous ? '#fb7185' : '#c084fc'}
                        strokeWidth={isHighlighted ? 3 : 2.2}
                        strokeDasharray="6 4"
                      />
                      <rect
                        x={labelX - 68}
                        y={labelY - 10}
                        width={136}
                        height={18}
                        rx={9}
                        fill="#1f122b"
                        stroke={m.isConsanguineous ? '#f43f5e' : '#a855f7'}
                        strokeWidth={1}
                      />
                      <text
                        x={labelX}
                        y={labelY + 2}
                        textAnchor="middle"
                        fill="#fecdd3"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        💒 {m.label}
                      </text>
                    </g>
                  );
                })}

              {/* 3. Collateral Succession Jumps (방계 제위 점프 화살표) */}
              {showSuccession &&
                COLLATERAL_JUMPS.map((jump) => {
                  const a = layoutMap[jump.fromId];
                  const b = layoutMap[jump.toId];
                  if (!a || !b) return null;

                  const isHighlighted =
                    highlightedIds &&
                    (highlightedIds.has(jump.fromId) || highlightedIds.has(jump.toId));
                  const isDimmed = highlightedIds && !isHighlighted;

                  const x1 = a.x + NODE_WIDTH;
                  const y1 = a.cy;
                  const x2 = b.x;
                  const y2 = b.cy;

                  const pathD = `M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1 + 15}, ${
                    (x1 + x2) / 2
                  } ${y2 - 15}, ${x2} ${y2}`;

                  const mx = (x1 + x2) / 2;
                  const my = (y1 + y2) / 2;

                  return (
                    <g key={`jump-${jump.fromId}-${jump.toId}`} opacity={isDimmed ? 0.15 : 1}>
                      <path
                        d={pathD}
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth={2.8}
                        strokeDasharray="8 4"
                        markerEnd="url(#arrow-gold)"
                      />
                      <rect
                        x={mx - 76}
                        y={my - 10}
                        width={152}
                        height={19}
                        rx={6}
                        fill="#291d06"
                        stroke="#fbbf24"
                        strokeWidth={1.2}
                      />
                      <text
                        x={mx}
                        y={my + 3}
                        textAnchor="middle"
                        fill="#fde68a"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        ⚡ {jump.label}
                      </text>
                    </g>
                  );
                })}
            </svg>

            {/* HTML Node Cards */}
            {TREE_LAYOUT.map((item) => {
              const p = PERSON_MAP[item.id];
              const coords = layoutMap[item.id];
              if (!p || !coords) return null;

              const isHighlighted =
                !highlightedIds || highlightedIds.has(item.id);
              const isFocused = activeFocusId === item.id;

              return (
                <div
                  key={item.id}
                  style={{
                    left: coords.x,
                    top: coords.y,
                    width: NODE_WIDTH,
                    height: NODE_HEIGHT,
                  }}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => onSelectPerson(p)}
                  className={`absolute z-20 cursor-pointer rounded-xl p-2.5 border-2 bg-gradient-to-br shadow-xl transition-all duration-150 flex flex-col justify-between ${getNodeTheme(
                    p
                  )} ${
                    isFocused
                      ? 'ring-4 ring-amber-400 scale-105 z-30'
                      : !isHighlighted
                      ? 'opacity-20 grayscale'
                      : 'hover:scale-[1.03]'
                  }`}
                >
                  {/* Branch Start Top Floating Pill */}
                  {item.branchLabel && (
                    <div className="absolute -top-3 left-2 right-2 flex justify-center pointer-events-none">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#0b101d] text-amber-300 border border-amber-400/70 shadow truncate">
                        {item.branchLabel}
                      </span>
                    </div>
                  )}

                  {/* Top Row: Generation & F-Coefficient or Role */}
                  <div className="flex items-center justify-between gap-1 text-[10px] font-bold">
                    <span className="px-1.5 py-0.5 rounded bg-black/25 truncate">
                      {p.generation}대 ·{' '}
                      {p.role === 'emperor'
                        ? '👑 황제'
                        : p.role === 'empress_regnant'
                        ? '👑 여제'
                        : p.role === 'spanish_king'
                        ? '⚜️ 스페인왕'
                        : p.branch === 'modern'
                        ? '🕊️ 수장'
                        : p.role === 'branch_heir'
                        ? '🔀 방계'
                        : '왕족'}
                    </span>
                    {p.inbreedingCoefficient !== undefined ? (
                      <span className="px-1.5 py-0.5 rounded bg-rose-950/90 text-rose-200 border border-rose-400/50 font-mono">
                        F={p.inbreedingCoefficient.toFixed(3)}
                      </span>
                    ) : (
                      <span className="opacity-75 font-mono">{p.lifespan}</span>
                    )}
                  </div>

                  {/* Middle Row: Name */}
                  <div>
                    <div className="font-serif font-extrabold text-sm leading-tight truncate">
                      {p.nameKo}
                    </div>
                    <div className="text-[10px] opacity-80 truncate">
                      {p.reign ? `재위 ${p.reign}` : p.titles[0]}
                    </div>
                  </div>

                  {/* Bottom Row: Spouse quick summary & detail icon */}
                  <div className="flex items-center justify-between text-[10px] opacity-90 pt-1 border-t border-black/15">
                    <span className="truncate">
                      {p.spouses.length > 0 && p.spouses[0].nameKo !== '미혼'
                        ? `💒 ${p.spouses[0].nameKo}`
                        : '상세 아카이브'}
                    </span>
                    <Info className="w-3 h-3 shrink-0 ml-1" />
                  </div>

                  {/* Dead-End / Extinction Bottom Badge */}
                  {item.deadEndLabel && (
                    <div className="absolute -bottom-3.5 left-1 right-1 flex justify-center pointer-events-none">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-rose-950 text-rose-200 border border-rose-500 shadow truncate">
                        {item.deadEndLabel}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
