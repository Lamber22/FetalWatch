import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const lightTheme = {
  primary: '#FF69B4', // Hot Pink
  secondary: '#FF1493', // Deep Pink
  background: '#FFF0F5', // Lavender Blush
  white: '#FFFFFF',
  text: '#4A4A4A',
  gray: '#95A5A6',
  lightGray: '#FFE4E1', // Misty Rose
  error: '#FF1493', // Deep Pink
  success: '#FF69B4', // Hot Pink
  warning: '#FFB6C1', // Light Pink
  border: '#FFC0CB', // Pink
};

export const darkTheme = {
  primary: '#FF69B4', // Hot Pink
  secondary: '#FF1493', // Deep Pink
  background: '#1A1A1A',
  white: '#2C2C2C',
  text: '#FFE4E1', // Misty Rose
  gray: '#FFB6C1', // Light Pink
  lightGray: '#3C3C3C',
  error: '#FF1493', // Deep Pink
  success: '#FF69B4', // Hot Pink
  warning: '#FFB6C1', // Light Pink
  border: '#404040',
};

export const SIZES = {
  // Global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  // Font sizes
  small: 12,
  medium: 16,
  large: 18,
  extraLarge: 24,

  // App dimensions
  width,
  height,
};

export const SHADOWS = {
  light: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  dark: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
};

// Default theme
export const COLORS = lightTheme; 