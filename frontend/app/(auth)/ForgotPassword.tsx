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

const { width } = Dimensions.get('window');

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'email' | 'verify' | 'reset'>('email');
  const [resetData, setResetData] = useState<{email: string; expiresIn: string} | null>(null);
  const [resetToken, setResetToken] = useState<string>('');
  
  const { 
    forgotPassword, 
    verifyPasswordResetOTP, 
    resetPassword,
    loading, 
    error, 
    clearError 
  } = useAuth();

  const handleRequestReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      clearError();
      console.log('Requesting password reset...');
      const result = await forgotPassword(email);
      setResetData(result);
      setStep('verify');
      Alert.alert(
        'Verification Code Sent', 
        `A verification code has been sent to ${email}. Please check your inbox.`
      );
    } catch (error: any) {
      console.error('Password reset request error:', error);
      Alert.alert('Error', error.message || 'Failed to send reset code');
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit verification code');
      return;
    }

    try {
      clearError();
      console.log('Verifying reset code...');
      const result = await verifyPasswordResetOTP(email, otp);
      setResetToken(result.resetToken);
      setStep('reset');
      Alert.alert('Code Verified', 'You can now set your new password');
    } catch (error: any) {
      console.error('OTP verification error:', error);
      Alert.alert('Verification Error', error.message || 'Invalid verification code');
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    try {
      clearError();
      console.log('Resetting password...');
      await resetPassword(email, resetToken, newPassword, confirmPassword);
      
      // For web compatibility, navigate directly instead of using Alert
      if (Platform.OS === 'web') {
        router.replace('/(auth)/Login');
      } else {
        Alert.alert(
          'Success!', 
          'Your password has been reset successfully. You can now sign in with your new password.',
          [
            {
              text: 'Sign In',
              onPress: () => router.replace('/(auth)/Login')
            }
          ]
        );
      }
    } catch (error: any) {
      console.error('Password reset error:', error);
      Alert.alert('Error', error.message || 'Failed to reset password');
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setOtp('');
    setResetData(null);
    clearError();
  };

  const getTitle = () => {
    switch (step) {
      case 'email': return 'Forgot Password';
      case 'verify': return 'Verify Code';
      case 'reset': return 'Reset Password';
      default: return 'Forgot Password';
    }
  };

  const getSubtitle = () => {
    switch (step) {
      case 'email': return 'Enter your email to receive a reset code';
      case 'verify': return `Enter the code sent to ${email}`;
      case 'reset': return 'Create your new password';
      default: return '';
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
            <Text style={styles.title}>{getTitle()}</Text>
            <Text style={styles.subtitle}>{getSubtitle()}</Text>
          </View>

          <View style={styles.form}>
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {step === 'email' && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email Address</Text>
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

                <TouchableOpacity 
                  style={[styles.button, loading && styles.buttonDisabled]} 
                  onPress={handleRequestReset}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={COLORS.primary} />
                  ) : (
                    <Text style={styles.buttonText}>Send Reset Code</Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            {step === 'verify' && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Verification Code</Text>
                  <TextInput
                    style={[styles.input, styles.otpInput]}
                    placeholder="Enter 6-digit code"
                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="numeric"
                    maxLength={6}
                    editable={!loading}
                  />
                </View>

                {resetData && (
                  <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>
                      Code expires in {resetData.expiresIn}
                    </Text>
                  </View>
                )}

                <TouchableOpacity 
                  style={[styles.button, loading && styles.buttonDisabled]} 
                  onPress={handleVerifyOTP}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={COLORS.primary} />
                  ) : (
                    <Text style={styles.buttonText}>Verify Code</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.linkButton} 
                  onPress={handleBackToEmail}
                  disabled={loading}
                >
                  <Text style={styles.linkText}>← Back to Email</Text>
                </TouchableOpacity>
              </>
            )}

            {step === 'reset' && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>New Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter new password (min 8 characters)"
                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    editable={!loading}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Confirm New Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm new password"
                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    editable={!loading}
                  />
                </View>

                <TouchableOpacity 
                  style={[styles.button, loading && styles.buttonDisabled]} 
                  onPress={handleResetPassword}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={COLORS.primary} />
                  ) : (
                    <Text style={styles.buttonText}>Reset Password</Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            <Link href="/(auth)/Login" asChild>
              <TouchableOpacity style={styles.linkButton}>
                <Text style={styles.linkText}>
                  Remembered your password? <Text style={styles.blueText}>Sign In</Text>
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
    backgroundColor: '#FF69B4',
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
  otpInput: {
    textAlign: 'center',
    fontSize: SIZES.large,
    letterSpacing: 4,
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: SIZES.radius,
    padding: SIZES.small,
    marginBottom: SIZES.medium,
  },
  infoText: {
    color: COLORS.white,
    fontSize: SIZES.small,
    textAlign: 'center',
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
    color: '#FF69B4',
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
  blueText: {
    color: '#007AFF', // Blue color
  },
});
