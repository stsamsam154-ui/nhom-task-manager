export const SEASON_CONFIG = {
  todo: {
    id: 'todo',
    label: '🌸 Todo',
    light: { bg: '#F4F8F3', accent: '#B7D8B0', text: '#2D5A27', particle: '#F7DDE2' },
    dark: { bg: '#1A231B', accent: '#4E6B50', text: '#B7D8B0', particle: '#EFCAD3' },
  },
  inprogress: {
    id: 'inprogress',
    label: '☀️ In Progress',
    light: { bg: '#EDF7FF', accent: '#7DB7E8', text: '#1A4A7A', particle: '#FFD166' },
    dark: { bg: '#16212D', accent: '#355C7D', text: '#7DB7E8', particle: '#FFE08A' },
  },
  review: {
    id: 'review',
    label: '🍂 Review',
    light: { bg: '#FFF8F0', accent: '#E6B17E', text: '#7A3D0A', particle: '#D98A43' },
    dark: { bg: '#241C15', accent: '#7B5731', text: '#E6B17E', particle: '#E0A060' },
  },
  done: {
    id: 'done',
    label: '❄️ Done',
    light: { bg: '#F4FAFF', accent: '#B8D7F0', text: '#1A3D5C', particle: '#D9ECFF' },
    dark: { bg: '#161D24', accent: '#4A6480', text: '#B8D7F0', particle: '#CFE6FF' },
  },
};

export const COLUMNS = Object.values(SEASON_CONFIG);

export const QUOTES = [
  '"Every task has its season."',
  '"Done is better than perfect."',
  '"Small progress is still progress."',
  '"One task at a time, one day at a time."',
  '"Focus on progress, not perfection."',
  '"Great things take time. ❄️"',
];

export const AVATAR_EMOJIS = {
  cat:'🐱', dog:'🐶', fox:'🦊', panda:'🐼', rabbit:'🐰',
  bear:'🐻', tiger:'🐯', koala:'🐨', frog:'🐸', penguin:'🐧',
  lion:'🦁', cow:'🐮', pig:'🐷', octopus:'🐙', unicorn:'🦄',
  dragon:'🐲', monkey:'🐵', chicken:'🐔', duck:'🦆', owl:'🦉',
  squirrel:'🐿️', hamster:'🐹', wolf:'🐺', elephant:'🐘',
};

export const getAvatarEmoji = (id) => AVATAR_EMOJIS[id] || '🐱';