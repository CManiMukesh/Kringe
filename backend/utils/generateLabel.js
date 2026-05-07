const adjectives = [
  'Ghost', 'Sleepy', 'Void', 'Rogue', 'Cursed', 'Silent', 'Neon', 'Wild',
  'Cosmic', 'Chaos', 'Frost', 'Ember', 'Drift', 'Echo', 'Static', 'Glitch'
];

const nouns = [
  'Mango', 'Panda', 'Rat', 'Goblin', 'Potato', 'Fox', 'Whale', 'Raven',
  'Moth', 'Spirit', 'Wizard', 'Shroom', 'Orb', 'Sock', 'Toast', 'Sphinx'
];

export const generateAnonymousLabel = () => {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj} ${noun}`;
};