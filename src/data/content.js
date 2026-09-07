// Content pulled from the Figma file (ANKAR — Web, page 3.3, Desktop artboard).
// Keep copy here so sections can be re-rendered without touching markup.

export const pillGroups = [
  {
    title: 'Internal R&D knowledge',
    items: [
      'Experimental and laboratory data',
      'Technical reports and documents',
      'PLM and product records',
      'Transcripts and meeting knowledge',
      'User and customer feedback',
      'Existing inventions and IP',
      'Previous concepts and failed approaches',
      'Expert knowledge and business rules',
    ],
  },
  {
    title: 'External information',
    items: [
      'Scientific and technical publications',
      'Prior art and patent data',
      'Competitive and technology signals',
      'Consumer and market trends',
      'Geopolitical context',
      'Academic networks',
      'Partners, skills and open-innovation ecosystems',
    ],
  },
  {
    title: 'Models and workflows',
    items: [
      'AI models',
      'Technical reasoning',
      'R&D-specific tools',
      'Collaborative workflows',
      'Agentic actions',
    ],
  },
  {
    title: 'Outputs',
    items: [
      'Technical landscapes',
      'New hypotheses and concepts',
      'Alternative approaches',
      'Experimental learning',
      'Opportunity evaluations',
      'Invention capture',
      'Patent and IP outputs',
    ],
  },
];

export const lifecycle = [
  {
    label: 'Sup.E. — 1',
    color: '#ba484f',
    // Figma card 265 is titled "Experiment" but its copy is the landscape/whitespace phase.
    // Using "Explore" so the four phases are distinct. Flagged in the handoff notes.
    title: 'Explore',
    subtitle: 'See the landscape before choosing a direction.',
    body: 'Connect internal knowledge with scientific literature, patents, competitive activity and adjacent fields to uncover whitespace, emerging technologies and new routes forward.',
    listTitle: 'Workflows:',
    list: ['Technology landscaping', 'Whitespace analysis', 'Competitive and technical intelligence', 'Emerging-technology monitoring', 'Opportunity discovery'],
  },
  {
    label: 'Sup.E. — 2',
    color: '#894c6b',
    title: 'Invent',
    subtitle: 'Turn possibilities into stronger, testable concepts.',
    body: 'Bring relevant science, prior work and alternative approaches into the creative process so teams can develop concepts with more context and spend more time testing the most promising ideas.',
    listTitle: 'Potential workflows:',
    list: ['Concept generation', 'Alternative approach generation', 'Design-around exploration', 'Technical problem solving', 'Cross-domain inspiration'],
  },
  {
    label: 'Sup.E. — 3',
    color: '#2f3d86',
    title: 'Experiment',
    subtitle: 'Make every iteration compound.',
    body: 'Preserve experimental context, decisions, results and failed approaches so teams can learn across projects, avoid repeating work and sharpen the next attempt.',
    listTitle: 'Potential workflows:',
    list: ['Experimental knowledge capture', 'Lab knowledge bases', 'Result synthesis', 'Failure analysis', 'Cross-project learning'],
  },
  {
    label: 'Sup.E. — 4',
    color: '#162247',
    title: 'Protect',
    subtitle: 'Turn technical progress into defensible value.',
    body: 'Identify inventions earlier, evaluate what is worth protecting and move from complex R&D to stronger patent assets with less wasted expert time.',
    listTitle: 'Potential workflows:',
    list: ['Invention capture', 'Patentability and novelty analysis', 'Invention evaluation', 'Patent drafting', 'Portfolio and protection decisions'],
  },
];

