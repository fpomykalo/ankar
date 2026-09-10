const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const img = (p) => `${BASE}/assets/images/${p}`;

/** Customer stories (Resources). */
export const stories = [
  { title: 'Vorys and Ankar:<br>A Collaborative Approach to Patent Law Innovation', label: 'Use case', image: img('pages/vorys-story.avif'), logo: 'vorys', logoSize: [126, 17], meta: 'November 10, 2025 / 3 min read' },
  { title: 'Valeo and Ankar: Amplifying Patent Expertise with AI', label: 'Use case', image: img('people/alain-durand.webp'), logo: 'valeo', logoSize: [84, 36], meta: 'November 15, 2025 / 4 min read' },
  { title: 'L’Oréal and Ankar: Seeing and safeguarding innovation', label: 'Use case', image: img('people/jean-yves-legendre.avif'), logo: 'loreal', logoSize: [122, 22], meta: 'November 10, 2025 / 4 min read' },
];

/** Most recent posts (Resources) and Read next (Article). Photos for the last two are stand-ins until the real ones arrive. */
export const posts = [
  { title: 'CAFC Reverses PTAB Invalidity Findings in Google Hotword Detection Patent Dispute with Sonos', cat: 'Product', image: img('industries/aerospace.jpg'), author: 'Rose Esfandiari<br>Patent Correspondent;<br>IPWatchdog Columnist', meta: 'June 23, 2026 / 5 min read', href: `${BASE}/resources/article/` },
  { title: 'Federal Circuit Upholds No-Infringement Ruling in Actelion Epoprostenol Patent Dispute', cat: 'Community', image: img('industries/semiconductors.jpg'), author: 'Rose Esfandiari<br>Patent Correspondent;<br>IPWatchdog Columnist', meta: 'May 19, 2026 / 5 min read', href: `${BASE}/resources/article/` },
  { title: 'Senior Patent Partner Joins Ankar as Head of Patent Innovation', cat: 'Announcements', image: img('industries/consumer.jpg'), author: 'Preston Teng<br>Narratives, Ankar', meta: 'June 1, 2026 / 3 min read', href: `${BASE}/resources/article/` },
];

export const highlighted = { title: 'My First 30 Days at Ankar:<br>Autonomy, Debugging,<br>Deadlines, and Discovery', label: 'Announcements', image: img('people/william-sweetenham.jpg'), author: 'Manick Vennimalai<br>Machine Learning Engineer', meta: 'November 7, 2025 / 7 min read', href: `${BASE}/resources/article/` };

export const news = [
  { title: 'Patent Startup Ankar Raises $20M in Series A Round', source: 'law.com' },
  { title: 'Ankar raises $20M in Series A funding led by Atomico to transform how...', source: 'Ankar AI' },
  { title: 'London’s Ankar bags $20M led by Atomico for end-to-end AI patent OS', source: 'Tech Funding News' },
  { title: 'Deux Françaises passées par Palantir lèvent 20 millions de dollars...', source: 'Maddyness' },
  { title: 'Ankar Bags $20m For AI-Driven Patent Platform', source: 'Artificial Lawyer' },
];

/** Careers: open roles by team. */
export const jobs = [
  { team: 'Product &amp; Engineering', roles: [
    ['Product Marketing Manager', 'London / Full time / Hybrid'],
    ['Senior Product Engineer', 'London; New York / Full time / On-site'],
    ['Product Manager', 'New York / Full time / Hybrid'],
    ['Product Engineer', 'London / Full time / Hybrid'],
  ] },
  { team: 'Go-to-Market &amp; Customer Innovation', roles: [
    ['Patent Product Engineer', 'London; New York / Full time / On-site'],
    ['GTM, Strategy &amp; Delivery', 'New York / Full time / Hybrid'],
  ] },
  { team: 'Sales &amp; Business Development', roles: [
    ['Founding Account Executive - US', 'London / Full time / Hybrid'],
    ['US Sales Lead', 'London; New York / Full time / On-site'],
    ['Account Executive', 'New York / Full time / Hybrid'],
  ] },
  { team: 'People &amp; Operations', roles: [
    ['Talent Partner', 'London; New York / Full time / On-site'],
    ['Finance Partner', 'New York / Full time / Hybrid'],
  ] },
];

/** Security: the three pillars. Only the second has copy in Figma so far. */
export const securityItems = [
  { n: '1.', title: 'Strict No-Data Sharing<br>and Training Policy', body: 'We strictly safeguard your data by never sharing it with third parties, affiliates, or sub-processors without your explicit authorization. Your information stays private and secure, giving you full confidence in our commitment to protect your intellectual property at every step.', rows: [
    ['1.1', 'No Model Training on Client Data: Your data is never used to train any AI models.'],
    ['1.2', 'No Data Sharing: Data is never shared with third parties, affiliates, or sub-processors without explicit authorization.'],
  ] },
  { n: '2.', title: 'Enterprise-Grade<br>Security Infrastructure', body: 'Our platform ensures full segregation of customer data within a secure multi-tenant environment, with all information encrypted both in transit and at rest. Strict role-based access controls, multi-factor authentication, and comprehensive audit logs safeguard against unauthorized access. Additionally, we offer flexible data hosting options with servers located in the US or the EU, tailored to meet your compliance and security requirements.', rows: [
    ['2.1', 'Fully segregated customer data in a multi-tenant environment.'],
    ['2.2', 'Encryption: All data is encrypted in transit and at rest.'],
    ['2.3', 'Access Controls: Strict role-based access, robust user authentication with MFA, and audit logs protect against unauthorized access.'],
    ['2.4', 'Flexible data hosting options with servers located in the US or the EU to meet your compliance and security requirements.'],
  ] },
  { n: '3.', title: 'Transparent &amp; Auditable', body: 'We work with industry-leading partners to conduct independent, rigorous assessments of our web and network defenses, ensuring robust protection. Full activity logging enables transparent customer-side monitoring, while our comprehensive security posture is fully auditable through our dedicated trust center portal for maximum transparency and confidence.', rows: [
    ['3.1', 'Independent assessments: we partner with industry leaders to rigorously test our web and network defenses.'],
    ['3.2', 'Full activity logging for customer-side monitoring.'],
    ['3.3', 'Our security posture is auditable on our trust center portal.'],
  ] },
];
