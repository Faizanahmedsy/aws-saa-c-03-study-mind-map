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
          'Principle of Least Privilege',
          'Shared Responsibility: Auth is AWS, Policies are User'
        ]
      },
      {
        id: 'kms',
        name: 'KMS',
        category: 'Security',
        whatItIs: 'Key Management Service. Create and control cryptographic keys.',
        useWhen: [
          'Encrypting data at rest (S3, EBS, RDS)',
          'Managing Master Keys (CMKs)',
          'FIPS 140-2 Level 3 compliance (CloudHSM)'
        ],
        avoidWhen: [
          'SSL/TLS certificate management -> use ACM',
          'Storing secrets (DB creds) -> use Secrets Manager'
        ],
        keyFacts: [
          'Regional service',
          'Symmetric keys stay within KMS'
        ]
      },
      {
        id: 'waf',
        name: 'AWS WAF',
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
        id: 'shield',
        name: 'AWS Shield',
        category: 'Security',
        whatItIs: 'Managed Distributed Denial of Service (DDoS) protection.',
        useWhen: [
          'Always-on protection (Standard)',
          'Advanced mitigation & cost protection (Advanced)',
          'Protecting Route 53 & CloudFront'
        ],
        avoidWhen: [
          'Application code vulnerabilities -> use WAF'
        ],
        keyFacts: [
          'Standard is free for all customers',
          'Advanced provides 24/7 Shield Response Team'
        ]
      },
      {
        id: 'inspector',
        name: 'Amazon Inspector',
        category: 'Security',
        whatItIs: 'Automated vulnerability management for EC2 and ECR.',
        useWhen: [
          'Scanning EC2 instances for software vulnerabilities',
          'Checking for unintended network exposure',
          'Scanning container images'
        ],
        avoidWhen: [
          'Threat detection in logs -> use GuardDuty',
          'PII discovery -> use Macie'
        ],
        keyFacts: [
          'Agent-based (older) or Agentless (newer)',
          'Integrated with Security Hub'
        ]
      },
      {
        id: 'macie',
        name: 'Amazon Macie',
        category: 'Security',
        whatItIs: 'Fully managed data security & privacy service using ML.',
        useWhen: [
          'Discovering PII (emails, SSNs) in S3',
          'Monitoring S3 bucket security posture',
          'Compliance auditing'
        ],
        avoidWhen: [
          'Scanning server vulnerabilities -> use Inspector'
        ],
        keyFacts: [
          'Only works with Amazon S3 data'
        ]
      },
      {
        id: 'orgs',
        name: 'AWS Organizations',
        category: 'Security',
        whatItIs: 'Central governance and management for multiple accounts.',
        useWhen: [
          'Consolidated billing',
          'Applying Service Control Policies (SCPs)',
          'Automating account creation'
        ],
        avoidWhen: [
          'Single account environment'
        ],
        keyFacts: [
          'SCPs set guardrails (cannot grant permissions)',
          'Root account has full power'
        ]
      }
    ],
    comparisons: [
      { fromId: 'kms', toId: 'secrets-manager', label: 'KMS = Keys; Secrets Mgr = Data' }
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
          'Health checks / Failover',
          'Routing: Latency, Geo proximity, Multi-value',
          'Public and Private Hosted Zones'
        ],
        avoidWhen: [
          'Static content caching -> use CloudFront'
        ],
        keyFacts: [
          '100% Availability SLA',
          'Active-Passive or Active-Active failover'
        ]
      },
      {
        id: 'elb',
        name: 'ELB (ALB / NLB)',
        category: 'Networking',
        whatItIs: 'Distribute incoming traffic across multiple targets.',
        useWhen: [
          'ALB: Layer 7 (HTTP/S), Path/Host routing',
          'NLB: Layer 4 (TCP/UDP), Ultra-low latency',
          'High availability across multiple AZs'
        ],
        avoidWhen: [
          'Single instance app without scale needs'
        ],
        keyFacts: [
          'NLB provides static IP capability',
          'ALB supports WebSockets and sticky sessions'
        ]
      },
      {
        id: 'asg',
        name: 'Auto Scaling',
        category: 'Compute',
        whatItIs: 'Automatically adjust EC2 capacity to keep steady performance.',
        useWhen: [
          'Scaling based on CPU/Network metrics',
          'Predictive scaling (AI-driven)',
          'Ensuring minimum health count'
        ],
        avoidWhen: [
          'Workload doesn\'t vary and can fit on 1 node'
        ],
        keyFacts: [
          'Launch Templates are newer/preferred',
          'Cooldown periods prevent flapping'
        ]
      },
      {
        id: 'sqs',
        name: 'Amazon SQS',
        category: 'Integration',
        whatItIs: 'Standard and FIFO queues for decoupling.',
        useWhen: [
          'Asynchronous processing',
          'Smoothing traffic spikes',
          'Decoupling producer from consumer'
        ],
        avoidWhen: [
          'Real-time, ordering not vital -> use SNS'
        ],
        keyFacts: [
          'Visibility timeout (default 30s)',
          'Long polling saves money (up to 20s)'
        ]
      },
      {
        id: 'step-functions',
        name: 'Step Functions',
        category: 'Integration',
        whatItIs: 'Serverless visual workflow orchestrator.',
        useWhen: [
          'Orchestrating multiple Lambda functions',
          'Retry logic & error handling for complex tasks',
          'Long-running workflows (up to 1 year)'
        ],
        avoidWhen: [
          'Simple single function call'
        ],
        keyFacts: [
          'Standard (long) vs Express (short/high freq) workflows'
        ]
      },
      {
        id: 'cloudwatch',
        name: 'CloudWatch',
        category: 'Monitoring',
        whatItIs: 'Monitoring and observability for AWS resources.',
        useWhen: [
          'Alarms based on metrics (CPU, Error count)',
          'Log aggregation and searching (Logs Insights)',
          'Dashboards for operational visibility'
        ],
        avoidWhen: [
          'Recording API calls for audit -> use CloudTrail'
        ],
        keyFacts: [
          'Metrics: Standard (1 min) or Detailed (1 sec)',
          'Events are now in EventBridge'
        ]
      }
    ],
    comparisons: [
      { fromId: 'route53', toId: 'elb', label: 'DNS vs ELB level routing' },
      { fromId: 'sqs', toId: 'sns', label: 'Pull (SQS) vs Push (SNS)' }
    ]
  },
  {
    id: 3,
    title: "Design High-Performing Architectures",
    weight: "24%",
    domain: "Domain 3",
    services: [
      {
        id: 'instance-store',
        name: 'Instance Store',
        category: 'Storage',
        whatItIs: 'Temporary block-level storage for EC2.',
        useWhen: [
          'Ultra-low latency requirements',
          'Caching, temp files, buffers',
          'NoSQL DB data replication'
        ],
        avoidWhen: [
          'Persistent data storage -> use EBS'
        ],
        keyFacts: [
          'Ephemeral: Data lost if instance stops',
          'High IOPS included'
        ]
      },
      {
        id: 'efs',
        name: 'Amazon EFS',
        category: 'Storage',
        whatItIs: 'Managed NFS shared file system for Linux.',
        useWhen: [
          'Shared storage across 1000s of nodes',
          'CMS content storage',
          'POSIX compliance needed'
        ],
        avoidWhen: [
          'Windows clients only -> use FSx'
        ],
        keyFacts: [
          'Multi-AZ availability',
          'Scales automatically'
        ]
      },
      {
        id: 'kinesis-streams',
        name: 'Kinesis Streams',
        category: 'Analytics',
        whatItIs: 'Scalable real-time data streaming.',
        useWhen: [
          'Ingesting TBs of data per hour',
          'Real-time analytics',
          'Ordering and replay'
        ],
        avoidWhen: [
          'Simple buffering -> use SQS'
        ],
        keyFacts: [
          'Data retention 24h to 365 days',
          'Partitioned via Shards'
        ]
      },
      {
        id: 'redshift',
        name: 'Amazon Redshift',
        category: 'Database',
        whatItIs: 'Fast, fully managed data warehouse.',
        useWhen: [
          'Complex OLAP queries',
          'Petabyte-scale analysis',
          'Columnar storage'
        ],
        avoidWhen: [
          'OLTP workloads -> use RDS'
        ],
        keyFacts: [
          'Redshift Spectrum queries S3 directement'
        ]
      },
      {
        id: 'global-accelerator',
        name: 'Global Accelerator',
        category: 'Networking',
        whatItIs: 'Improve global app availability.',
        useWhen: [
          'Non-HTTP traffic acceleration',
          'Anycast Static IPs',
          'Multi-region failover'
        ],
        avoidWhen: [
          'Caching web content -> use CloudFront'
        ],
        keyFacts: [
          'Uses AWS global network',
          'Fast failover (<30s)'
        ]
      }
    ],
    comparisons: [
      { fromId: 'instance-store', toId: 'ebs', label: 'Ephemeral vs Persistent' },
      { fromId: 'cloudfront', toId: 'global-accelerator', label: 'Caching vs IP acceleration' }
    ]
  },
  {
    id: 4,
    title: "Design Cost-Optimized Architectures",
    weight: "20%",
    domain: "Domain 4",
    services: [
      {
        id: 's3-lifecycle',
        name: 'S3 Lifecycle',
        category: 'Storage',
        whatItIs: 'Automate data movement and expiration.',
        useWhen: [
          'Moving old logs to Glacier',
          'Deleting old versions',
          'Saving costs on aging data'
        ],
        avoidWhen: [
          'Access patterns are unknown -> use Intelligent Tiering'
        ],
        keyFacts: [
          'Free rules',
          'Transition vs Expiration'
        ]
      },
      {
        id: 'spot-savings',
        name: 'Spot & Savings Plans',
        category: 'Compute',
        whatItIs: 'EC2 purchasing models for max savings.',
        useWhen: [
          'Spot: Fault-tolerant jobs',
          'Savings Plans: Consistent usage',
          'Reserved Instances: Standard workloads'
        ],
        avoidWhen: [
          'On-Demand for short unpredictable tests'
        ],
        keyFacts: [
          'Spot: 2 min warning',
          'Savings Plans covers Lambda/Fargate'
        ]
      },
      {
        id: 'nat-gateway-cost',
        name: 'NAT Gateway Pricing',
        category: 'Networking',
        whatItIs: 'Managing costs for private egress.',
        useWhen: [
          'Use 1 per Region for savings',
          'Replacing with VPC Endpoints (Free)'
        ],
        avoidWhen: [
          'Direct internet access (IGW)'
        ],
        keyFacts: [
          'Billed per hour + per GB'
        ]
      },
      {
        id: 'compute-optimizer',
        name: 'Compute Optimizer',
        category: 'Monitoring',
        whatItIs: 'ML rightsizing recommendations.',
        useWhen: [
          'Identifying over-provisioned instances',
          'Suggesting better families'
        ],
        avoidWhen: [
          'Real-time scaling -> use ASG'
        ],
        keyFacts: [
          'Uses 14 days of metrics'
        ]
      },
      {
        id: 'snow-family',
        name: 'Snow Family',
        category: 'Storage',
        whatItIs: 'Physical devices to migrate petabytes of data.',
        useWhen: [
          'Migration with limited bandwidth',
          'Edge computing in remote areas (Snowball Edge)',
          'Massive data transfer (Snowmobile)'
        ],
        avoidWhen: [
          'Ongoing live data sync -> use DataSync'
        ],
        keyFacts: [
          'Offline migration',
          'Encryption is mandatory'
        ]
      },
      {
        id: 'ecs-eks-fargate',
        name: 'Containers: ECS / EKS',
        category: 'Compute',
        whatItIs: 'Manage and scale containerized applications.',
        useWhen: [
          'ECS: Simple, AWS-native container orchestration',
          'EKS: Kubernetes-compatible workloads',
          'Fargate: Serverless containers (no EC2s needed)'
        ],
        avoidWhen: [
          'Standard virtual machines -> use EC2'
        ],
        keyFacts: [
          'Fargate is the serverless option for both'
        ]
      },
      {
        id: 'glue-quicksight',
        name: 'Analytics: Glue / QS',
        category: 'Analytics',
        whatItIs: 'Data preparation (Glue) and visualization (QuickSight).',
        useWhen: [
          'Glue: ETL, Data Cataloging',
          'QuickSight: BI Dashboards, ML insights'
        ],
        avoidWhen: [
          'Ad-hoc SQL queries -> use Athena'
        ],
        keyFacts: [
          'Glue is serverless ETL'
        ]
      },
      {
        id: 'transfer-family',
        name: 'Transfer Family',
        category: 'Migration',
        whatItIs: 'Fully managed SFTP, FTPS, and FTP service.',
        useWhen: [
          'Direct upload to S3/EFS via SFTP',
          'Modernizing legacy file transfers'
        ],
        avoidWhen: [
          'Web-based uploads -> use S3 Presigned URLs'
        ],
        keyFacts: [
          'Direct integration with S3'
        ]
      },
      {
        id: 'appsync',
        name: 'AppSync',
        category: 'Integration',
        whatItIs: 'Serverless GraphQL service.',
        useWhen: [
          'Real-time data sync across devices',
          'Combining multiple data sources in one API'
        ],
        avoidWhen: [
          'Simple REST API -> use API Gateway'
        ],
        keyFacts: [
          'Baked-in WebSocket support'
        ]
      }
    ],
    comparisons: [
      { fromId: 's3-tiers', toId: 's3-lifecycle', label: 'Static vs Automated movement' },
      { fromId: 'snow-family', toId: 'nat-gateway-cost', label: 'Physical vs Network migration' }
    ]
  }
];