export const industries = [
  {
    label: 'Case Study — 1',
    title: 'Life sciences',
    image: '/assets/images/industries/life-sciences.jpg',
    caption: 'Capacity to assess or strengthen <b>100-150 more disclosures annually</b> at 50% adoption.',
  },
  {
    label: 'Case Study — 2',
    title: 'Aerospace and<br>defense',
    image: '/assets/images/industries/aerospace.jpg',
    caption: 'A client used Ankar to explore <b>4 distinct invention directions in a single session</b>, selecting <b>3 to take forward</b>.',
  },
  {
    label: 'Case Study — 3',
    title: 'Semiconductors',
    image: '/assets/images/industries/semiconductors.jpg',
    caption: 'A client used Ankar to turn <b>1 seed document and 2 hand-drawn sketches</b> into a complete invention disclosure <b>in under 2 hours</b>, on their first use.',
  },
  {
    label: 'Case Study — 4',
    title: 'Consumer R&amp;D,<br>cosmetics<br>and materials',
    image: '/assets/images/industries/consumer.jpg',
    caption: 'A client uses Ankar to continuously monitor its technology landscape, with around <b>64 potential infringement signals</b> identified annually.',
  },
  {
    label: 'Case Study — 5',
    title: 'Automotive<br>and industrials',
    image: '/assets/images/industries/automotive.jpg',
    caption: 'During a live evaluation, a client used Ankar to surface <b>relevant prior art</b> that its incumbent external research provider had missed.',
  },
];

export const partnerships = [
  { n: '1.', title: 'Integrations', body: 'Wherever your work lives —IP systems, document management or internal repositories, we scope and build the connections your deployment needs. Ankar fits your systems, and your outputs land back where your organization expects them.' },
  { n: '2.', title: 'Workflow configuration', body: 'Every organization works differently. We configure Ankar around your templates, your standards, and the judgement of your most experienced people. The more your teams use it, the more precisely the platform reflects how you work. That’s how the value compounds.' },
  { n: '3.', title: 'Onboarding and enablement', body: 'Adoption is central to our partnership. We onboard every user on their real work Ankar feels like home from the first session. This is how we ensure organizational change sticks after the pilot is over.' },
  { n: '4.', title: 'Forward-deployed support', body: 'We deploy alongside you to ensure we truly understand your organization. Our Deployment Strategists listen, synthesize and solve your challenges — configuring, fixing, and feeding what we learn straight into your product experience. When your usage surfaces a need, we can ship it fast.' },
  { n: '5.', title: 'Hands-on customer success', body: 'Regular working sessions keep your teams learning from each other while you sharpen the platform to adapt to your ways of working. The experience will feel customized, never generic.' },
  { n: '6.', title: 'Ongoing product partnership', body: 'We have a clear view of where this platform is going. Deploying with us means your workflows directly inform that roadmap. Through aggregated partner feedback, we apply our team’s deep product and engineering experience to build the platform our partners need.' },
];

