import { HabsburgPerson } from '../types/habsburg';
import { MEDIEVAL_PERSONS } from './persons_medieval';
import { EARLY_MODERN_PERSONS } from './persons_early_modern';
import { MODERN_PERSONS } from './persons_modern';

export const PERSONS: HabsburgPerson[] = [
  ...MEDIEVAL_PERSONS,
  ...EARLY_MODERN_PERSONS,
  ...MODERN_PERSONS,
];

export const PERSON_MAP: Record<string, HabsburgPerson> = Object.fromEntries(
  PERSONS.map((p) => [p.id, p])
);

export const VISIBLE_PERSONS: HabsburgPerson[] = PERSONS.filter(
  (p) => p.display !== 'hidden'
);

export function getPersonById(id?: string): HabsburgPerson | undefined {
  if (!id) return undefined;
  return PERSON_MAP[id];
}
