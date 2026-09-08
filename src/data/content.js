const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

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
    image: `${BASE}/assets/images/industries/life-sciences.jpg`,
    caption: 'Capacity to assess or strengthen <b>100-150 more disclosures annually</b> at 50% adoption.',
  },
  {
    label: 'Case Study — 2',
    title: 'Aerospace and<br>defense',
    image: `${BASE}/assets/images/industries/aerospace.jpg`,
    caption: 'A client used Ankar to explore <b>4 distinct invention directions in a single session</b>, selecting <b>3 to take forward</b>.',
  },
  {
    label: 'Case Study — 3',
    title: 'Semiconductors',
    image: `${BASE}/assets/images/industries/semiconductors.jpg`,
    caption: 'A client used Ankar to turn <b>1 seed document and 2 hand-drawn sketches</b> into a complete invention disclosure <b>in under 2 hours</b>, on their first use.',
  },
  {
    label: 'Case Study — 4',
    title: 'Consumer R&amp;D,<br>cosmetics<br>and materials',
    openTitle: 'Consumer R&amp;D,<br>cosmetics and materials',
    image: `${BASE}/assets/images/industries/consumer.jpg`,
    caption: 'A client uses Ankar to continuously monitor its technology landscape, with around <b>64 potential infringement signals</b> identified annually.',
  },
  {
    label: 'Case Study — 5',
    title: 'Automotive<br>and industrials',
    openTitle: 'Automotive<br>and industrials',
    image: `${BASE}/assets/images/industries/automotive.jpg`,
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
    image: `${BASE}/assets/images/people/wiem-gharbi.avif`,
    role: 'Co-Founder<br>Past: Palantir (CEO’s office, Product, Strategy)',
    logos: ['palantir'],
    bio: 'Wiem Gharbi is Co-Founder of Ankar, an AI platform helping R&D teams make better technology decisions and accelerate innovation.<br><br>An engineer trained in applied mathematics and machine learning at Télécom Paris and École Polytechnique, Wiem spent six years at Palantir, where she worked across product, strategy and the CEO’s office and led complex AI deployments for some of the world’s largest organisations, including teams in life sciences and manufacturing.<br><br>That experience gave her a first-hand view of how difficult it can be for large R&D organisations to turn vast amounts of technical knowledge into better, faster decisions. She co-founded Ankar in 2024 to change that.<br><br>Today, Ankar helps R&D teams understand fast-moving technology landscapes, uncover new opportunities, identify risks earlier and turn day-to-day engineering work into strategic advantage.',
  },
  {
    name: 'Tamar<br>Gomez',
    image: `${BASE}/assets/images/people/tamar-gomez.avif`,
    role: 'Co-Founder<br>Past: Palantir, Helsing',
    logos: ['helsing', 'palantir'],
    bio: 'Tamar Gomez is Co-Founder of Ankar, an AI platform helping R&D teams make better technology decisions and accelerate innovation.<br><br>She spent nearly a decade building and deploying advanced AI software for enterprises and governments at Palantir and Helsing, working at the frontier of science, technology and complex decision-making. Tamar holds a PhD in Game Theory from Imperial College London.<br><br>Through that work, she saw first-hand that while technical progress was accelerating, the systems behind innovation remained fragmented, manual and disconnected. She co-founded Ankar in 2024 to change that.<br><br>Today, Ankar connects an organisation’s internal R&D knowledge with external technical change, AI models and purpose-built workflows, helping researchers and innovators explore new possibilities, develop stronger ideas and build on everything their organisation has learned before.',
  },
  {
    name: 'Harm<br>van der Heijden',
    image: `${BASE}/assets/images/people/harm-van-der-heijden.avif`,
    role: 'Head of Patent Innovation<br>Past: NLO (Partner)',
    logos: ['nlo'],
    bio: 'Harm van der Heijden holds a Ph.D. in plasma physics and began his career as a researcher, working at Philips Research and NXP Semiconductors. In 2009 he moved into IP law, joining the patent law firm NLO, becoming a partner in 2016. While at NLO, he led the firm’s search for AI tools to adopt. After nearly two decades in patent practice, he shifted focus to making AI genuinely useful for intellectual property professionals as Head of Patent Innovation at Ankar, a patent and R&D AI platform. In this role, he works to help fit AI into firms’ workflows rather than just handing over a tool and walking away.',
  },
  {
    name: 'Giulia<br>Toti',
    image: `${BASE}/assets/images/people/giulia-toti.jpg`,
    role: 'Life Sciences and Go-to-Market Lead<br>Past: GSK, AstraZeneca',
    logos: ['gsk', 'astra-zeneca'],
    bio: 'Giulia Toti leads Life Sciences and Go-to-Market at Ankar, helping R&D organisations apply AI to some of their most complex innovation challenges.<br><br>She began her career in immuno-oncology R&D at GSK before joining AstraZeneca’s Global Strategy and Insights team. She later advised pharmaceutical, medtech and diagnostics companies on growth, M&A and commercialisation at L.E.K. Consulting, before moving into investing at Montagu Private Equity, where she focused on healthcare, data and digital health businesses.<br><br>Across those roles, Giulia saw the same challenge from different sides: scientific organisations generate enormous amounts of valuable knowledge, but turning that knowledge into better decisions, stronger ideas and faster innovation remains difficult.<br><br>At Ankar, she brings together that experience across science, strategy and technology to shape how the platform supports R&D teams, particularly in life sciences. She works closely with global pharma, biotech and medtech organisations on how AI can help researchers navigate complex technical landscapes, build on existing knowledge and accelerate the path from insight to breakthrough.',
  },
];

