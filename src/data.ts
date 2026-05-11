import { Board, DecisionTree } from './types';

export const BOARDS: Board[] = [
  {
    id: 1,
    title: "Design Secure Architectures",
    weight: "30%",
    domain: "Domain 1",
    services: [
      {
        id: 'iam',
        name: 'IAM',
        category: 'Security',
        whatItIs: 'Identity and Access Management. Securely control access to AWS resources.',
        useWhen: [
          'Manage users, groups, and roles',
          'Fine-grained permissions (JSON policies)',
          'Temporary access via roles'
        ],
        avoidWhen: [
          'For OS-level login (use SSH/RDP/Session Mgr)',
          'For end-user app login (use Cognito)'
        ],
        keyFacts: [
          'Global service, no region selection',
          'Root user: avoid daily use',
          'Principle of Least Privilege'
        ]
      },
      {
        id: 'kms',
        name: 'KMS',
        category: 'Security',
        whatItIs: 'Key Management Service. Create and control cryptographic keys.',
        useWhen: [
          'Encrypting data at rest (S3, EBS, RDS)',
          'Encrypting small data (<4KB) directly',
          'Managing Master Keys (CMKs)'
        ],
        avoidWhen: [
          'SSL/TLS certificate management -> use ACM',
          'Storing secrets (DB creds) -> use Secrets Manager'
        ],
        keyFacts: [
          'Regional service',
          'FIPS 140-2 Level 2 (mostly)',
          'Integrated with most AWS services'
        ]
      },
      {
        id: 'waf',
        name: 'WAF',
        category: 'Security',
        whatItIs: 'Web Application Firewall. Protect applications from common web exploits.',
        useWhen: [
          'Block SQL Injection / XSS',
          'Rate limiting IPs',
          'Filtering requests based on headers/IPs'
        ],
        avoidWhen: [
          'Network level (L3/L4) attacks -> use Shield',
          'General port filtering -> use Security Groups'
        ],
        keyFacts: [
          'Deploy on ALB, CloudFront, or API Gateway',
          'Layer 7 protection'
        ]
      },
      {
        id: 'secrets-manager',
        name: 'Secrets Manager',
        category: 'Security',
        whatItIs: 'Manage, rotate, and retrieve database credentials and API keys.',
        useWhen: [
          'Rotating RDS passwords automatically',
          'Protecting sensitive configuration strings',
          'Cross-account secret access'
        ],
        avoidWhen: [
          'Non-sensitive config -> use Parameter Store (Free/Low cost)',
          'Encryption keys -> use KMS'
        ],
        keyFacts: [
          'Cost: $0.40 per secret/month',
          'Automatic rotation via Lambda'
        ]
      },
      {
        id: 'guardduty',
        name: 'GuardDuty',
        category: 'Security',
         whatItIs: 'Intelligent threat detection using machine learning.',
        useWhen: [
          'Monitoring for malicious activity (crypto mining, unauthorized access)',
          'Analyzing VPC Flow Logs, DNS logs, and CloudTrail'
        ],
        avoidWhen: [
          'Actually blocking traffic -> use WAF/Shield',
          'Vulnerability scanning -> use Inspector'
        ],
        keyFacts: [
          'One-click enable',
          'No agent required'
        ]
      },
      {
        id: 'vpc-security',
        name: 'VPC Security',
        category: 'Networking',
        whatItIs: 'Network isolation using Security Groups and NACLs.',
        useWhen: [
          'Instance-level stateful firewall (SG)',
          'Subnet-level stateless firewall (NACL)',
          'Private/Public subnet isolation'
        ],
        avoidWhen: [
          'L7 Application filtering -> use WAF',
          'DDOS protection -> use Shield'
        ],
        keyFacts: [
          'SGs: Allow rules only, stateful',
          'NACLs: Allow/Deny rules, stateless'
        ]
      },
      {
        id: 'iam-identity-center',
        name: 'IAM Identity Center',
        category: 'Security',
        whatItIs: 'Successor to AWS SSO. Centrally manage SSO access to AWS accounts.',
        useWhen: [
          'Managing multi-account access',
          'Integration with external IdP (Active Directory, Okta)',
          'Providing a single login portal for users'
        ],
        avoidWhen: [
          'Single account setup (use standard IAM)',
          'App-specific user pools (use Cognito)'
        ],
        keyFacts: [
          'AWS Organizations integration required',
          'Free service'
        ]
      }
    ],
    comparisons: [
      { fromId: 'kms', toId: 'secrets-manager', label: 'KMS = Key Mgmt; Secrets Mgr = Data Mgmt' },
      { fromId: 'vpc-security', toId: 'waf', label: 'SG/NACL = L3/4; WAF = L7' }
    ]
  },
  {
    id: 2,
    title: "Design Resilient Architectures",
    weight: "26%",
    domain: "Domain 2",
    services: [
      {
        id: 'route53',
        name: 'Route 53',
        category: 'Networking',
        whatItIs: 'Highly available and scalable DNS web service.',
        useWhen: [
          'Domain registration',
          'Health checks / Failover',
          'Routing policies (Weighted, Latency, Geolocation)'
        ],
        avoidWhen: [
          'Static content caching -> use CloudFront',
          'Global TCP/UDP acceleration -> use Global Accelerator'
        ],
        keyFacts: [
          '100% Availability SLA',
          'Aliases for AWS resources (free!)'
        ]
      },
      {
        id: 'sqs',
        name: 'SQS',
        category: 'Integration',
        whatItIs: 'Standard and FIFO queues for decoupling microservices.',
        useWhen: [
          'Asynchronous processing',
          'Smoothing out traffic spikes',
          'Decoupling producer from consumer'
        ],
        avoidWhen: [
          'Push notifications -> use SNS',
          'Strict 1-to-many fan-out -> use SNS'
        ],
        keyFacts: [
          'Standard: at-least-once delivery',
          'FIFO: exactly-once, strict order'
        ]
      },
      {
        id: 'sns',
        name: 'SNS',
        category: 'Integration',
        whatItIs: 'Pub/Sub messaging service for fan-out.',
        useWhen: [
          'Pushing messages to multiple subscribers (SQS, Lambda, Email)',
          'Immediate notifications'
        ],
        avoidWhen: [
          'Buffering/Queuing messages -> use SQS',
          'Complex event routing -> use EventBridge'
        ],
        keyFacts: [
          'Push-based mechanism'
        ]
      },
      {
        id: 'eventbridge',
        name: 'EventBridge',
        category: 'Integration',
        whatItIs: 'Serverless event bus that connects apps using data.',
        useWhen: [
          'Routing events between AWS services',
          'Schema discovery',
          'SaaS app integration (Zendesk, Shopify)'
        ],
        avoidWhen: [
          'Simple point-to-point messaging -> use SQS/SNS',
          'High throughput data streaming -> use Kinesis'
        ],
        keyFacts: [
          'Rules-based routing',
          'Event replay capability'
        ]
      },
      {
        id: 'lambda',
        name: 'Lambda',
        category: 'Compute',
        whatItIs: 'Serverless functions triggered by events.',
        useWhen: [
          'Short-lived tasks (<15 mins)',
          'Automating AWS tasks',
          'Backend for API Gateway'
        ],
        avoidWhen: [
          'Long-running processes (>15 mins) -> use Fargate/EC2',
          'Legacy apps needing specific OS config -> use EC2'
        ],
        keyFacts: [
          'Pay per request & duration',
          'Auto-scales to zero'
        ]
      },
      {
        id: 'asg',
        name: 'Auto Scaling',
        category: 'Compute',
        whatItIs: 'Automatically adjust EC2 capacity to maintain performance.',
        useWhen: [
          'Predictable or unpredictable traffic patterns',
          'Maintaining a minimum number of healthy instances',
          'Cost optimization (scaling down at night)'
        ],
        avoidWhen: [
          'Single, small instance workload',
          'Stateful apps that cannot handle instance termination'
        ],
        keyFacts: [
          'Launch Templates are preferred over Launch Configs',
          'Dynamic, Scheduled, and Predictive scaling'
        ]
      }
    ],
    comparisons: [
      { fromId: 'sqs', toId: 'sns', label: 'SQS = Pull/Queue; SNS = Push/Fan-out' },
      { fromId: 'sns', toId: 'eventbridge', label: 'SNS = Simple; EventBridge = Complex Logic' }
    ]
  },
  {
    id: 3,
    title: "Design High-Performing Architectures",
    weight: "24%",
    domain: "Domain 3",
    services: [
      {
        id: 'ec2',
        name: 'EC2',
        category: 'Compute',
        whatItIs: 'Virtual servers in the cloud.',
        useWhen: [
          'Full control over OS/Software',
          'High performance local storage (Instance Store)',
          'Monolithic applications'
        ],
        avoidWhen: [
          'Simple functions -> use Lambda',
          'Dockerized microservices -> use ECS/Fargate'
        ],
        keyFacts: [
          'Instance types (Memory, Compute, Storage optimized)',
          'Purchasing options: On-Demand, Spot, Reserved'
        ]
      },
      {
        id: 'ebs',
        name: 'EBS',
        category: 'Storage',
        whatItIs: 'Block storage volumes for EC2.',
        useWhen: [
          'OS boot volumes',
          'Database storage (io2 for high IOPS)',
          'Data that persists after instance termination'
        ],
        avoidWhen: [
          'Shared file system -> use EFS',
          'Object storage -> use S3',
          'Temporary data -> use Instance Store'
        ],
        keyFacts: [
          'Availability Zone locked',
          'Snapshots stored in S3'
        ]
      },
      {
        id: 'rds',
        name: 'RDS',
        category: 'Database',
        whatItIs: 'Managed Relational Database Service.',
        useWhen: [
          'Complex joins / Transactions',
          'Standard DB engines (Postgres, MySQL, Oracle)',
          'Read replicas for scaling'
        ],
        avoidWhen: [
          'Massive scale / schema-less -> use DynamoDB',
          'Real-time caching -> use ElastiCache'
        ],
        keyFacts: [
          'Multi-AZ for DR/Availability',
          'Read Replicas for performance'
        ]
      },
      {
        id: 'dynamodb',
        name: 'DynamoDB',
        category: 'Database',
        whatItIs: 'Fast, flexible NoSQL database service.',
        useWhen: [
          'Sub-10ms performance at any scale',
          'Shopping carts, session storage',
          'Serverless applications'
        ],
        avoidWhen: [
          'Relational joins required -> use RDS',
          'OLAP workloads -> use Redshift'
        ],
        keyFacts: [
          'Serverless & auto-scaling',
          'DAX for in-memory caching'
        ]
      },
      {
        id: 'elasticache',
        name: 'ElastiCache',
        category: 'Database',
        whatItIs: 'In-memory data store using Redis or Memcached.',
        useWhen: [
          'Extreme performance/low latency reads',
          'Offloading DB read pressure',
          'Session management'
        ],
        avoidWhen: [
          'Primary data storage needs persistence (mostly)',
          'Complex relational data'
        ],
        keyFacts: [
          'Redis: Complex data types, persistence',
          'Memcached: Simple key-value, multi-threaded'
        ]
      },
      {
        id: 'athena',
        name: 'Athena',
        category: 'Monitoring',
        whatItIs: 'Interactive query service for data in S3 using SQL.',
        useWhen: [
          'Analyzing logs in S3',
          'Ad-hoc queries on data lakes',
          'Serverless analytics'
        ],
        avoidWhen: [
          'Real-time transaction processing',
          'Complex ETL (use Glue)'
        ],
        keyFacts: [
          'Pay per query (usually $5/TB scanned)',
          'Columnar formats (Parquet) save costs'
        ]
      }
    ],
    comparisons: [
      { fromId: 'rds', toId: 'dynamodb', label: 'RDS = SQL/Relational; DDB = NoSQL/Scalable' },
      { fromId: 'ebs', toId: 's3-tiers', label: 'EBS = Block; S3 = Object' }
    ]
  },
  {
    id: 4,
    title: "Design Cost-Optimized Architectures",
    weight: "20%",
    domain: "Domain 4",
    services: [
      {
        id: 's3-tiers',
        name: 'S3 Tiers',
        category: 'Storage',
        whatItIs: 'Automatic or manual storage classes to save costs.',
        useWhen: [
          'Infrequent access (S3-IA)',
          'Archival data (Glacier)',
          'Unknown access patterns (Intelligent Tiering)'
        ],
        avoidWhen: [
          'Data needed in <1ms -> use EBS',
          'Frequently modified files -> use EFS'
        ],
        keyFacts: [
          'Standard: $0.023/GB',
          'Glacier Deep Archive: $0.00099/GB'
        ]
      },
      {
        id: 'spot-instances',
        name: 'Spot Instances',
        category: 'Compute',
        whatItIs: 'Use spare AWS capacity for up to 90% discount.',
        useWhen: [
          'Fault-tolerant workloads (batch jobs, data analysis)',
          'Stateless services'
        ],
        avoidWhen: [
          'Critical/Stateful workloads that cannot be interrupted'
        ],
        keyFacts: [
          '2-minute interruption notice'
        ]
      },
      {
        id: 'transit-gateway',
        name: 'Transit Gateway',
        category: 'Networking',
        whatItIs: 'Hub-and-spoke network topology for multi-VPC.',
        useWhen: [
          'Connecting 100s of VPCs and On-prem',
          'Simplifying complex peering meshes'
        ],
        avoidWhen: [
          'Just two VPCs peering (use VPC Peering - free!)'
        ],
        keyFacts: [
          'Regional service',
          'Supports multicast'
        ]
      },
      {
        id: 'cost-explorer',
        name: 'Cost Explorer',
        category: 'Monitoring',
        whatItIs: 'Visualize and manage your AWS spending.',
        useWhen: [
          'Analyzing monthly trends',
          'Forecasting future costs',
          'Identifying cost anomalies'
        ],
        avoidWhen: [
          'Real-time runtime performance -> use CloudWatch'
        ],
        keyFacts: [
          'FREE to use',
          'Shows usage by service, tag, region'
        ]
      }
    ],
    comparisons: [
      { fromId: 's3-tiers', toId: 'ec2', label: 'Storage vs Compute cost strategies' }
    ]
  }
];

