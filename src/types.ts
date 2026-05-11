export type ServiceCategory = 'Compute' | 'Networking' | 'Storage' | 'Database' | 'Security' | 'Integration' | 'Monitoring' | 'Analytics' | 'Migration';

export interface ServiceCard {
  id: string;
  name: string;
  category: ServiceCategory;
  whatItIs: string;
  useWhen: string[];
  avoidWhen: string[];
  keyFacts: string[];
}

export interface Comparison {
  fromId: string;
  toId: string;
  label: string;
}

export interface Board {
  id: number;
  title: string;
  weight: string;
  domain: string;
  services: ServiceCard[];
  comparisons?: Comparison[];
}

export interface DecisionNode {
  id: string;
  question: string;
  options: {
    label: string;
    description?: string;
    nextId?: string; // ID of the next node
    result?: string; // Final recommendation if no nextId
    isCorrect?: boolean; // For quiz mode: is this the "best practice" path?
  }[];
}

export interface DecisionTree {
  id: string;
  title: string;
  description: string;
  startNodeId: string;
  nodes: DecisionNode[];
}

export interface AWSAllService {
  name: string;
  category: ServiceCategory;
  description: string;
  examFocus: string;
}
