// App.tsx
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { store } from './src/store/store';
import { theme } from './src/theme';

export default function App() {
    return (
        <ReduxProvider store={store}>
            <PaperProvider theme={theme}>
                <NavigationContainer>
                    <AppNavigator />
                </NavigationContainer>
            </PaperProvider>
        </ReduxProvider>
    );
}

