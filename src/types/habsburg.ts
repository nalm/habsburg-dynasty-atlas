export type EraId =
  | 'era1_origin'      // 1기: 기원과 오스트리아 정착 (1273–1379)
  | 'era2_split'       // 2기: 알브레히트계 vs 레오폴트계 분할과 재통합 (1379–1493)
  | 'era3_empire'      // 3기: 정략결혼의 기적과 세계 제국 (1493–1556)
  | 'era4_austria'     // 4A기: 오스트리아 합스부르크 본가 (1556–1740)
  | 'era4_spain'       // 4B기: 스페인 합스부르크 분파 (1556–1700)
  | 'era5_lorraine'    // 5기: 합스부르크-로트링겐 제국 (1740–1918)
  | 'era6_modern';     // 6기: 제국 해체 이후 현대 가문 수장 (1918–현재)

export type BranchType =
  | 'origin'           // 초기 통합 합스부르크
  | 'albertinian'      // 알브레히트계 (본가, 1457 단절)
  | 'leopoldian'       // 레오폴트계 (분가 -> 황실 본류)
  | 'world_empire'     // 막시밀리안 1세 ~ 카를 5세 세계제국
  | 'austrian'         // 오스트리아 합스부르크 (1556-1740)
  | 'inner_austrian'   // 내오스트리아 방계 (카를 2세 -> 페르디난트 2세)
  | 'spanish'          // 스페인 합스부르크 (1556-1700)
  | 'lorraine'         // 합스부르크-로트링겐 (1740-1918)
  | 'lorraine_branch'  // 프란츠 카를 -> 카를 루드비히 -> 오토 프란츠 방계
  | 'modern';          // 1918 이후 현대 가문 수장

export type RoleBadge =
  | 'emperor'          // 신성로마황제 / 오스트리아 황제 / 독일왕
  | 'empress_regnant'  // 여제/여대공 (마리아 테레지아)
  | 'spanish_king'     // 스페인 국왕
  | 'head_of_house'    // 가문 수장 (공작/대공/현대 수장)
  | 'heir'             // 직계 후계자
  | 'branch_heir'      // 방계 승계 핵심 인물
  | 'notable_royalty'  // 주요 왕족 (프랑스 왕비, 멕시코 황제 등)
  | 'tragic'           // 비극적 최후 (암살, 처형, 자살, 요절)
  | 'child';           // 일반 자녀

export interface SpouseInfo {
  id: string;
  nameKo: string;
  nameEn: string;
  lifespan?: string;
  marriageYear?: string;
  originHouse: string;
  relationNote?: string; // 예: "친조카 (막시밀리안 2세의 딸)", "사촌", "부르고뉴 상속녀"
  isConsanguineous?: boolean;
  territoryGained?: string;
  note?: string;
  isEmperorConsort?: boolean;
  linkedPersonId?: string; // 가계도 내 다른 노드로 존재하는 경우 ID
}

export interface ChildSummary {
  id: string;
  nameKo: string;
  nameEn?: string;
  lifespan: string;
  role: RoleBadge;
  note?: string;
  spouseNote?: string;
  linkedPersonId?: string; // 클릭 시 이동할 주요 인물 노드 ID
}

export interface HabsburgPerson {
  id: string;
  nameKo: string;
  nameEn: string;
  titles: string[];
  reign?: string;
  lifespan: string;
  birthYear: number;
  deathYear?: number;
  era: EraId;
  branch: BranchType;
  role: RoleBadge;
  generation: number; // 루돌프 1세 = 1세대 기준 (1 ~ 25)
  fatherId?: string;
  motherName?: string;
  motherId?: string;
  predecessorId?: string;
  successorId?: string;
  successionType?: 'direct' | 'brother' | 'cousin_nephew' | 'daughter_pragmatic' | 'collateral' | 'split';
  successionNote?: string;
  spouses: SpouseInfo[];
  children: ChildSummary[];
  extraChildrenCount?: number; // "+ 10명" 등 추가 자녀 수 (펼치기 지원용 상세 목록과 병행)
  extraChildrenList?: ChildSummary[]; // 펼쳤을 때 보여줄 전체/추가 자녀들
  inbreedingCoefficient?: number; // F 계수 (예: 0.254)
  inbreedingNote?: string;
  summary: string;
  achievements: string[];
  tragediesOrTrivia?: string[];
  territories?: string[];
  epithet?: string; // 별칭 (예: '최후의 기사', '해가 지지 않는 제국', '마법에 걸린 자', '시시')
  display?: 'main' | 'collateral' | 'hidden'; // 가계도 표시 방식 (기본 main, hidden은 혼맥·경로 탐색 전용 노드)
}

export interface HistoricalEvent {
  id: string;
  year: number;
  endYear?: number;
  dateLabel: string;
  title: string;
  category: 'marriage' | 'war' | 'treaty' | 'succession' | 'tragedy' | 'empire';
  era: EraId;
  summary: string;
  impact: string;
  territoryChange?: string;
  relatedPersonIds: string[];
}

export interface ConsanguinityLoopEdge {
  id: string;
  groomId: string;
  groomName: string;
  brideId: string;
  brideName: string;
  year: number;
  relation: string; // 예: "삼촌 × 친조카", "이중 4촌"
  offspringName: string;
  offspringId?: string;
  offspringF: number;
  description: string;
}

export interface PathfinderPreset {
  id: string;
  title: string;
  subtitle: string;
  fromId: string;
  toId: string;
  badge: string;
  description: string;
}
