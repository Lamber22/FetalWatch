import React, { useState, useEffect } from 'react';
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
  ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../../components/constants/Theme';
import { useAuth } from '../../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, loading, error, clearError, user } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'admin') {
        router.replace('/(admin)/AdminScreen');
      } else {
        router.replace('/(tabs)');
      }
    }
  }, [user, loading]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      clearError();
      await signIn(email, password);
      // Routing is now handled in useEffect
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Check if error is related to account activation
      if (error.message && (
        error.message.includes('pending activation') || 
        error.message.includes('administrator')
      )) {
        Alert.alert(
          'Account Pending Activation',
          'Your account requires administrator approval. You will be redirected to the account status page where you can contact support.',
          [
            {
              text: 'Continue',
              onPress: () => router.replace('/(auth)/AccountScreen')
            }
          ]
        );
      } else {
        // For other errors, let the context handle the error display
        console.log('Other login error:', error.message);
      }
    }
  };

  return (
    <View style={styles.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/logo/fetalwatch.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <View style={styles.header}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in to continue to FetalWatch
              </Text>
            </View>

            <View style={styles.form}>
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

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
                  autoComplete="email"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password"
                    editable={!loading}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    <Text style={styles.eyeIconText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Link href="/(auth)/ForgotPassword" asChild>
                <TouchableOpacity 
                  style={styles.forgotPassword}
                  disabled={loading}
                >
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </Link>

              <TouchableOpacity 
                style={[styles.button, loading && styles.buttonDisabled]} 
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.primary} />
                ) : (
                  <Text style={styles.buttonText}>Sign In</Text>
                )}
              </TouchableOpacity>

              <Link href="/(auth)/Register" asChild>
                <TouchableOpacity style={styles.linkButton}>
                  <Text style={styles.linkText}>
                    Don't have an account? <Text style={styles.blueText}>Sign Up</Text>
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
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
  },
  scrollContainer: {
    flexGrow: 1,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    marginBottom: SIZES.medium,
  },
  passwordInput: {
    flex: 1,
    padding: SIZES.medium,
    color: COLORS.white,
  },
  eyeIcon: {
    padding: SIZES.medium,
  },
  eyeIconText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SIZES.medium,
  },
  forgotPasswordText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    opacity: 0.8,
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
    color: COLORS.primary,
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
    alignSelf: 'center',
    marginTop: SIZES.medium,
  },
  linkText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  blueText: {
    color: '#007AFF', // Blue color
  },
});