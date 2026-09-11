import { bootPage } from '../site.js';
import { jobs, highlighted } from '../data/pages.js';
import { wideCard } from '../lib/cards.js';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const label = (t) => `<div class="tab-label"><span class="tab-label__text">${t}</span><span class="tab-label__dot"></span></div>`;
const layers = '<div class="fcard__shade"></div><div class="fcard__grad"></div><div class="fcard__grad-bottom"></div><div class="noise"></div>';

const team = [
  { name: 'Nick<br>Denman', label: 'Quote — 1', role: 'Head of Engineering;<br>Ex-Palantir', image: `${BASE}/assets/images/people/nick-denman.jpg`, quote: 'Coming from Palantir, I was drawn to Ankar AI’s mission to reinvent how innovation happens with AI. Here, I got to tackle meaningful, complex problems alongside a team that’s as passionate about building great technology as they are about learning from one another. Everyday feels like we are building something truly new - combining deep tech with a sense of purpose and camaraderie that makes work genuinely rewarding.' },
  { name: 'William<br>Sweetenham', label: 'Quote — 2', role: 'Machine learning Engineer;<br>Ex-Founder', image: `${BASE}/assets/images/pages/story-first-30-days.jpg`, quote: 'At Ankar AI, I get to work on exciting challenges that push me to grow as both a machine learning engineer and a problem-solver. The team is incredibly supportive, everyone’s open to sharing knowledge and helping each other improve. It’s great to see our ideas take shape into real products that make a meaningful impact for R&amp;D and IP teams around the world.' },
];

function initCareers() {
  const folders = document.getElementById('team-folders');
  folders.innerHTML = team.map((p, i) => `
    <article class="fcard folder tcard${i === 0 ? ' is-open' : ''}">
      <img class="fcard__img" src="${p.image}" alt="" />
      ${layers}
      <div class="fcard__ui">
        ${label(p.label)}
        <div class="fcard__line"></div>
        <div class="fcard__open">
          <h3 class="t-h3 tcard__name">${p.name}</h3>
          <span class="fcard__quote-mark tcard__mark">“</span>
          <p class="t-body tcard__quote">${p.quote}</p>
          <p class="t-mono tcard__role">${p.role}</p>
        </div>
        <div class="fcard__closed"><h3 class="t-h3 fcard__vtitle">${p.name}</h3></div>
      </div>
    </article>`).join('');
  const cards = Array.from(folders.children);
  cards.forEach((c) => c.addEventListener('mouseenter', () => cards.forEach((o) => o.classList.toggle('is-open', o === c))));

  document.getElementById('story-folders').innerHTML = wideCard({ ...highlighted, label: 'Story' });

  let n = 0;
  document.getElementById('jobs').innerHTML = jobs.map((t) => `
    <div class="jobdept"><div class="rule"></div><p class="eyebrow t-mono jobdept__eb"><span class="dot"></span>${t.team}</p></div>
    ${t.roles.map(([title, meta], i) => `
    <div class="job${i === 0 ? ' job--first' : ''}">
      <div class="rule"></div>
      <span class="t-mono job__n">${++n}.</span>
      <h3 class="t-h4 job__title">${title}</h3>
      <span class="t-mono job__meta">${meta}</span>
      <a class="t-mono job__apply" href="#"><u>Apply now &gt;</u></a>
    </div>`).join('')}`).join('');
}

bootPage(initCareers);
