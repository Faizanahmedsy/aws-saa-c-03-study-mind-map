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

export interface DecisionScenario {
  id: string;
  category: ServiceCategory;
  scenario: string;
  recommendation: string;
  keyReason: string;
}

export interface DecisionTree {
  id: string;
  title: string;
  description: string;
  scenarios: DecisionScenario[];
}

export interface AWSAllService {
  name: string;
  category: ServiceCategory;
  description: string;
  examFocus: string;
}
