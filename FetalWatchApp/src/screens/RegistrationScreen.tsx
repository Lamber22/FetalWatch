// src/screens/RegistrationScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type RegistrationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Registration'>;

type Props = {
    navigation: RegistrationScreenNavigationProp;
};

const RegistrationScreen: React.FC<Props> = ({ navigation }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('healthProvider');
    const [errorMessage, setErrorMessage] = useState('');

    const handleRegistration = async () => {
        if (!firstName || !lastName || !email || !password) {
            setErrorMessage('Please fill all the fields');
            return;
        }

        const userData = {
            firstName,
            lastName,
            email,
            password,
            role,
        };

        // Replace this with your actual API call to register the user
        try {
            // Mock API call to simulate registration
            const response = await fetch('http://your-backend-api-url/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const result = await response.json();

            if (response.ok) {
                // Store the token in AsyncStorage
                await AsyncStorage.setItem('token', result.token);
                navigation.navigate('Home'); // Navigate to Home screen after successful registration
            } else {
                setErrorMessage(result.message || 'Registration failed');
            }
        } catch (error) {
            setErrorMessage('Error during registration');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Register for FetalWatch</Text>
            {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="none"
                autoCorrect={false}
            />

            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="none"
                autoCorrect={false}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
            />

            <Text style={styles.label}>Role:</Text>
            <Picker
                selectedValue={role}
                style={styles.picker}
                onValueChange={(itemValue: string) => setRole(itemValue)}>
                <Picker.Item label="Health Provider" value="healthProvider" />
                <Picker.Item label="Doctor" value="doctor" />
                <Picker.Item label="Nurse" value="nurse" />
                <Picker.Item label="Midwife" value="midwife" />
            </Picker>

            <TouchableOpacity style={styles.button} onPress={handleRegistration}>
                <Text style={styles.buttonText}>Request Registration</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Already have an account? Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    headerText: {
        fontSize: 24,
        marginBottom: 16,
        fontWeight: 'bold',
    },
    errorMessage: {
        color: 'red',
        marginBottom: 16,
    },
    input: {
        width: '100%',
        padding: 12,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    label: {
        width: '100%',
        marginVertical: 8,
        fontSize: 16,
        color: '#333',
    },
    picker: {
        width: '100%',
        marginVertical: 8,
    },
    button: {
        width: '100%',
        padding: 12,
        backgroundColor: '#d368e4',
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    linkText: {
        marginTop: 16,
        color: '#007BFF',
        textDecorationLine: 'underline',
    },
});

export default RegistrationScreen;