export const ALL_SERVICES: AWSAllService[] = [
  // Compute
  { name: 'EC2', category: 'Compute', description: 'Virtual servers in the cloud.', examFocus: 'Pricing models, Instance types, Spot vs On-demand' },
  { name: 'Lambda', category: 'Compute', description: 'Serverless functions triggered by events.', examFocus: 'Execution time limits, memory allocation, triggers' },
  { name: 'ECS', category: 'Compute', description: 'Docker container management.', examFocus: 'Task definitions, clusters, Fargate vs EC2 launch types' },
  { name: 'EKS', category: 'Compute', description: 'Managed Kubernetes.', examFocus: 'K8s compatibility, control plane management' },
  { name: 'Fargate', category: 'Compute', description: 'Serverless containers.', examFocus: 'No EC2 management, pricing per resource usage' },
  { name: 'App Runner', category: 'Compute', description: 'Deploy apps directly from code/source.', examFocus: 'PaaS for containers' },
  { name: 'Batch', category: 'Compute', description: 'Run batch computing at scale.', examFocus: 'Parallel processing, spot integration' },
  { name: 'Elastic Beanstalk', category: 'Compute', description: 'PaaS for web apps.', examFocus: 'Easy deployment, automatic provisioning' },
  { name: 'Lightsail', category: 'Compute', description: 'Virtual private servers for simple workloads.', examFocus: 'Flat pricing, simple setup' },

  // Storage
  { name: 'S3', category: 'Storage', description: 'Object storage scale.', examFocus: 'Storage classes, lifecycle, versioning, replication' },
  { name: 'EBS', category: 'Storage', description: 'Block storage for EC2.', examFocus: 'SSD vs HDD, Multi-attach, Snapshots' },
  { name: 'EFS', category: 'Storage', description: 'Shared file system (NFS).', examFocus: 'Multi-AZ, POSIX compliance, Linux' },
  { name: 'FSx', category: 'Storage', description: 'Managed file servers (Lustre, Windows, NetApp).', examFocus: 'Windows integration, High performance HPC' },
  { name: 'Snowball', category: 'Storage', description: 'Physical data transfer device.', examFocus: 'Offline migration, Edge computing' },
  { name: 'Storage Gateway', category: 'Storage', description: 'Hybrid cloud storage.', examFocus: 'File Gateway, Volume Gateway, Tape Gateway' },

  // Database
  { name: 'RDS', category: 'Database', description: 'Managed relational DB.', examFocus: 'Multi-AZ, Read Replicas, engines (MySQL, Postgres, etc)' },
  { name: 'Aurora', category: 'Database', description: 'AWS-native relational DB.', examFocus: 'Serverless, global database, high throughput' },
  { name: 'DynamoDB', category: 'Database', description: 'NoSQL scale.', examFocus: 'Indexes (GSI/LSI), DAX, TTL, Global Tables' },
  { name: 'ElastiCache', category: 'Database', description: 'In-memory caching.', examFocus: 'Redis vs Memcached, session storage' },
  { name: 'Redshift', category: 'Database', description: 'Data warehouse.', examFocus: 'OLAP, Spectrum, RA3 instances' },
  { name: 'Neptune', category: 'Database', description: 'Graph database.', examFocus: 'Social networks, recommendation engines' },
  { name: 'DocumentDB', category: 'Database', description: 'MongoDB compatible.', examFocus: 'JSON storage' },

  // Networking
  { name: 'VPC', category: 'Networking', description: 'Isolated network.', examFocus: 'Subnets, NACLs, SGs, Peering, Endpoints' },
  { name: 'Route 53', category: 'Networking', description: 'DNS and domain registration.', examFocus: 'Routing policies, health checks, Resolver' },
  { name: 'CloudFront', category: 'Networking', description: 'Content Delivery Network.', examFocus: 'Edge locations, TTL, ORIGIN, SSL' },
  { name: 'Direct Connect', category: 'Networking', description: 'Physical dedicated network line.', examFocus: 'Low latency, high security connection to on-prem' },
  { name: 'Global Accelerator', category: 'Networking', description: 'Optimized network routing.', examFocus: 'IP Anycast, TCP/UDP performance' },
  { name: 'Transit Gateway', category: 'Networking', description: 'Hub and spoke network connectivity.', examFocus: 'Multi-account VPC connectivity' },
  { name: 'PrivateLink', category: 'Networking', description: 'Private VPC access to services.', examFocus: 'Zero exposure to internet' },

  // Security
  { name: 'IAM', category: 'Security', description: 'Manage access.', examFocus: 'Policies, Roles, Users, Groups, MFA' },
  { name: 'KMS', category: 'Security', description: 'Managed encryption keys.', examFocus: 'CMKs, rotation, integrated services' },
  { name: 'Secrets Manager', category: 'Security', description: 'Rotate and manage secrets.', examFocus: 'Rotation via Lambda, dynamic passwords' },
  { name: 'WAF', category: 'Security', description: 'Web app firewall.', examFocus: 'Protection against L7 attacks' },
  { name: 'Shield', category: 'Security', description: 'DDoS protection.', examFocus: 'Standard (Free) vs Advanced' },
  { name: 'Inspector', category: 'Security', description: 'Vulnerability scanning.', examFocus: 'Software vulnerabilities, network reachability' },
  { name: 'GuardDuty', category: 'Security', description: 'Intelligent threat detection.', examFocus: 'ML based monitoring of logs' },
  { name: 'Macie', category: 'Security', description: 'Data privacy / PII detection.', examFocus: 'Identifying sensitive data in S3' },

  // Integration
  { name: 'SQS', category: 'Integration', description: 'Messaging queues.', examFocus: 'Decoupling, Standard vs FIFO, Visibility timeout' },
  { name: 'SNS', category: 'Integration', description: 'Pub/sub messaging.', examFocus: 'Fan-out, push notifications' },
  { name: 'EventBridge', category: 'Integration', description: 'Event bus.', examFocus: 'Rules, SaaS integration, decoupled architecture' },
  { name: 'Step Functions', category: 'Integration', description: 'Workflow orchestration.', examFocus: 'State machines, long running tasks' },
  { name: 'AppSync', category: 'Integration', description: 'Managed GraphQL.', examFocus: 'Real-time data synchronization' },
  { name: 'API Gateway', category: 'Integration', description: 'Manage APIs.', examFocus: 'Throttling, caching, REST vs Websocket' },

  // Monitoring
  { name: 'CloudWatch', category: 'Monitoring', description: 'Performance monitoring.', examFocus: 'Metrics, Alarms, Logs Insights' },
  { name: 'CloudTrail', category: 'Monitoring', description: 'API audit logs.', examFocus: 'Who did what, governance' },
  { name: 'Config', category: 'Monitoring', description: 'Configuration audit.', examFocus: 'Resource history, compliance rules' },
  { name: 'X-Ray', category: 'Monitoring', description: 'Distributed tracing.', examFocus: 'Analyzing request performance in microservices' },
];

