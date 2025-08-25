import { Dimensions } from 'react-native';
import { Platform } from 'react-native';

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

export const COLORS = {
  primary: '#5271FF',
  secondary: '#6C63FF',
  accent: '#38B2AC',

  // Text
  text: '#333333',
  darkText: '#333333',
  lightText: '#F5F5F5',

  // Background
  background: '#F8F9FA',
  darkBackground: '#1A202C',

  // Utils
  white: '#FFFFFF',
  black: '#000000',
  gray: '#808080',
  lightGray: '#D3D3D3',
  error: '#FF5252',
  warning: '#FFB74D',
  success: '#4CAF50',
  info: '#2196F3',

  // Border
  border: '#E2E8F0',
  darkBorder: '#2D3748',

  // Status
  high: '#FF5252',
  medium: '#FFB74D',
  low: '#4CAF50',
};

export const SIZES = {
  // Font sizes
  extraSmall: 10,
  small: 12,
  font: 14,
  medium: 16,
  large: 20,
  extraLarge: 24,

  // Radius
  radius: 8,

  // Padding and margin
  base: 8,
  padding: 16,
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System-Bold',
};



export const SHADOWS = {
  light: Platform.OS === 'web'
    ? {
        boxShadow: '0px 2px 3px rgba(0,0,0,0.1)',
      }
    : {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      },
  medium: Platform.OS === 'web'
    ? {
        boxShadow: '0px 4px 6px rgba(0,0,0,0.2)',
      }
    : {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
      },
  dark: Platform.OS === 'web'
    ? {
        boxShadow: '0px 6px 8px rgba(0,0,0,0.3)',
      }
    : {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      },
};