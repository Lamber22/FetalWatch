import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Link, router } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../../components/constants/Theme';
import { useAuth } from '../../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('healthProvider');
  const { signUp, loading, error, clearError } = useAuth();

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      clearError();
      await signUp(firstName, lastName, email, password, role);
      router.replace('/(tabs)');
    } catch (error) {
      // Error is handled by context, but we can show an alert if needed
      console.error('Registration error:', error);
    }
  };

  return (
    <View style={styles.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/logo/logo-B7EoLIS6.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join FetalWatch today
            </Text>
          </View>

          <View style={styles.form}>
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your first name"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={firstName}
                onChangeText={setFirstName}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your last name"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={lastName}
                onChangeText={setLastName}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.primary} />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            <Link href="/(auth)/Login" asChild>
              <TouchableOpacity style={styles.linkButton}>
                <Text style={styles.linkText}>
                  Already have an account? Sign In
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#FF69B4', // Hot pink background
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: SIZES.medium,
  },
  content: {
    width: width > 600 ? width * 0.6 : width * 0.9,
    alignSelf: 'center',
    padding: SIZES.extraLarge,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SIZES.extraLarge,
  },
  logo: {
    width: width * 0.2,
    height: width * 0.2,
    maxWidth: 100,
    maxHeight: 100,
  },
  header: {
    marginBottom: SIZES.extraLarge,
  },
  title: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SIZES.base,
  },
  subtitle: {
    fontSize: SIZES.medium,
    color: COLORS.white,
    textAlign: 'center',
    opacity: 0.8,
  },
  form: {
    width: '100%',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    borderRadius: SIZES.radius,
    padding: SIZES.small,
    marginBottom: SIZES.medium,
  },
  errorText: {
    color: COLORS.white,
    fontSize: SIZES.small,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: SIZES.medium,
  },
  label: {
    fontSize: SIZES.medium,
    color: COLORS.white,
    marginBottom: SIZES.base,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: SIZES.radius,
    padding: SIZES.medium,
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
  button: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.medium,
    alignItems: 'center',
    marginTop: SIZES.base,
    ...SHADOWS.medium,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FF69B4',
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.medium,
  },
  footerText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
  },
  footerLink: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: SIZES.medium,
    alignItems: 'center',
  },
  linkText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    textAlign: 'center',
  },
});