import { EraId } from '../types/habsburg';

export interface EraMeta {
  id: EraId;
  shortTitle: string;
  title: string;
  period: string;
  icon: string;
  badgeColor: string;
  bannerGradient: string;
  description: string;
  historicalContext: string;
}

export const ERAS: EraMeta[] = [
  {
    id: 'era1_origin',
    shortTitle: '1기 · 기원과 정착',
    title: '🌱 제1기: 합스부르크의 기원과 오스트리아 정착',
    period: '1273 – 1379',
    icon: '🛡️',
    badgeColor: 'from-amber-500 to-yellow-600',
    bannerGradient: 'from-amber-900/50 via-slate-900/80 to-transparent border-amber-500/40',
    description: '스위스 아르가우의 지방 백작 가문에서 출발해 1273년 루돌프 1세가 독일왕에 선출되고, 마르히펠트 전투(1278)를 통해 오스트리아·슈타이어마르크 공국을 가문의 심장부로 확보한 시대입니다.',
    historicalContext: '대공위 시대 종식 · 오스트리아 공국 확보(1278) · 대공(Erzherzog) 칭호 창안(1358) · 티롤 확보(1363)',
  },
  {
    id: 'era2_split',
    shortTitle: '2기 · 분할과 재통합',
    title: '⚔️ 제2기: 노이베르크 분할 (알브레히트계 vs 레오폴트계) 및 재통합',
    period: '1379 – 1493',
    icon: '⚖️',
    badgeColor: 'from-orange-500 to-amber-600',
    bannerGradient: 'from-orange-900/50 via-slate-900/80 to-transparent border-orange-500/40',
    description: '1379년 노이베르크 조약으로 본가(알브레히트계)와 분가(레오폴트계)로 영지가 쪼개졌으나, 알브레히트계가 1457년 단절된 뒤 레오폴트계의 프리드리히 3세가 모든 영지를 재통합하고 신성로마황제 세습 시대를 열었습니다.',
    historicalContext: '노이베르크 분할(1379) · 알브레히트 2세 제위 세습 시작(1438) · 프리드리히 3세의 영지 재통합 및 A.E.I.O.U. 선언',
  },
  {
    id: 'era3_empire',
    shortTitle: '3기 · 세계 제국 도약',
    title: '🌍 제3기: 정략결혼의 기적과 해가 지지 않는 세계 제국',
    period: '1493 – 1556',
    icon: '👑',
    badgeColor: 'from-yellow-400 to-amber-500',
    bannerGradient: 'from-yellow-600/40 via-amber-900/40 to-transparent border-yellow-400/60',
    description: '“전쟁은 다른 이들이 하게 두고, 행복한 오스트리아여 결혼하라!” 부르고뉴(저지대), 스페인(카스티야·아라곤·신대륙), 보헤미아·헝가리가 단 3세대의 정략결혼으로 카를 5세와 페르디난트 1세 형제에게 집중되었습니다.',
    historicalContext: '부르고뉴 혼맥(1477) · 스페인 혼맥(1496) · 보헤미아-헝가리 빈 이중결혼(1515) · 카를 5세의 대제국과 분할 퇴위(1556)',
  },
  {
    id: 'era4_austria',
    shortTitle: '4A기 · 오스트리아 본가',
    title: '🦅 제4A기: 오스트리아 합스부르크 본가 (신성로마제국 황제 계보)',
    period: '1556 – 1740',
    icon: '🦅',
    badgeColor: 'from-amber-400 to-orange-500',
    bannerGradient: 'from-amber-800/50 via-slate-900/80 to-transparent border-amber-400/50',
    description: '카를 5세의 동생 페르디난트 1세로부터 이어진 중부 유럽 제국(오스트리아·보헤미아·헝가리) 및 신성로마황제 계보입니다. 30년 전쟁과 제2차 빈 포위전을 이겨냈으나 1740년 카를 6세를 끝으로 남계가 단절됩니다.',
    historicalContext: '내오스트리아 방계 승계(1619) · 30년 전쟁(1618–1648) · 제2차 빈 포위전 승리(1683) · 국사조칙(1713)',
  },
  {
    id: 'era4_spain',
    shortTitle: '4B기 · 스페인 합스부르크',
    title: '⚜️ 제4B기: 스페인 합스부르크 왕조 (압스부르고 가문과 근친혼의 비극)',
    period: '1556 – 1700',
    icon: '⚜️',
    badgeColor: 'from-rose-500 to-red-700',
    bannerGradient: 'from-rose-900/50 via-slate-900/80 to-transparent border-rose-500/50',
    description: '카를 5세의 장남 펠리페 2세가 물려받은 스페인·네덜란드·이탈리아·아메리카 식민지 제국입니다. 영토 유출을 막기 위해 오스트리아 본가와 삼촌-조카 결혼을 반복하다 카를로스 2세(F=0.254) 대에 생물학적으로 단절되었습니다.',
    historicalContext: '레판토 해전(1571) · 포르투갈 병합(1580) · 황금세기 예술 후원 · 중첩 근친혼으로 인한 카를로스 2세 무자녀 단절(1700)',
  },
  {
    id: 'era5_lorraine',
    shortTitle: '5기 · 합스부르크-로트링겐',
    title: '🦁 제5기: 합스부르크-로트링겐 가문과 오스트리아-헝가리 제국',
    period: '1740 – 1918',
    icon: '🦁',
    badgeColor: 'from-purple-500 to-indigo-600',
    bannerGradient: 'from-purple-900/50 via-slate-900/80 to-transparent border-purple-400/50',
    description: '마리아 테레지아 여제와 로트링겐 공작 프란츠 슈테판의 결합으로 재탄생한 왕조입니다. 나폴레옹 전쟁 중 오스트리아 제국으로 전환했고, 프란츠 요제프 1세 시대의 연이은 가족 비극과 사라예보 사건 끝에 1918년 제1차 세계대전 패전으로 640년 제국이 막을 내렸습니다.',
    historicalContext: '오스트리아 왕위계승전쟁(1740) · 신성로마제국 해체(1806) · 마이얼링 비극(1889) · 사라예보 암살(1914) · 제국 해체(1918)',
  },
  {
    id: 'era6_modern',
    shortTitle: '6기 · 현대 가문 수장',
    title: '🕊️ 제6기: 제국 해체 이후 현대 합스부르크 가문 수장',
    period: '1918 – 현재',
    icon: '🕊️',
    badgeColor: 'from-sky-500 to-blue-600',
    bannerGradient: 'from-sky-900/50 via-slate-900/80 to-transparent border-sky-400/50',
    description: '제국 해체와 망명 이후, 마지막 황태자 오토 폰 합스부르크는 반나치 저항 및 유럽 통합 운동(범유럽 피크닉·유럽의회 의원)의 주역으로 변모했습니다. 현재는 손자 카를 폰 합스부르크와 증손자 페르디난트 즈보니미르로 가문 수장 계보가 이어지고 있습니다.',
    historicalContext: '합스부르크 법(1919) · 오토의 제위 요구권 포기(1961) · 범유럽 피크닉(1989) · 유럽의회 활동 및 현대 문화유산 수호',
  },
];
