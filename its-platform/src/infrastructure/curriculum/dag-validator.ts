import type { CurriculumGraph } from './curriculum-types.js';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    nodeCount: number;
    edgeCount: number;
    lessonCount: number;
    moduleCount: number;
    remediationCount: number;
    orphanCount: number;
  };
}

function topologicalSort(nodes: string[], edges: Array<{ from: string; to: string }>): { cycle: boolean; order: string[] } {
  const graph = new Map<string, string[]>();
  const indeg = new Map<string, number>();
  for (const n of nodes) {
    graph.set(n, []);
    indeg.set(n, 0);
  }
  for (const e of edges) {
    if (!graph.has(e.from)) {
      graph.set(e.from, []);
      indeg.set(e.from, 0);
    }
    if (!graph.has(e.to)) {
      graph.set(e.to, []);
      indeg.set(e.to, 0);
    }
    graph.get(e.from)!.push(e.to);
    indeg.set(e.to, (indeg.get(e.to) || 0) + 1);
    indeg.set(e.from, indeg.get(e.from) || 0);
  }

  const queue: string[] = [];
  for (const [n, d] of indeg) {
    if (d === 0) queue.push(n);
  }
  const order: string[] = [];
  while (queue.length > 0) {
    const cur = queue.shift()!;
    order.push(cur);
    for (const child of graph.get(cur) || []) {
      indeg.set(child, (indeg.get(child) || 0) - 1);
      if ((indeg.get(child) || 0) === 0) {
        queue.push(child);
      }
    }
  }

  const cycle = order.length !== nodes.length;
  return { cycle, order };
}

export function validateDAG(graph: CurriculumGraph): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const nodes = Array.from(graph.nodes.values());
  const nodeIds = nodes.map(n => n.id);
  const edges = graph.edges;

  const { cycle } = topologicalSort(nodeIds, edges);
  if (cycle) {
    errors.push('DAG is not acyclic (cycle detected in graph)');
  }

  const lessonCount = nodes.filter(n => n.type === 'lesson').length;
  const moduleCount = nodes.filter(n => n.type === 'module').length;
  const remediationCount = nodes.filter(n => {
    const meta = n.metadata as Record<string, unknown> | undefined;
    return meta && meta['remediation'] === true;
  }).length;

  const hasIncoming = new Set(edges.map(e => e.to));
  let orphanCount = 0;
  for (const node of nodes) {
    if (node.type === 'diagnostic_entry') continue;
    const meta = node.metadata as Record<string, unknown> | undefined;
    if (meta && meta['remediation'] === true) continue;
    if (!hasIncoming.has(node.id)) {
      orphanCount++;
      warnings.push(`Orphan node: ${node.id}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats: {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      lessonCount,
      moduleCount,
      remediationCount,
      orphanCount,
    },
  };
}