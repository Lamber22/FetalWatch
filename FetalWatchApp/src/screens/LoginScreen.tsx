import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
    navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        const testEmail = 'admin@gmail.com';
        const testPassword = 'admin';

        if (email === testEmail && password === testPassword) {
            try {
                await AsyncStorage.setItem('token', 'dummyTokenForTesting');
                navigation.navigate('Home');
            } catch (err) {
                setErrorMessage('Error storing token');
            }
        } else {
            setErrorMessage('Invalid login credentials');
        }
    };

    const handleRequestRegistration = () => {
        navigation.navigate('Registration'); // Assuming you have a registration request screen
    };

    return (
        <View style={styles.container}>
            {/* Logo Section */}
            <View style={styles.logoContainer}>
                <Image source={require('../assets/fetalwatch-logo.png')} style={styles.logo} />
                {/* <Text style={styles.title}>FetalWatch</Text> */}
                <Text style={styles.subtitle}>Monitor your baby's health with ease</Text>
            </View>

            {/* Form */}
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
            />
            {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

            {/* Login Button */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity onPress={() => {}}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Request Registration */}
            <View style={styles.registrationRequestContainer}>
                <Text style={styles.requestText}>Don't have an account?</Text>
                <TouchableOpacity onPress={handleRequestRegistration}>
                    <Text style={styles.requestLink}>Request registration</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 30,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 50,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#d368e4',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    forgotPassword: {
        color: '#666',
        marginTop: 15,
    },
    errorMessage: {
        color: 'red',
        marginBottom: 15,
    },
    registrationRequestContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    requestText: {
        color: '#666',
        marginRight: 5,
    },
    requestLink: {
        color: '#007bff', // Blue color for the link
        textDecorationLine: 'underline',
    },
});

export default LoginScreen;
