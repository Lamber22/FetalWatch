// src/components/AuthForm.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

interface AuthFormProps {
    headerText: string;
    errorMessage: string;
    onSubmit: (data: { email: string; password: string }) => void;
    submitButtonText: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ headerText, errorMessage, onSubmit, submitButtonText }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={styles.container}>
        <Text style={styles.header}>{headerText}</Text>
        <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
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
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <Button title={submitButtonText} onPress={() => onSubmit({ email, password })} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 20,
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
        paddingLeft: 10,
    },
    error: {
        color: 'red',
        marginBottom: 15,
    },
});

export default AuthForm;
