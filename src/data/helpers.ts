import { ChildSummary, RoleBadge, SpouseInfo } from '../types/habsburg';

/** 자녀 요약 카드 생성 헬퍼 */
export const c = (
  id: string,
  nameKo: string,
  lifespan: string,
  role: RoleBadge = 'child',
  note?: string,
  linkedPersonId?: string,
): ChildSummary => ({ id, nameKo, lifespan, role, note, linkedPersonId });

/** 배우자 정보 생성 헬퍼 */
export const sp = (
  id: string,
  nameKo: string,
  nameEn: string,
  originHouse: string,
  opts: Partial<SpouseInfo> = {},
): SpouseInfo => ({ id, nameKo, nameEn, originHouse, ...opts });