export const DECISION_TREES: DecisionTree[] = [
  {
    title: "Storage Decision Matrix",
    nodes: [
      {
        question: "How do you need to access the data?",
        options: [
          { label: "Block storage (Attached to 1 EC2)", result: "EBS" },
          { label: "Shared File System (LAN/POSIX)", result: "EFS" },
          { label: "Object storage (Web URL/API)", result: "S3" },
          { label: "Windows Native Shared FS", result: "FSx for Windows" }
        ]
      }
    ]
  },
  {
    title: "Messaging Decision Matrix",
    nodes: [
      {
        question: "What is the primary communication pattern?",
        options: [
          { label: "Queue / Decouple (Pull)", result: "SQS" },
          { label: "Fan-out / Notify (Push)", result: "SNS" },
          { label: "Event Bus / Routing", result: "EventBridge" },
          { label: "Ordered Stream + Replay", result: "Kinesis Data Streams" }
        ]
      }
    ]
  },
  {
    title: "Database Decision Matrix",
    nodes: [
      {
        question: "What is the data structure and scale requirement?",
        options: [
          { label: "Relational / SQL / Managed", result: "RDS" },
          { label: "NoSQL / Key-Value / Global Scale", result: "DynamoDB" },
          { label: "In-memory / Caching", result: "ElastiCache" },
          { label: "Data Warehouse / OLAP", result: "Redshift" }
        ]
      }
    ]
  }
];