// Ankar's Patent Expert Panel (content supplied by the client). Roles are set in
// the same sentence case the rest of the build uses for mono labels.
const P = (...paras) => paras.join('<br><br>');
const advisors = [
  {
    name: 'Kimiya<br>Shams',
    image: `${BASE}/assets/images/people/kimiya-shams.avif`,
    role: 'General Counsel, Devialet<br>Ankar Patent Expert Panel',
    logos: [],
    bio: P(
      'Kimiya brings over 15 years of global experience across technology, luxury, entertainment, and highly regulated industries. She has built her career at the intersection of innovation, law, and business strategy; advising cutting-edge companies on intellectual property, product development, regulatory frameworks, AI adoption, and global go-to-market execution.',
      'A recognized voice in the legal and tech ecosystem, Kimiya has authored multiple publications on AI, emerging technologies, intellectual property, and global regulatory landscapes, shaping industry dialogue on responsible innovation. In parallel, she is deeply committed to education and talent development, serving as a lecturer and guest speaker at HEC Paris, ESCP Business School, EDHEC, and Columbia Law School, where she teaches on topics spanning intellectual property, technology, management and the future of digital regulation.',
      'Her background includes leadership roles in the U.S. and Europe, guiding organizations through complex legal, compliance, and operational challenges while enabling them to scale responsibly and creatively. Kimiya has worked with major brands and companies in technology, luxury, entertainment and emerging tech innovators, bringing a multi-sector perspective that aligns directly with Ankar AI’s mission.',
    ),
  },
  {
    name: 'Robert (Bob)<br>Hulse',
    image: `${BASE}/assets/images/people/robert-hulse.avif`,
    role: 'Head of Patent Prosecution, Fenwick and West<br>Ankar Patent Expert Panel',
    logos: [],
    bio: P(
      'Bob advises clients in the computer software, electronics, electromechanical and medical devices, digital healthcare and electronic media industries. His holistic approach to building patent portfolios is strengthened by his extensive experience in intellectual property due diligence on both sides of M&A and financing transactions. Companies in the earlier stages rely on Bob to establish strong patent programs as they grow from industry newcomers to household names. He worked alongside Facebook to secure their first patent, on the Newsfeed, and many other fundamental patents such as the Like button, Check-In feature, privacy controls for social media, Social Ads and more. Bob was also the original patent attorney for Instacart and successfully grew their portfolio in the lead-up to their IPO.',
      'In addition to providing legal services for his clients, Bob has served as an adjunct professor at the University of California College of the Law, San Francisco, teaching patent drafting and prosecution. He is also a member of the faculty at the Practising Law Institute and has lectured on topics related to patent law at the University of Washington School of Law, Dalhousie University and the National University of Singapore.',
    ),
  },
  {
    name: 'Jean-Christophe<br>Simon',
    image: `${BASE}/assets/images/people/jean-christophe-simon.avif`,
    role: 'Former Group Innovation Officer at Groupe SEB<br>Ankar Patent Expert Panel',
    logos: [],
    bio: P(
      'Jean-Christophe brings more than 30 years of leadership experience spanning Research & Development, innovation strategy and intellectual property. His work cuts across a broad range of industries, including defense, cosmetics, consumer goods, custom industrial machines, optics and medical devices, with deep experience in turning technological advances into products that markets actually adopt.',
      'He has held senior R&D and innovation roles at some of the world’s leading industrial groups, including L’Oréal, Kao Corporation, Essilor-Nikon, Groupe SEB and Thuasne. As Group Innovation Officer at Groupe SEB, he served on the executive committee, built the group’s open innovation and was strongly involved in corporate venture capabilities.',
      'Earlier in his career, he led international research operations from Japan, an experience that shaped his approach to managing teams and reading global markets across Europe and Asia.',
      'Today he is the founder of Calsoï, an innovation strategy and R&D advisory firm working with large industrial groups, mid-sized companies and deeptech startups. He advises on innovation roadmaps, fractional R&D management, intellectual property strategy and the sale of technology companies, bringing the dual perspective of a scientist and a senior executive.',
    ),
  },
  {
    name: 'Tony<br>Shaw',
    image: `${BASE}/assets/images/people/tony-shaw.avif`,
    role: 'Partner, Allens Patent & Trade Mark Attorneys<br>Ankar Patent Expert Panel',
    logos: [],
    bio: P(
      'Tony builds global IP assets in a wide range of technologies to provide clients with defensible IP portfolios as a foundation for growth.',
      'Tony advises clients in biotech, pharma, medtech and digital health. He brings a detailed and global view to building patent portfolios informed by his years leading a research group and over 20 years as a patent attorney with a significant portion of that being contentious work. He also has experience in intellectual property due diligence and technical aspects of patent litigation. With over 15 years in ‘Big Law’ he has also had significant exposure to adjacent areas of law. Early-stage companies and research institutions engage Tony to advise on and build sustainable patent portfolios to support investment and growth. He has worked with some of Australia’s leading research institutions as they commercialise early-stage technologies, has assisted multiple startups from inception through to public listings and represents small to medium sized businesses as well as global biotech and pharma companies.',
      'In addition to providing patent attorney services for his clients, Tony is actively implementing AI solutions into his team’s daily practice including the adoption of commercially available solutions and developing his own life sciences specific patent tools.',
      'Tony is recognised in the IAM 1000 and Patent Strategy 300 as a ManagingIP Patent Star. He is a fellow of the Royal Society of Medicine and a fellow of the Australian Institute of Patent and Trade Mark Attorneys.',
    ),
  },
  {
    name: 'Dan<br>Enebo',
    image: `${BASE}/assets/images/people/dan-enebo.avif`,
    role: 'Former Chief IP Counsel at Cargill<br>Ankar Patent Expert Panel',
    logos: [],
    bio: P(
      'Daniel Enebo brings more than 30 years of strategic leadership experience spanning Research & Development and Intellectual Property law. His work encompasses a broad range of technology domains, including medical devices, food chemistry, biotechnology, complex global trading systems, large-scale manufacturing, and the IT platforms that support them.',
      'He most recently served as Senior Vice President and Chief Intellectual Property Counsel at Cargill, Incorporated, where he led the global IP legal function and guided the company’s enterprise-wide strategy for creating, protecting, and deploying intellectual property. His responsibilities included IP strategy across diverse business units, technology development and licensing, IP leadership in complex M&A and joint venture transactions, freedom-to-operate analysis, enforcement, and numerous initiatives to enhance legal practice efficiency and strengthen outside counsel collaboration through IP-focused IT systems.',
      'A recognized leader in the IP field, he served for many years on the Intellectual Property Owners Association Board, including roles as an officer and member of its Executive Committee. Earlier in his career, he practiced IP law at Fredrikson & Byron in Minneapolis and served as a Senior Scientist and R&D Team Leader at a multinational medical device company.',
    ),
  },
  {
    name: 'Helene Laville<br>Fiorucci',
    image: `${BASE}/assets/images/people/helene-laville-fiorucci.avif`,
    role: 'Former Lead Patent Counsel at Solvay<br>Ankar Patent Expert Panel',
    logos: [],
    bio: P(
      'Helene Fiorucci is an IP strategist and fractional Chief IP Officer supporting deeptech startups in building strong, investment-ready intellectual property.',
      'With more than 22 years of experience as a patent attorney, qualified in both European and U.S. patent laws, and a scientific background in biotechnology, pharmacology and organic chemistry, she helps founders secure IP assets that attract investors, protect competitive advantage, and drive long-term growth.',
      'In 2022, she founded her own patent law practice in the U.S., following several years in a large IP law firm and in industry. She has handled a wide variety of situations, from portfolio strategy and prosecution to pre-litigation and litigation across Germany, China, and the USA.',
      'Helene advises across the full innovation lifecycle, from early-stage invention harvesting and patent drafting to global portfolio management and IP due diligence. She works closely with scientific teams in biotechnology, advanced materials, polymers, energy storage, and antibody engineering, translating complex R&D into clear, defensible IP positions. She also collaborates with venture capital firms to assess IP strength during due diligence and support informed investment decisions.',
      'Known for her strategic and pragmatic approach, Helene partners with founders, CTOs and investors to develop IP strategies tailored to both technical realities and business objectives. Her mission is to help deeptech companies build high-value IP that supports commercial success.',
    ),
  },
  {
    name: 'Stephan<br>Nößner',
    image: `${BASE}/assets/images/people/stephan-noessner.avif`,
    role: 'Patent Counsel Lead, Bosch<br>Ankar Patent Expert Panel',
    logos: [],
    bio: P(
      'Stephan Nößner brings over a decade of experience at the intersection of technology, law, and business strategy, with a distinguished career in the intellectual property department of a leading global technology company, Robert Bosch GmbH. He has built his expertise advising on the strategic protection and commercialization of innovation, from initial patent filings to the enforcement and monetization of IP rights.',
      'A key aspect of Stephan’s work is his profound experience in leveraging Artificial Intelligence for a wide range of patent-related tasks, including patent searches, strategy, prosecution, and litigation preparation. His expertise in applying advanced technology across the IP sector makes him a crucial advisor for innovative startups.',
      'Stephan’s background is marked by deep technical and legal knowledge, complemented by international research experience at Johns Hopkins University. He holds a PhD in Applied Physics and is a qualified German Patent Attorney, European Patent Attorney, and a Representative before the Unified Patent Court. His specializations include IP pricing, international license negotiations, and managing patent portfolios in high-tech fields such as ADAS, artificial intelligence, sensor technology, and vehicle communication. At Bosch, he has been involved with IP marketing, the licensing of standard-essential patents, and international R&D negotiations.',
      'In 2024, Stephan founded his own patent law firm, Noessner-IP, which focuses on providing strategic IP services to unlock the full commercial potential of clients’ innovations, with a particular emphasis on supporting startups and investors. His comprehensive perspective, which merges a deep understanding of technology with proven business acumen, enables him to guide companies, particularly emerging ventures, in transforming their intellectual property into powerful, value-generating assets.',
    ),
  },
  {
    name: 'Carlo<br>Cotrone',
    image: `${BASE}/assets/images/people/carlo-cotrone.avif`,
    role: 'Former Chief IP Counsel at Techtronic Industries<br>Ankar Patent Expert Panel',
    logos: [],
    bio: P(
      'Carlo Cotrone is an IP consultant, attorney, and former chief IP counsel and law firm partner with over 25 years’ experience. At Quartal IP, he helps law firms and companies drive enhanced profitability and business outcomes through practice optimization, collaboration and business development strategies, and leadership development.',
      'A recognized thought leader, Carlo is a prolific author and speaker and serves as Adjunct Professor of Law at University of Houston Law Center.',
      'He received law and electrical engineering degrees from Marquette University and is a registered patent attorney with the United States Patent and Trademark Office. He is the inventor of two US patents directed to digital sheet music technology.',
    ),
  },
  {
    name: 'Bart<br>Jansen',
    image: `${BASE}/assets/images/people/bart-jansen.avif`,
    role: 'Former Patent Attorney at AAK, Corbion, Zacco<br>Ankar Patent Expert Panel',
    logos: [],
    bio: P(
      'Bart Jansen has over 20 years of experience as a patent attorney, with a focus on life sciences. Qualified as a Dutch and European Patent attorney, Bart has worked for several years in private practice, and was a partner at the international patent firm Zacco, handling hundreds of patents on many different life sciences topics. After private practice, Bart has been an IP manager and patent attorney for over 10 years at innovative multinational companies, including food ingredients company Bunge Loders Croklaan, and biotech company Corbion. Bart studied Chemistry at Utrecht University, and holds a PhD from Leiden University.',
      'At the core of a patent attorney’s job is the identification of patentable inventions from research and development output, and selecting the appropriate patenting strategy, building a patent portfolio that supports the underlying business strategy. Ankar’s AI tools are a great help in keeping this process efficient and consistent. Bart enjoys contributing to the further improvement of Ankar’s dedicated tools for chemical and life sciences patents.',
    ),
  },
];

