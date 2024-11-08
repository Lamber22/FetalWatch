// src/components/AuthForm.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../slices/loginSlice';

interface AuthFormProps {
    headerText: string;
    errorMessage: string;
    onSubmit: (data: { email: string; password: string }) => void;
    submitButtonText: string;
    defaultEmail?: string; // Add default email prop
    defaultPassword?: string; // Add default password prop
}

const AuthForm: React.FC<AuthFormProps> = ({
    headerText,
    errorMessage,
    onSubmit,
    submitButtonText,
    defaultEmail = '',
    defaultPassword = ''
    }) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState(defaultEmail);
    const [password, setPassword] = useState(defaultPassword);

    const handleSubmit = (data: { email: string; password: string }) => {
        dispatch(login(data));
        onSubmit(data);
    };

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
        <Button title={submitButtonText} onPress={() => handleSubmit({ email, password })} />
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
