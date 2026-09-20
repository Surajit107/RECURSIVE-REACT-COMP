export interface NeuPalette {
  bg: string;
  text: string;
  textMuted: string;
  accent: string;
  accentSoft: string;
  shadowDark: string;
  shadowLight: string;
  shadowDarkRgba: string;
  shadowLightRgba: string;
}

export const neuLight: NeuPalette = {
  bg: '#e6e9ef',
  text: '#3d4654',
  textMuted: '#8a93a3',
  accent: '#5b8def',
  accentSoft: '#d9e4f8',
  shadowDark: '#c8ced9',
  shadowLight: '#ffffff',
  shadowDarkRgba: 'rgba(163, 177, 198, 0.45)',
  shadowLightRgba: 'rgba(255, 255, 255, 0.85)',
};

export const neuDark: NeuPalette = {
  bg: '#2a2e35',
  text: '#e4e7ec',
  textMuted: '#9aa3b2',
  accent: '#6ea0ff',
  accentSoft: '#353b48',
  shadowDark: '#1c1f24',
  shadowLight: '#363b44',
  shadowDarkRgba: 'rgba(0, 0, 0, 0.45)',
  shadowLightRgba: 'rgba(255, 255, 255, 0.06)',
};

/** Shape-following raised glow — avoids rectangular box-shadow corner gaps. */
export const raisedDropFilter = (p: NeuPalette): string =>
  `drop-shadow(5px 5px 10px ${p.shadowDarkRgba}) drop-shadow(-4px -4px 10px ${p.shadowLightRgba})`;

export const raisedDropFilterHover = (p: NeuPalette): string =>
  `drop-shadow(6px 6px 12px ${p.shadowDarkRgba}) drop-shadow(-5px -5px 12px ${p.shadowLightRgba})`;

/** Outer raised shadow — prefer raisedDropFilter for rounded interactive surfaces. */
export const raisedShadow = (p: NeuPalette, size = 10): string =>
  `${size}px ${size}px ${size * 2.2}px ${p.shadowDarkRgba}, -${size}px -${size}px ${size * 2.2}px ${p.shadowLightRgba}`;

export const softRaisedShadow = (p: NeuPalette): string =>
  `5px 5px 14px ${p.shadowDarkRgba}, -5px -5px 14px ${p.shadowLightRgba}`;

export const insetShadow = (p: NeuPalette, size = 6): string =>
  `inset ${size}px ${size}px ${size * 2}px ${p.shadowDarkRgba}, inset -${size}px -${size}px ${size * 2}px ${p.shadowLightRgba}`;

export const pressedShadow = (p: NeuPalette): string =>
  `inset 4px 4px 10px ${p.shadowDarkRgba}, inset -4px -4px 10px ${p.shadowLightRgba}`;
