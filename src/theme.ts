// Design tokens taken from the Figma file ("brand-side").
// Rename the product here once the real brand name is decided (the design uses "xxxxxx").
export const BRAND = 'xxxxxx';

export const C = {
  bg: '#f7f6f8',
  white: '#ffffff',
  text: '#26232d',
  muted: '#74717d',
  muted2: '#575360',
  muted3: '#918d99',
  border: '#eeebf1',
  border2: '#dedbe3',
  tabBorder: '#e9e6ed',
  dark: '#302c36',
  pink: '#e94c87',
  pinkBg: '#fff0f5',
  pinkBg2: '#fde7ef',
  pinkText: '#c92e69',
  green: '#16a34a',
  logoGreen: '#22C55E',
  greenBg: '#e8f7ee',
  amber: '#b54708',
  amberBg: '#fff4e0',
  red: '#f04438',
  redBg: '#fee4e2',
  blue: '#3B82F6',
  indigo: '#6366F1',
  gold: '#ffd166',
};

export const F = {
  reg: 'Inter_400Regular',
  med: 'Inter_500Medium',
  semi: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  xbold: 'Inter_800ExtraBold',
};

export const shadow = {
  shadowColor: '#292335',
  shadowOpacity: 0.055,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 5 },
  elevation: 1,
};

// Indian digit grouping: 142500 -> ₹1,42,500
export function inr(n: number): string {
  const s = Math.round(n).toString();
  if (s.length <= 3) return '₹' + s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return '₹' + rest + ',' + last3;
}
