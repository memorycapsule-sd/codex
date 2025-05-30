// Design System based on UX Mocks
export const colors = {
  // Primary brand colors from UX mocks
  primary: '#42275a', // Updated to match the new gradient start color
  primaryLight: '#734b6d', // Added the gradient end color
  secondary: '#F5B0CB', 
  accent: '#FFD166',
  light: '#F9F7FF',
  dark: '#3D3A50',
  white: '#FFFFFF',
  
  // Semantic colors
  background: '#FFFFFF',
  surface: '#FFFFFF',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Text colors
  text: {
    primary: '#3D3A50',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  
  // Gray scale
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Border colors
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#9CA3AF',
  },
};

export const typography = {
  fontFamily: {
    primary: 'Inter',
    secondary: 'Nunito',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  size: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  fontWeight: {
    light: '100' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  body: {
    fontSize: 16,
    lineHeight: 1.5,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 1.4,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 8,
  },
  primary: {
    shadowColor: '#7C67CB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
};

// Gradient definitions for beautiful UI
export const gradients = {
  // Original gradients
  primary: ['#7C67CB', '#9B7EE8'],
  secondary: ['#F5B0CB', '#FFB8D6'],
  accent: ['#FFD166', '#FFE099'],
  background: ['#F9F7FF', '#FFFFFF'],
  card: ['#FFFFFF', '#F9F7FF'],
  button: ['#7C67CB', '#6B5BB3'],
  header: ['#7C67CB', '#8B73D1'],
  
  // New gradient options
  warmSunset: ['#de6262', '#ffb88c'],     // Warm red to orange
  softPink: ['#ee9ca7', '#ffdde1'],       // Soft pink to light pink
  oceanBlue: ['#2193b0', '#6dd5ed'],      // Deep blue to light blue
  peachyPink: ['#ffafbd', '#ffc3a0'],     // Peachy pink to soft peach
  
  // Theme combinations
  memoryTheme: ['#ffafbd', '#ffc3a0'],    // Our chosen main theme
  accentTheme: ['#42275a', '#734b6d'],    // New deep purple gradient
  buttonTheme: ['#42275a', '#734b6d'],    // Button gradient updated
  purpleTheme: ['#42275a', '#734b6d'],    // Deep purple gradient
  cardTheme: ['#FFFFFF', '#F9F7FF'],      // Card background
};

export const breakpoints = {
  mobile: 0,
  tablet: 768,
  web: 1024,
};

// Container dimensions matching UX mocks
export const layout = {
  container: {
    maxWidth: 384, // md equivalent
    height: 844,
  },
  header: {
    height: 60,
  },
  tabBar: {
    height: 80,
  },
};

// Component variants
export const variants = {
  button: {
    primary: {
      backgroundColor: colors.primary,
      color: colors.text.inverse,
    },
    secondary: {
      backgroundColor: colors.light,
      color: colors.primary,
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: colors.border.medium,
      color: colors.text.primary,
    },
  },
  input: {
    default: {
      borderColor: colors.border.medium,
      backgroundColor: colors.background,
    },
    focused: {
      borderColor: colors.primary,
      backgroundColor: colors.background,
    },
    error: {
      borderColor: colors.error,
      backgroundColor: colors.background,
    },
  },
};

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  gradients,
  breakpoints,
  layout,
  variants,
};
