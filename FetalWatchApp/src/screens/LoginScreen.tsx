// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AuthForm from '../components/AuthForm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
    navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async ({ email, password }: { email: string; password: string }) => {
        // Simulate login for testing purposes
        const testEmail = 'fetalwatch@gmail.com';
        const testPassword = 'admin';

        if (email === testEmail && password === testPassword) {
            try {
                // Simulate setting a token in AsyncStorage
                await AsyncStorage.setItem('token', 'dummyTokenForTesting');
                navigation.navigate('Home'); // Navigate to Home screen on successful login
            } catch (err) {
                setErrorMessage('Error storing token');
            }
        } else {
            setErrorMessage('Invalid login credentials'); // Set error message for invalid credentials
        }
    };

    return (
        <View style={styles.container}>
            <AuthForm
                headerText="Login to FetalWatch"
                errorMessage={errorMessage}
                onSubmit={handleLogin}
                submitButtonText="Login"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default LoginScreen;
