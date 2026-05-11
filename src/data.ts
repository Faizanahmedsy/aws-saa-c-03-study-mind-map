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
    id: 'storage',
    title: "Storage & Migration Scenarios",
    description: "Choosing between S3, EBS, EFS, and Migration tools.",
    scenarios: [
      { id: 's1', category: 'Storage', scenario: "Shared POSIX file system for hundreds of Linux EC2 instances.", recommendation: "Amazon EFS", keyReason: "EFS provides managed NFS for Linux with multi-instance concurrent access." },
      { id: 's2', category: 'Storage', scenario: "High-performance block storage for a database on a single EC2 instance.", recommendation: "Amazon EBS (io2)", keyReason: "EBS Provisioned IOPS (io2) offers the lowest latency and highest throughput for block storage." },
      { id: 's3', category: 'Storage', scenario: "Temporary storage for scratch files and buffers with ultra-low latency.", recommendation: "Instance Store", keyReason: "Ephemeral storage attached physically to the host; data is lost if stopped, but speed is unmatched." },
      { id: 's4', category: 'Storage', scenario: "Millisecond access to data stored in S3 for infrequent access patterns.", recommendation: "S3 Standard-IA", keyReason: "Infrequent Access tier saves cost while maintaining low-latency retrieval." },
      { id: 's5', category: 'Storage', scenario: "Move petabytes of data to AWS where internet bandwidth is the bottleneck.", recommendation: "AWS Snowball Edge", keyReason: "Physical device for large-scale data migration without using the network." },
      { id: 's6', category: 'Migration', scenario: "Automate ongoing data migration from on-premise NFS to Amazon S3.", recommendation: "AWS DataSync", keyReason: "Managed service for high-speed data transfer between on-prem and AWS storage." },
      { id: 's7', category: 'Storage', scenario: "Native Windows file sharing (SMB) with Active Directory integration.", recommendation: "Amazon FSx for Windows", keyReason: "Managed Windows file server supporting NTFS permissions and SMB protocol." },
      { id: 's8', category: 'Storage', scenario: "Static website hosting with global low-latency distribution.", recommendation: "S3 + CloudFront", keyReason: "S3 stores the files; CloudFront caches them at edge locations worldwide." },
      { id: 's9', category: 'Storage', scenario: "Long-term archival of compliance data with retrieval times of 12+ hours.", recommendation: "S3 Glacier Deep Archive", keyReason: "Lowest cost storage for data that is rarely accessed and can wait for retrieval." },
      { id: 's10', category: 'Storage', scenario: "Automatically move S3 objects between tiers based on changing access patterns.", recommendation: "S3 Intelligent-Tiering", keyReason: "No operational overhead; AWS moves the data based on actual access behavior." },
      { id: 's11', category: 'Storage', scenario: "Local caching of S3 data for on-premise applications to reduce latency.", recommendation: "Storage Gateway (S3 File Gateway)", keyReason: "Provides an on-premise interface (NFS/SMB) for S3 objects with local caching." },
      { id: 's12', category: 'Storage', scenario: "Shared storage for Windows and Linux with Multi-AZ high availability.", recommendation: "Amazon FSx for NetApp ONTAP", keyReason: "Supports both SMB and NFS and provides robust multi-protocol enterprise storage." },
      { id: 's13', category: 'Migration', scenario: "One-time migration of 50TB of data from S3 to another S3 bucket in a different account.", recommendation: "S3 Batch Operations", keyReason: "Efficiently perform large-scale object operations, like copying millions of files." },
      { id: 's14', category: 'Storage', scenario: "Restricting S3 bucket access to specific VPC endpoints only.", recommendation: "S3 Bucket Policy with aws:SourceVpce", keyReason: "Secures data by ensuring it can only be accessed from within the private network." },
      { id: 's15', category: 'Storage', scenario: "Storing sensitive medical records with hardware-based encryption key storage.", recommendation: "AWS CloudHSM", keyReason: "Provides FIPS 140-2 Level 3 dedicated hardware modules for key management." }
    ]
  },
  {
    id: 'compute',
    title: "Compute & Architecture Scenarios",
    description: "Deciding between EC2, Lambda, ECS, and Scaling strategies.",
    scenarios: [
      { id: 'c1', category: 'Compute', scenario: "Short-lived code execution (<15 mins) triggered by S3 uploads.", recommendation: "AWS Lambda", keyReason: "Serverless, scales automatically, only pay for execution time." },
      { id: 'c2', category: 'Compute', scenario: "Long-running batch processing jobs that can tolerate interruptions.", recommendation: "EC2 Spot Instances", keyReason: "Up to 90% discount for fault-tolerant workloads." },
      { id: 'c3', category: 'Compute', scenario: "Deploying a Docker containerized microservice without managing virtual servers.", recommendation: "AWS Fargate", keyReason: "Serverless compute for containers; removes the need to provision/patch EC2s." },
      { id: 'c4', category: 'Compute', scenario: "Migrating a legacy application requiring specific OS kernel modifications.", recommendation: "Amazon EC2", keyReason: "Provides full control over the instance, OS, and software stack." },
      { id: 'c5', category: 'Compute', scenario: "Automatically adjusting capacity to maintain steady, predictable performance.", recommendation: "Auto Scaling Group (ASG)", keyReason: "Scales EC2 instances based on metrics like CPU or custom CloudWatch alarms." },
      { id: 'c6', category: 'Compute', scenario: "Running a high-performance computing (HPC) cluster with low-latency networking.", recommendation: "EC2 with Cluster Placement Group", keyReason: "Ensures instances are physically close for minimum latency between nodes." },
      { id: 'c7', category: 'Compute', scenario: "Distributing traffic across multiple web servers based on URL path.", recommendation: "Application Load Balancer (ALB)", keyReason: "Layer 7 load balancer supporting path-based and host-based routing." },
      { id: 'c8', category: 'Compute', scenario: "Handling millions of requests per second with ultra-low latency (UDP/TCP).", recommendation: "Network Load Balancer (NLB)", keyReason: "Layer 4 load balancer capable of handling extreme spikes with static IPs." },
      { id: 'c9', category: 'Compute', scenario: "Provisioning a consistent amount of compute for 1-3 years for a 72% discount.", recommendation: "Compute Savings Plans", keyReason: "Flexible discount model covering EC2, Lambda, and Fargate usage." },
      { id: 'c10', category: 'Compute', scenario: "Coordinating multiple Lambda functions into a long-running workflow.", recommendation: "AWS Step Functions", keyReason: "Visual orchestrator for complex state machines and error handling." },
      { id: 'c11', category: 'Compute', scenario: "Running an application on a physical server dedicated entirely to your account.", recommendation: "EC2 Dedicated Hosts", keyReason: "Required for software licensing (per-core) and strict compliance needs." },
      { id: 'c12', category: 'Compute', scenario: "Running batch jobs across thousands of EC2 instances with managed orchestration.", recommendation: "AWS Batch", keyReason: "Dynamically provisions compute resources based on volume and requirements of jobs." },
      { id: 'c13', category: 'Compute', scenario: "Scaling an application based on a predictable pattern (e.g. every Monday morning).", recommendation: "ASG Scheduled Scaling", keyReason: "Proactively adjusts capacity before traffic arrives based on time/date." }
    ]
  },
  {
    id: 'database',
    title: "Database & Analytics Scenarios",
    description: "Choosing between RDS, DynamoDB, Redshift, and Caching.",
    scenarios: [
      { id: 'd1', category: 'Database', scenario: "A relational database for an ERP system requiring complex cross-table joins.", recommendation: "Amazon RDS", keyReason: "Managed relational service for SQL workloads like Postgres, MySQL, Oracle." },
      { id: 'd2', category: 'Database', scenario: "Global shopping cart with millions of users and sub-10ms latency.", recommendation: "Amazon DynamoDB", keyReason: "NoSQL key-value store with consistent performance at any scale." },
      { id: 'd3', category: 'Database', scenario: "Offloading read pressure from a primary SQL database with high-speed caching.", recommendation: "Amazon ElastiCache (Redis)", keyReason: "In-memory data store for sub-millisecond response times." },
      { id: 'd4', category: 'Database', scenario: "Petabyte-scale data warehousing for complex analytical (OLAP) queries.", recommendation: "Amazon Redshift", keyReason: "Columnar storage and massively parallel processing for analytics." },
      { id: 'd5', category: 'Analytics', scenario: "Querying data directly in S3 using standard SQL without moving it.", recommendation: "Amazon Athena", keyReason: "Serverless interactive query service; pay only for the data scanned." },
      { id: 'd6', category: 'Database', scenario: "Relational database with automatic scaling, and Multi-AZ replication.", recommendation: "Amazon Aurora", keyReason: "AWS-native database with 3x higher performance than standard MySQL." },
      { id: 'd7', category: 'Database', scenario: "Analyzing highly connected data like social networks or fraud patterns.", recommendation: "Amazon Neptune", keyReason: "Purpose-built graph database for navigating complex relationships." },
      { id: 'd8', category: 'Database', scenario: "In-memory cache for DynamoDB to achieve microsecond latency.", recommendation: "DynamoDB DAX", keyReason: "Fully managed, highly available, in-memory cache specifically for DynamoDB." },
      { id: 'd9', category: 'Database', scenario: "Serverless NoSQL database that scales to zero during inactivity.", recommendation: "DynamoDB On-Demand", keyReason: "Instantly handles spikes without capacity planning; pay per request." },
      { id: 'd10', category: 'Analytics', scenario: "Managed ETL service to prepare data for analytics (Cataloging/Mapping).", recommendation: "AWS Glue", keyReason: "Serverless data integration service for discovery, prep, and combination." },
      { id: 'd11', category: 'Database', scenario: "Migrating an on-premise Oracle DB to AWS Aurora with minimal downtime.", recommendation: "AWS DMS (Database Migration Service)", keyReason: "Supports heterogeneous migrations and continuous data replication." },
      { id: 'd12', category: 'Database', scenario: "Converting a legacy SQL Server schema to a DynamoDB compatible format.", recommendation: "AWS Schema Conversion Tool (SCT)", keyReason: "Automates the assessment and conversion of DB schemas between different engines." }
    ]
  },
  {
    id: 'networking',
    title: "Networking & Security Scenarios",
    description: "VPC setup, Hybrid connectivity, and Threat protection.",
    scenarios: [
      { id: 'n1', category: 'Networking', scenario: "Securely connecting an on-premise data center to AWS with consistent bandwidth.", recommendation: "AWS Direct Connect", keyReason: "Physical, dedicated network connection bypasses the public internet." },
      { id: 'n2', category: 'Networking', scenario: "Protecting a public web application from SQL injection and XSS attacks.", recommendation: "AWS WAF", keyReason: "Web Application Firewall filters Layer 7 traffic based on security rules." },
      { id: 'n3', category: 'Networking', scenario: "Dedicated, private connection between two VPCs in different accounts/regions.", recommendation: "VPC Peering", keyReason: "Direct network routing between VPCs using private IP addresses." },
      { id: 'n4', category: 'Networking', scenario: "Granting private access from a VPC to S3 without using a NAT Gateway.", recommendation: "VPC Gateway Endpoint", keyReason: "Free, private routing for S3 and DynamoDB within a VPC." },
      { id: 'n5', category: 'Security', scenario: "Automatically rotating database passwords every 30 days.", recommendation: "AWS Secrets Manager", keyReason: "Integrated with RDS for automatic rotation and secure credential retrieval." },
      { id: 'n6', category: 'Security', scenario: "Intelligent threat detection monitoring VPC Flow Logs and CloudTrail.", recommendation: "Amazon GuardDuty", keyReason: "Uses machine learning to identify malicious activity like crypto-mining." },
      { id: 'n7', category: 'Networking', scenario: "Routing users to the closest application endpoint based on latency.", recommendation: "Route 53 (Latency Routing)", keyReason: "DNS-based routing that selects the region with the lowest latency for the user." },
      { id: 'n8', category: 'Networking', scenario: "Consolidating multiple VPCs and on-premise connections into a central hub.", recommendation: "AWS Transit Gateway", keyReason: "Hub-and-spoke network topology for multi-VPC and hybrid environments." },
      { id: 'n9', category: 'Security', scenario: "Centralized governance for multiple AWS accounts with consolidated billing.", recommendation: "AWS Organizations", keyReason: "Allows management of multiple accounts with Service Control Policies (SCPs)." },
      { id: 'n10', category: 'Networking', scenario: "Accelerating globally distributed applications using Anycast IP addresses.", recommendation: "AWS Global Accelerator", keyReason: "Uses the AWS global network to improve availability and performance for any traffic type." },
      { id: 'n11', category: 'Security', scenario: "Analyzing S3 bucket permissions to identify publicly accessible data.", recommendation: "IAM Access Analyzer", keyReason: "Helps identify resources in your account that are shared with an external entity." },
      { id: 'n12', category: 'Networking', scenario: "Quickly setting up a secure VPN over the public internet to on-premise.", recommendation: "AWS Site-to-Site VPN", keyReason: "Uses IPsec to create a secure tunnel; fast to deploy but bandwidth varies with internet speed." }
    ]
  },
  {
    id: 'monitoring',
    title: "Monitoring, Governance & Management",
    description: "CloudWatch, Config, and operational excellence.",
    scenarios: [
      { id: 'm1', category: 'Monitoring', scenario: "Audit history of all API calls made in the AWS account.", recommendation: "AWS CloudTrail", keyReason: "Governance, compliance, and risk auditing service for AWS API actions." },
      { id: 'm2', category: 'Monitoring', scenario: "Tracking resource configuration changes over time for compliance.", recommendation: "AWS Config", keyReason: "Assess, audit, and evaluate the configurations of your AWS resources." },
      { id: 'm3', category: 'Monitoring', scenario: "Real-time performance metrics (CPU, Network) for EC2 instances.", recommendation: "Amazon CloudWatch Metrics", keyReason: "Standard monitoring service for resource utilization and health." },
      { id: 'm4', category: 'Monitoring', scenario: "Tracing requests through a distributed microservices architecture.", recommendation: "AWS X-Ray", keyReason: "Helps developers analyze and debug production, distributed applications." },
      { id: 'm5', category: 'Monitoring', scenario: "Centralized dashboard for security alerts across multiple AWS accounts.", recommendation: "AWS Security Hub", keyReason: "Aggregates security findings from GuardDuty, Inspector, Macie, etc." },
      { id: 'm6', category: 'Monitoring', scenario: "Automated patch management for a fleet of EC2 instances.", recommendation: "AWS Systems Manager (Patch Manager)", keyReason: "Helps automate the process of patching managed instances with both security and other types of updates." },
      { id: 'm7', category: 'Monitoring', scenario: "Identifying over-provisioned resources to optimize costs.", recommendation: "AWS Compute Optimizer", keyReason: "Uses Machine Learning to recommend optimal AWS resources for your workloads." },
      { id: 'm8', category: 'Monitoring', scenario: "Visualizing operational health and compliance in a single view.", recommendation: "Systems Manager Explorer", keyReason: "Customizable operations dashboard that reports on the health and status of your AWS resources." },
      { id: 'm9', category: 'Networking', scenario: "Analyzing network traffic patterns between subnets for security audits.", recommendation: "VPC Flow Logs", keyReason: "Captures information about the IP traffic to and from network interfaces in your VPC." },
      { id: 'm10', category: 'Monitoring', scenario: "Detecting anomalous behavior in CloudWatch metrics automatically.", recommendation: "CloudWatch Anomaly Detection", keyReason: "Applies machine learning to continuously analyze metrics and identify unusual behavior." }
    ]
  },
  {
    id: 'serverless',
    title: "Serverless & App Integration Scenarios",
    description: "Decoupling, Messaging, and Event-driven patterns.",
    scenarios: [
      { id: 'i1', category: 'Integration', scenario: "Asynchronously decoupling two microservices to handle traffic spikes.", recommendation: "Amazon SQS", keyReason: "Message queue service that allows producers to send messages without waiting for consumers." },
      { id: 'i2', category: 'Integration', scenario: "Broadcasting a single message to multiple subscribers (Fan-out pattern).", recommendation: "Amazon SNS", keyReason: "Pub/Sub service that pushes messages to multiple endpoints (Lambda, SQS, Email)." },
      { id: 'i3', category: 'Integration', scenario: "Triggering AWS actions based on status changes in external SaaS apps.", recommendation: "Amazon EventBridge", keyReason: "Serverless event bus that connects applications using event data from many sources." },
      { id: 'i4', category: 'Integration', scenario: "Providing a unified GraphQL interface for data scattered across multiple DBs.", recommendation: "AWS AppSync", keyReason: "Simplifies data access with a single endpoint and real-time synchronization." },
      { id: 'i5', category: 'Compute', scenario: "Exposing a REST API endpoint for a Lambda-based backend service.", recommendation: "Amazon API Gateway", keyReason: "Managed service to create, publish, and secure APIs at any scale." },
      { id: 'i6', category: 'Integration', scenario: "Strictly ordered message processing (Exactly-once) for financial transactions.", recommendation: "SQS FIFO", keyReason: "Ensures messages are processed in the exact order they were sent." },
      { id: 'i7', category: 'Integration', scenario: "Large-scale real-time data ingestion for streaming analytics.", recommendation: "Amazon Kinesis Data Streams", keyReason: "Collects and processes large streams of data records in real-time." },
      { id: 'i8', category: 'Integration', scenario: "Managed message broker for existing applications using RabbitMQ or ActiveMQ.", recommendation: "Amazon MQ", keyReason: "Allows easy migration of apps using standard messaging protocols." },
      { id: 'i9', category: 'Integration', scenario: "Buffering data before loading it into S3, Redshift, or OpenSearch.", recommendation: "Amazon Kinesis Firehose", keyReason: "Fully managed service for loading streaming data into data lakes and warehouses." },
      { id: 'i10', category: 'Compute', scenario: "Running a job every morning at 8 AM to generate report logs.", recommendation: "EventBridge (Cron) + Lambda", keyReason: "Schedule-based triggers for serverless automation." },
      { id: 'i11', category: 'Integration', scenario: "Sending high-volume marketing or transactional emails.", recommendation: "Amazon SES (Simple Email Service)", keyReason: "Cost-effective, flexible, and scalable email service for developers." },
      { id: 'i12', category: 'Integration', scenario: "Processing large JSON files in S3 and splitting them for parallel execution.", recommendation: "Step Functions Map State", keyReason: "Orchestrates parallel processing of items in an array or collection within a workflow." }
    ]
  },
  {
    id: 'compliance',
    title: "Compliance & Disaster Recovery",
    description: "RTO/RPO, Multi-region, and Data Sovereignty.",
    scenarios: [
      { id: 'r1', category: 'Storage', scenario: "Automatic replication of S3 objects to a different region for disaster recovery.", recommendation: "S3 Cross-Region Replication (CRR)", keyReason: "Provides automatic, asynchronous copying of objects across regions for high availability." },
      { id: 'r2', category: 'Networking', scenario: "Single IP address that transparently redirects to a failover region during an outage.", recommendation: "Route 53 Failover Routing", keyReason: "Uses health checks to automatically route traffic to a secondary region if the primary is down." },
      { id: 'r3', category: 'Compute', scenario: "Maintaining a exact copy of a production environment in a second region (Warm Standby).", recommendation: "Warm Standby", keyReason: "Balance between cost and recovery time (RTO) by keeping a scaled-down version ready." },
      { id: 'r4', category: 'Database', scenario: "Relational database with multi-regional read replicas and fast failover.", recommendation: "Amazon Aurora Global Database", keyReason: "Allows for sub-second data replication and quick regional failover for global apps." },
      { id: 'r5', category: 'Storage', scenario: "Preventing S3 objects from being deleted or overwritten for compliance (WORM).", recommendation: "S3 Object Lock", keyReason: "Ensures data cannot be changed for a set period, meeting strict regulatory requirements." },
      { id: 'r6', category: 'Security', scenario: "Ensuring all data in S3 is encrypted with a key that is rotated every year.", recommendation: "SSE-KMS", keyReason: "Native encryption options that handle rotation and management automatically." },
      { id: 'r7', category: 'Security', scenario: "Enforcing that no IAM user can ever delete the CloudTrail logs.", recommendation: "SCP (Service Control Policy)", keyReason: "Organization-level guardrail that overrides even local administrator permissions." },
      { id: 'r8', category: 'Networking', scenario: "Testing a new application version by sending 10% of traffic to it.", recommendation: "Route 53 Weighted Routing", keyReason: "Allows for canary deployments or A/B testing by splitting traffic by percentage." },
      { id: 'r9', category: 'Storage', scenario: "Recovering data in S3 that was accidentally deleted yesterday.", recommendation: "S3 Versioning", keyReason: "Keeps history of objects; allowing you to restore to a previous state." },
      { id: 'r10', category: 'Database', scenario: "Backing up a NoSQL database every hour to a different region.", recommendation: "AWS Backup", keyReason: "Provides centralized, cross-region management for DB backups." },
      { id: 'r11', category: 'Compute', scenario: "Deploying an application to multiple Availability Zones to ensure high availability.", recommendation: "Multi-AZ Deployment", keyReason: "Fundamental AWS pattern to protect against the failure of a single data center." }
    ]
  },
  {
    id: 'ai-ml',
    title: "AI, Machine Learning & Media",
    description: "Rekognition, SageMaker, and Intelligence services.",
    scenarios: [
      { id: 'ml1', category: 'Analytics', scenario: "Detecting objects, people, or text in images and videos using pre-trained ML.", recommendation: "Amazon Rekognition", keyReason: "Managed computer vision service that doesn't require deep learning expertise." },
      { id: 'ml2', category: 'Analytics', scenario: "Converting text to lifelike speech in multiple languages.", recommendation: "Amazon Polly", keyReason: "Uses advanced deep learning technologies to synthesize natural sounding human speech." },
      { id: 'ml3', category: 'Analytics', scenario: "Translating large volumes of text from one language to another automatically.", recommendation: "Amazon Translate", keyReason: "Neural machine translation service for fast, high-quality, and affordable translation." },
      { id: 'ml4', category: 'Analytics', scenario: "Extracting text and structured data (forms/tables) from scanned documents.", recommendation: "Amazon Textract", keyReason: "Goes beyond simple OCR to identify the contents of fields in forms and information in tables." },
      { id: 'ml5', category: 'Analytics', scenario: "Building, training, and deploying custom machine learning models at scale.", recommendation: "Amazon SageMaker", keyReason: "End-to-end platform for the entire machine learning lifecycle." },
      { id: 'ml6', category: 'Analytics', scenario: "Transcribing audio files to text automatically (Speech-to-Text).", recommendation: "Amazon Transcribe", keyReason: "Adds speech-to-text capability to applications and handles various audio formats." },
      { id: 'ml7', category: 'Analytics', scenario: "Analyzing the sentiment of customer reviews (Positive/Negative/Neutral).", recommendation: "Amazon Comprehend", keyReason: "NLP service that uses ML to find insights and relationships in a text." },
      { id: 'ml8', category: 'Analytics', scenario: "Personalizing product recommendations for an e-commerce website.", recommendation: "Amazon Personalize", keyReason: "Enables developers to build applications with the same ML technology used by Amazon.com." },
      { id: 'ml9', category: 'Analytics', scenario: "Adding a natural language chatbot to an application.", recommendation: "Amazon Lex", keyReason: "Build conversational interfaces into any application using voice and text (Powers Alexa)." },
      { id: 'ml10', category: 'Analytics', scenario: "Forecasting future business metrics like sales or inventory levels.", recommendation: "Amazon Forecast", keyReason: "Uses ML to combine time-series data with additional variables for highly accurate forecasts." },
      { id: 'ml11', category: 'Analytics', scenario: "Searching for answers across multiple enterprise data sources (PDFs, FAQs, Intranet).", recommendation: "Amazon Kendra", keyReason: "Intelligent search service powered by machine learning." }
    ]
  }
];
