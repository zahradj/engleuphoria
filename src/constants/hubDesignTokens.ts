// Centralized design tokens for each hub experience level

export const HUB_TOKENS = {
  academy: {
    primary: '234 75% 30%',       // #1A237E deep navy
    primaryHex: '#1A237E',
    success: '122 39% 49%',       // #4CAF50 forest green
    successHex: '#4CAF50',
    bg: '#FAFBFC',
    bgSecondary: '#F1F5F9',
    text: '#1E293B',
    textMuted: '#64748B',
    border: '#E2E8F0',
    radius: '8px',
    font: "'Inter', system-ui, sans-serif",
    cardShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
    cardHoverShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  playground: {
    primary: '33 100% 55%',       // #FF9F1C warm orange
    primaryHex: '#FF9F1C',
    success: '122 39% 49%',       // #4CAF50
    successHex: '#4CAF50',
    bg: {
      day: '#E3F2FD',
      night: '#1A1040',
    },
    bgSecondary: {
      day: '#BBDEFB',
      night: '#2D1B69',
    },
    text: {
      day: '#1A1A2E',
      night: '#E8E0F0',
    },
    textMuted: {
      day: '#5C6BC0',
      night: '#9FA8DA',
    },
    border: {
      day: '#90CAF9',
      night: '#4A148C',
    },
    radius: '24px',
    font: "'Inter', system-ui, sans-serif",
    skyBlue: '#87CEEB',
    deepPurple: '#2D1B69',
  },
  professional: {
    primary: '160 84% 39%',       // #059669 emerald
    primaryHex: '#059669',
    success: '160 84% 39%',
    successHex: '#059669',
    bg: '#F8FAFC',
    bgSecondary: '#F1F5F9',
    text: '#1E293B',
    textMuted: '#64748B',
    border: '#E2E8F0',
    radius: '8px',
    font: "'Inter', system-ui, sans-serif",
    cardShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
} as const;

export type HubType = keyof typeof HUB_TOKENS;
