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
  question: string;
  options: {
    label: string;
    result: string;
    icon?: string;
  }[];
}

export interface DecisionTree {
  title: string;
  nodes: DecisionNode[];
}
