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
  ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../../components/constants/Theme';
import { useAuth } from '../../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [facilityAddress, setFacilityAddress] = useState('');
  const [facilityPhone, setFacilityPhone] = useState('');
  const [facilityType, setFacilityType] = useState('');
  const [facilityLicenseNumber, setFacilityLicenseNumber] = useState('');
  const [role] = useState('healthProvider'); // Role is fixed to healthProvider for default registration
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'verify' | 'register'>('email');
  const [registrationData, setRegistrationData] = useState<{email: string; expiresIn: string} | null>(null);
  
  const { 
    signUp, 
    initiateSignUp, 
    verifyEmailAndCompleteSignUp, 
    resendOTP,
    loading, 
    error, 
    clearError 
  } = useAuth();

  // Step 1: User enters email and OTP is sent
  const handleEmailSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      clearError();
      console.log('Sending OTP to email...');
      // Step 1: Send OTP to email using initiate-signup endpoint (email only)
      const result = await initiateSignUp(email);
      setRegistrationData(result);
      setStep('verify');
      Alert.alert(
        'Verification Code Sent', 
        `A verification code has been sent to ${email}. Please enter the code to proceed.`
      );
    } catch (error: any) {
      console.error('Email verification initiation error:', error);
      if (error.message.includes('already exists')) {
        Alert.alert('Error', 'An account with this email already exists. Please use a different email or try signing in.');
      } else {
        Alert.alert('Error', error.message || 'Failed to send verification code');
      }
    }
  };

  // Step 2: User verifies OTP
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit verification code');
      return;
    }

    try {
      clearError();
      console.log('Verifying OTP...');
      // Step 2: Verify the email with OTP, don't complete registration yet
      await verifyEmailAndCompleteSignUp(email, otp);
      setStep('register');
      Alert.alert(
        'Email Verified!', 
        'Your email has been verified. Please complete your registration details.'
      );
    } catch (error: any) {
      console.error('OTP verification error:', error);
      Alert.alert('Verification Error', error.message || 'Failed to verify code');
    }
  };

  // Step 3: User completes registration with all details
  const handleCompleteRegistration = async () => {
    if (!facilityName || !facilityAddress || !facilityPhone || !facilityType || !facilityLicenseNumber || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    try {
      clearError();
      console.log('Completing registration...');
      // Only send required fields for healthProvider
      await signUp(facilityName, facilityAddress, facilityPhone, facilityType, facilityLicenseNumber, email, password, role, otp);
      Alert.alert(
        'Registration Successful!', 
        'Your healthProvider account has been created successfully. Your account is pending activation by an administrator.',
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/(auth)/AccountScreen')
          }
        ]
      );
    } catch (error: any) {
      console.error('Registration completion error:', error);
      Alert.alert('Registration Error', error.message || 'Failed to complete registration');
    }
  };

  const handleResendOTP = async () => {
    try {
      clearError();
      console.log('Resending OTP...');
      const result = await resendOTP(email);
      setRegistrationData(result);
      Alert.alert('Code Sent', 'A new verification code has been sent to your email');
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      Alert.alert('Error', error.message || 'Failed to resend verification code');
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setOtp('');
    setRegistrationData(null);
    clearError();
  };

  const handleBackToVerify = () => {
    setStep('verify');
    setFacilityName('');
    setFacilityAddress('');
    setFacilityPhone('');
    setFacilityType('');
    setFacilityLicenseNumber('');
    setPassword('');
    setConfirmPassword('');
    clearError();
  };
  return (
    <View style={styles.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
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
              <Text style={styles.title}>
                {step === 'email' ? 'Get Started' : step === 'verify' ? 'Verify Email' : 'Complete Registration'}
              </Text>
              <Text style={styles.subtitle}>
                {step === 'email' 
                  ? 'Enter your email to receive a verification code' 
                  : step === 'verify'
                  ? `Enter the verification code sent to ${email}`
                  : 'Complete your registration details'
                }
              </Text>
            </View>

            <View style={styles.form}>
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {step === 'email' ? (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email address"
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
                    onPress={handleEmailSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FF69B4" />
                    ) : (
                      <Text style={styles.buttonText}>Send Verification Code</Text>
                    )}
                  </TouchableOpacity>
                </>
              ) : step === 'verify' ? (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                      style={[styles.input, { opacity: 0.7 }]}
                      value={email}
                      editable={false}
                    />
                  </View>

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

                  {registrationData && (
                    <View style={styles.infoContainer}>
                      <Text style={styles.infoText}>
                        Code expires in {registrationData.expiresIn}
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity 
                    style={[styles.button, loading && styles.buttonDisabled]} 
                    onPress={handleVerifyOTP}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FF69B4" />
                    ) : (
                      <Text style={styles.buttonText}>Verify Email</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.secondaryButton} 
                    onPress={handleResendOTP}
                    disabled={loading}
                  >
                    <Text style={styles.secondaryButtonText}>Resend Code</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.linkButton} 
                    onPress={handleBackToEmail}
                    disabled={loading}
                  >
                    <Text style={styles.linkText}>← Back to Email</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                      style={[styles.input, { opacity: 0.7 }]}
                      value={email}
                      editable={false}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Healthcare Facility Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your healthcare facility name"
                      placeholderTextColor="rgba(255, 255, 255, 0.7)"
                      value={facilityName}
                      onChangeText={setFacilityName}
                      editable={!loading}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Facility Address</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter facility address"
                      placeholderTextColor="rgba(255, 255, 255, 0.7)"
                      value={facilityAddress}
                      onChangeText={setFacilityAddress}
                      editable={!loading}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Facility Phone</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter facility phone"
                      placeholderTextColor="rgba(255, 255, 255, 0.7)"
                      value={facilityPhone}
                      onChangeText={setFacilityPhone}
                      keyboardType="phone-pad"
                      editable={!loading}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Facility Type</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter facility type"
                      placeholderTextColor="rgba(255, 255, 255, 0.7)"
                      value={facilityType}
                      onChangeText={setFacilityType}
                      editable={!loading}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Facility License Number</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter facility license number"
                      placeholderTextColor="rgba(255, 255, 255, 0.7)"
                      value={facilityLicenseNumber}
                      onChangeText={setFacilityLicenseNumber}
                      editable={!loading}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your password (min 8 characters)"
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
                    onPress={handleCompleteRegistration}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FF69B4" />
                    ) : (
                      <Text style={styles.buttonText}>Complete Registration</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.secondaryButton} 
                    onPress={handleBackToVerify}
                    disabled={loading}
                  >
                    <Text style={styles.secondaryButtonText}>← Back to Verification</Text>
                  </TouchableOpacity>
                </>
              )}

              {step === 'email' && (
                <Link href="/(auth)/Login" asChild>
                  <TouchableOpacity style={styles.linkButton}>
                    <Text style={styles.linkText}>
                      Already have an account? Sign In
                    </Text>
                  </TouchableOpacity>
                </Link>
              )}
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
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.medium,
    alignItems: 'center',
    marginTop: SIZES.base,
  },
  secondaryButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: '500',
  },
});