const basePeople = [
  {
    name: 'Wiem<br>Gharbi',
    image: '/assets/images/people/wiem-gharbi.avif',
    role: 'Co-Founder<br>Past: Palantir<br>(CEO’s office, Product, Strategy)',
    logos: ['palantir'],
    bio: 'Wiem Gharbi is Co-Founder of Ankar, an AI platform helping R&D teams make better technology decisions and accelerate innovation.<br><br>An engineer trained in applied mathematics and machine learning at Télécom Paris and École Polytechnique, Wiem spent six years at Palantir, where she worked across product, strategy and the CEO’s office and led complex AI deployments for some of the world’s largest organisations, including teams in life sciences and manufacturing.<br><br>That experience gave her a first-hand view of how difficult it can be for large R&D organisations to turn vast amounts of technical knowledge into better, faster decisions. She co-founded Ankar in 2024 to change that.<br><br>Today, Ankar helps R&D teams understand fast-moving technology landscapes, uncover new opportunities, identify risks earlier and turn day-to-day engineering work into strategic advantage.',
  },
  {
    name: 'Tamar<br>Gomez',
    image: '/assets/images/people/tamar-gomez.avif',
    role: 'Co-Founder<br>Past: Palantir<br>(CEO’s office, Product, Strategy)',
    logos: ['helsing', 'palantir'],
    bio: 'Tamar Gomez is Co-Founder of Ankar, an AI platform helping R&D teams make better technology decisions and accelerate innovation.<br><br>She spent nearly a decade building and deploying advanced AI software for enterprises and governments at Palantir and Helsing, working at the frontier of science, technology and complex decision-making. Tamar holds a PhD in Game Theory from Imperial College London.<br><br>Through that work, she saw first-hand that while technical progress was accelerating, the systems behind innovation remained fragmented, manual and disconnected. She co-founded Ankar in 2024 to change that.<br><br>Today, Ankar connects an organisation’s internal R&D knowledge with external technical change, AI models and purpose-built workflows, helping researchers and innovators explore new possibilities, develop stronger ideas and build on everything their organisation has learned before.',
  },
  {
    name: 'Harm<br>van der Heijden',
    image: '/assets/images/people/harm-van-der-heijden.avif',
    role: 'Head of Patent Innovation<br>Past: NLO (Partner)',
    logos: ['nlo'],
    bio: 'Harm van der Heijden holds a Ph.D. in plasma physics and began his career as a researcher, working at Philips Research and NXP Semiconductors. In 2009 he moved into IP law, joining the patent law firm NLO, becoming a partner in 2016. While at NLO, he led the firm’s search for AI tools to adopt. After nearly two decades in patent practice, he shifted focus to making AI genuinely useful for intellectual property professionals as Head of Patent Innovation at Ankar, a patent and R&D AI platform. In this role, he works to help fit AI into firms’ workflows rather than just handing over a tool and walking away.',
  },
  {
    name: 'Giulia<br>Toti',
    image: '/assets/images/people/giulia-toti.jpg',
    role: 'Life Sciences and Go-to-Market Lead<br>Past: GSK, AstraZeneca',
    logos: ['gsk', 'astra-zeneca'],
    bio: 'Giulia Toti leads Life Sciences and Go-to-Market at Ankar, helping R&D organisations apply AI to some of their most complex innovation challenges.<br><br>She began her career in immuno-oncology R&D at GSK before joining AstraZeneca’s Global Strategy and Insights team. She later advised pharmaceutical, medtech and diagnostics companies on growth, M&A and commercialisation at L.E.K. Consulting, before moving into investing at Montagu Private Equity, where she focused on healthcare, data and digital health businesses.<br><br>Across those roles, Giulia saw the same challenge from different sides: scientific organisations generate enormous amounts of valuable knowledge, but turning that knowledge into better decisions, stronger ideas and faster innovation remains difficult.<br><br>At Ankar, she brings together that experience across science, strategy and technology to shape how the platform supports R&D teams, particularly in life sciences. She works closely with global pharma, biotech and medtech organisations on how AI can help researchers navigate complex technical landscapes, build on existing knowledge and accelerate the path from insight to breakthrough.',
  },
];

// 12 people: the four real bios repeated three times, as requested, until the rest arrive.
export const people = Array.from({ length: 12 }, (_, i) => ({
  ...basePeople[i % basePeople.length],
  label: `People — ${i + 1}`,
}));

export const quotes = [
  {
    label: 'Quote — 1',
    name: 'Jean Yves<br>Legendre',
    image: '/assets/images/people/jean-yves-legendre.avif',
    role: 'IP Intelligence Manager,<br>L’Oréal',
    logo: 'loreal',
    logoSize: [122, 22],
    quote: 'Most vendors came with a fixed solution. With Ankar, they began with our needs. They understood patents, spoke our language, and adapted to our needs by configuring their existing technology into a solution that fits our reality.',
  },
  {
    label: 'Quote — 2',
    name: 'Alain<br>Durand',
    image: '/assets/images/people/alain-durand.webp',
    role: 'IP Engineer,<br>Valeo',
    logo: 'valeo',
    logoSize: [84, 37],
    quote: 'What impressed me was how Ankar invested time into understanding our unique needs as an industrial company. They didn’t just deliver a tool, they delivered results.',
  },
  {
    label: 'Quote — 3',
    name: 'Sabrina<br>Poulos',
    image: '/assets/images/people/sabrina-poulos.jpg',
    role: 'Founding partner,<br>Antheros',
    logo: 'antheros',
    logoSize: [122, 25],
    quote: 'Ankar gives us that extra capacity—it takes away some of the rote, mechanical work and lets us focus on the substantive.',
  },
];
