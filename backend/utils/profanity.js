import { Filter } from 'bad-words';

const filter = new Filter();

filter.addWords('stupid', 'dumb', 'idiot', 'hate', 'kill', 'die');

export const containsProfanity = (text) => {
  return filter.isProfane(text);
};

export const cleanText = (text) => {
  return filter.clean(text);
};