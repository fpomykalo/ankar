/** The phone layout (Figma "Mobile", 393 wide) applies under 768px. Scripts branch on it once, at boot. */
const mq = window.matchMedia('(max-width: 767px)');
export const isMobile = () => mq.matches;
