import { PERSONS, PERSON_MAP } from '../data/persons';
import { HabsburgPerson } from '../types/habsburg';

export interface PathStep {
  person: HabsburgPerson;
  relationFromPrev?: string;
  edgeType?: 'parent_to_child' | 'child_to_parent' | 'spouse' | 'sibling';
}

interface AdjacencyEdge {
  targetId: string;
  label: string;
  edgeType: 'parent_to_child' | 'child_to_parent' | 'spouse' | 'sibling';
}

function buildAdjacencyMap(): Record<string, AdjacencyEdge[]> {
  const adj: Record<string, AdjacencyEdge[]> = {};
  for (const p of PERSONS) {
    adj[p.id] = [];
  }

  const addEdge = (
    from: string,
    to: string,
    label: string,
    edgeType: AdjacencyEdge['edgeType']
  ) => {
    if (!PERSON_MAP[from] || !PERSON_MAP[to]) return;
    if (!adj[from].some((e) => e.targetId === to)) {
      adj[from].push({ targetId: to, label, edgeType });
    }
  };

  for (const p of PERSONS) {
    if (p.fatherId && PERSON_MAP[p.fatherId]) {
      addEdge(p.fatherId, p.id, '자녀 (아들/딸)', 'parent_to_child');
      addEdge(p.id, p.fatherId, '아버지 (부친)', 'child_to_parent');
    }
    if (p.motherId && PERSON_MAP[p.motherId]) {
      addEdge(p.motherId, p.id, '자녀 (아들/딸)', 'parent_to_child');
      addEdge(p.id, p.motherId, '어머니 (모친)', 'child_to_parent');
    }
    for (const sp of p.spouses) {
      if (sp.linkedPersonId && PERSON_MAP[sp.linkedPersonId]) {
        addEdge(
          p.id,
          sp.linkedPersonId,
          `배우자 (${sp.marriageYear || '결혼'}${sp.relationNote ? ` · ${sp.relationNote}` : ''})`,
          'spouse'
        );
        addEdge(
          sp.linkedPersonId,
          p.id,
          `배우자 (${sp.marriageYear || '결혼'}${sp.relationNote ? ` · ${sp.relationNote}` : ''})`,
          'spouse'
        );
      }
    }
  }

  return adj;
}

const ADJ_MAP = buildAdjacencyMap();

export function findShortestLineagePath(
  fromId: string,
  toId: string,
  bloodlineOnly = false
): PathStep[] {
  if (!PERSON_MAP[fromId] || !PERSON_MAP[toId]) return [];
  if (fromId === toId) {
    return [{ person: PERSON_MAP[fromId] }];
  }

  const visited = new Set<string>([fromId]);
  const queue: { id: string; path: PathStep[] }[] = [
    { id: fromId, path: [{ person: PERSON_MAP[fromId] }] },
  ];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const edges = ADJ_MAP[current.id] || [];

    for (const edge of edges) {
      if (bloodlineOnly && edge.edgeType === 'spouse') continue;
      if (visited.has(edge.targetId)) continue;

      const nextPerson = PERSON_MAP[edge.targetId];
      if (!nextPerson) continue;

      const nextPath: PathStep[] = [
        ...current.path,
        {
          person: nextPerson,
          relationFromPrev: edge.label,
          edgeType: edge.edgeType,
        },
      ];

      if (edge.targetId === toId) {
        return nextPath;
      }

      visited.add(edge.targetId);
      queue.push({ id: edge.targetId, path: nextPath });
    }
  }

  return [];
}

export function findSuccessionChain(fromId: string, toId: string): HabsburgPerson[] {
  const result: HabsburgPerson[] = [];
  let curr: HabsburgPerson | undefined = PERSON_MAP[fromId];
  const visited = new Set<string>();

  while (curr && !visited.has(curr.id)) {
    result.push(curr);
    visited.add(curr.id);
    if (curr.id === toId) return result;
    curr = curr.successorId ? PERSON_MAP[curr.successorId] : undefined;
  }

  return [];
}