export const people = [...basePeople, ...advisors].map((p, i) => ({ ...p, label: `People — ${i + 1}` }));

export const quotes = [
  {
    label: 'Quote — 1',
    name: 'Jean Yves<br>Legendre',
    image: `${BASE}/assets/images/people/jean-yves-legendre.avif`,
    role: 'IP Intelligence Manager,<br>L’Oréal',
    logo: 'loreal',
    logoSize: [122, 22],
    quote: 'Most vendors came with a fixed solution. With Ankar, they began with our needs. They understood patents, spoke our language, and adapted to our needs by configuring their existing technology into a solution that fits our reality.',
  },
  {
    label: 'Quote — 2',
    name: 'Alain<br>Durand',
    image: `${BASE}/assets/images/people/alain-durand.webp`,
    role: 'IP Engineer,<br>Valeo',
    logo: 'valeo',
    logoSize: [84, 37],
    quote: 'What impressed me was how Ankar invested time into understanding our unique needs as an industrial company. They didn’t just deliver a tool, they delivered results.',
  },
  {
    label: 'Quote — 3',
    name: 'Sabrina<br>Poulos',
    image: `${BASE}/assets/images/people/sabrina-poulos.jpg`,
    role: 'Founding partner,<br>Antheros',
    logo: 'antheros',
    logoSize: [122, 25],
    quote: 'Ankar gives us that extra capacity—it takes away some of the rote, mechanical work and lets us focus on the substantive.',
  },
];
