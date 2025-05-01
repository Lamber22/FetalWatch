import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2196F3',
    secondary: '#1976D2',
    error: '#B00020',
    warning: '#FB8C00',
    success: '#43A047',
    surface: '#FFFFFF',
    background: '#F5F5F5',
  },
  fonts: configureFonts({
    config: {
      fontFamily: 'System',
    },
  }),
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#90CAF9',
    secondary: '#64B5F6',
    error: '#CF6679',
    warning: '#FFB74D',
    success: '#81C784',
    surface: '#1E1E1E',
    background: '#121212',
  },
  fonts: configureFonts({
    config: {
      fontFamily: 'System',
    },
  }),
};

// For backward compatibility
export const theme = lightTheme;

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
  surface: {
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  safeArea: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerStyle: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
});