export const DECISION_TREES: DecisionTree[] = [
  {
    id: 'storage-logic',
    title: "Storage Decision Matrix",
    description: "Choose the right storage type based on access patterns and requirements.",
    startNodeId: 'access-type',
    nodes: [
      {
        id: 'access-type',
        question: "What is your primary access requirement?",
        options: [
          { label: "High speed LOCAL attached storage", description: "Storage for a single virtual server.", nextId: 'durability-needs' },
          { label: "Shared file system access", description: "Accessible by multiple servers simultaneously.", nextId: 'os-type' },
          { label: "Web URL / API based storage", description: "Object storage for assets, backups, etc.", result: "Amazon S3", isCorrect: true }
        ]
      },
      {
        id: 'os-type',
        question: "Which operating system are the clients using?",
        options: [
          { label: "Linux (NFS)", result: "Amazon EFS", isCorrect: true },
          { label: "Windows (SMB)", nextId: 'windows-needs' },
          { label: "High Performance Compute / Lustre", result: "FSx for Lustre", isCorrect: true }
        ]
      },
      {
        id: 'windows-needs',
        question: "Do you need native Windows behavior?",
        options: [
          { label: "Active Directory / NTFS", result: "FSx for Windows File Server", isCorrect: true },
          { label: "General purpose Windows sharing", result: "FSx for Windows or S3 w/ File Gateway" }
        ]
      },
      {
        id: 'durability-needs',
        question: "Do the files need to survive if the EC2 instance is stopped?",
        options: [
          { label: "Yes, persistence is critical.", result: "Amazon EBS", isCorrect: true },
          { label: "No, temporary cache/buffers only.", result: "Instance Store", isCorrect: true }
        ]
      }
    ]
  },
  {
    id: 'db-logic',
    title: "Database Selection Guide",
    description: "Map your data model to the most performant AWS database engine.",
    startNodeId: 'data-model',
    nodes: [
      {
        id: 'data-model',
        question: "What is your data model type?",
        options: [
          { label: "Relational (SQL/Schema)", description: "Joins, transactions, ACID compliance.", nextId: 'sql-scale' },
          { label: "NoSQL (Key-Value/JSON)", description: "Extreme scale, millisecond latency.", nextId: 'nosql-type' },
          { label: "Analytical (OLAP)", description: "Large scale reporting, multi-TB datasets.", result: "Amazon Redshift", isCorrect: true }
        ]
      },
      {
        id: 'sql-scale',
        question: "What are your scaling requirements?",
        options: [
          { label: "Standard managed DB (MySQL/Postgres)", result: "Amazon RDS", isCorrect: true },
          { label: "High performance / Enterprise / Cloud-native", result: "Amazon Aurora", isCorrect: true },
          { label: "Variable workloads (Auto-start/stop)", result: "Aurora Serverless", isCorrect: true }
        ]
      },
      {
        id: 'nosql-type',
        question: "How do you need to access your NoSQL data?",
        options: [
          { label: "Web-scale Key-Value / Document", result: "DynamoDB", isCorrect: true },
          { label: "In-memory caching (Redis/Mem)", result: "ElastiCache", isCorrect: true },
          { label: "Graph relationships", result: "Amazon Neptune", isCorrect: true }
        ]
      }
    ]
  }
];
