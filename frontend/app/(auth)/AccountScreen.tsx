import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { router } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../../components/constants/Theme';
import { useAuth } from '../../contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function AccountScreen() {
  const { signOut } = useAuth();

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Administrator',
      'Please contact your system administrator to activate your account. You can reach out via:\n\n• Email: admin@fetalwatch.com\n• Phone: +1 (555) 123-4567\n• Or contact your facility\'s IT department',
      [
        {
          text: 'Send Email',
          onPress: () => {
            Linking.openURL('mailto:admin@fetalwatch.com?subject=Account Activation Request&body=Hello,%0D%0A%0D%0AI need my FetalWatch account to be activated.%0D%0A%0D%0AThank you.');
          }
        },
        {
          text: 'Call Support',
          onPress: () => {
            Linking.openURL('tel:+15551234567');
          }
        },
        {
          text: 'Close',
          style: 'cancel'
        }
      ]
    );
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/Login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleBackToLogin = () => {
    router.replace('/(auth)/Login');
  };

  return (
    <View style={styles.background}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/logo/fetalwatch.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.iconContainer}>
            <Text style={styles.icon}>⏳</Text>
          </View>

          <View style={styles.messageContainer}>
            <Text style={styles.title}>Account Pending Activation</Text>
            <Text style={styles.subtitle}>
              Your healthProvider account has been created successfully but requires administrator approval before you can access the system.
            </Text>
            <Text style={styles.description}>
              Please contact your system administrator to activate your account. You will be notified once your account is activated and ready to use.
            </Text>
          </View>

          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={handleContactSupport}
            >
              <Text style={styles.primaryButtonText}>Contact Administrator</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton} 
              onPress={handleBackToLogin}
            >
              <Text style={styles.secondaryButtonText}>Back to Login</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>What happens next?</Text>
            <View style={styles.stepContainer}>
              <Text style={styles.stepNumber}>1.</Text>
              <Text style={styles.stepText}>Administrator reviews your registration</Text>
            </View>
            <View style={styles.stepContainer}>
              <Text style={styles.stepNumber}>2.</Text>
              <Text style={styles.stepText}>Your account gets activated</Text>
            </View>
            <View style={styles.stepContainer}>
              <Text style={styles.stepNumber}>3.</Text>
              <Text style={styles.stepText}>You receive a notification email</Text>
            </View>
            <View style={styles.stepContainer}>
              <Text style={styles.stepNumber}>4.</Text>
              <Text style={styles.stepText}>You can sign in and access FetalWatch</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#FF69B4', // Hot pink background
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
    marginBottom: SIZES.large,
  },
  logo: {
    width: width * 0.15,
    height: width * 0.15,
    maxWidth: 80,
    maxHeight: 80,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  icon: {
    fontSize: 60,
    textAlign: 'center',
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: SIZES.extraLarge,
  },
  title: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SIZES.medium,
  },
  subtitle: {
    fontSize: SIZES.medium,
    color: COLORS.white,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: SIZES.medium,
    lineHeight: SIZES.medium * 1.4,
  },
  description: {
    fontSize: SIZES.small,
    color: COLORS.white,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: SIZES.small * 1.4,
  },
  actionContainer: {
    marginBottom: SIZES.extraLarge,
  },
  primaryButton: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.medium,
    alignItems: 'center',
    marginBottom: SIZES.medium,
    ...SHADOWS.medium,
  },
  primaryButtonText: {
    color: '#FF69B4',
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.medium,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: '500',
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: SIZES.radius,
    padding: SIZES.medium,
  },
  infoTitle: {
    fontSize: SIZES.medium,
    color: COLORS.white,
    fontWeight: 'bold',
    marginBottom: SIZES.small,
    textAlign: 'center',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.base,
  },
  stepNumber: {
    fontSize: SIZES.small,
    color: COLORS.white,
    fontWeight: 'bold',
    marginRight: SIZES.base,
    minWidth: 20,
  },
  stepText: {
    fontSize: SIZES.small,
    color: COLORS.white,
    opacity: 0.9,
    flex: 1,
    lineHeight: SIZES.small * 1.3,
  },
});
