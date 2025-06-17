import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS, SIZES, SHADOWS } from '../../components/constants/Theme';

const { width, height } = Dimensions.get('window');

export default function AuthIndexScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Image */}
      <View style={[styles.imageContainer, { backgroundColor: colors.lightGray }]}>
        <Image
          source={require('../../assets/illustration/a_vibrant_2d_illustration_featuring_black_obstetricians_and_healthcare_providers_engaging_with_the__lyacw4geud106dkbw8zq_0.png')}
          style={styles.headerImage}
          resizeMode="contain"
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.primary }]}>Welcome to FetalWatch</Text>
          <Text style={[styles.subtitle, { color: colors.gray }]}>
            Comprehensive fetal health monitoring and patient management system for healthcare professionals.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.feature}>
            <View style={[styles.featureIcon, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="heart" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.featureText, { color: colors.text }]}>Real-time Monitoring</Text>
          </View>
          <View style={styles.feature}>
            <View style={[styles.featureIcon, { backgroundColor: colors.success + '20' }]}>
              <Ionicons name="analytics" size={24} color={colors.success} />
            </View>
            <Text style={[styles.featureText, { color: colors.text }]}>Advanced Analytics</Text>
          </View>
          <View style={styles.feature}>
            <View style={[styles.featureIcon, { backgroundColor: colors.warning + '20' }]}>
              <Ionicons name="shield-checkmark" size={24} color={colors.warning} />
            </View>
            <Text style={[styles.featureText, { color: colors.text }]}>Secure & Compliant</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.loginButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/(auth)/Login')}
          >
            <Text style={[styles.loginButtonText, { color: colors.white }]}>Sign In</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.button, 
              styles.registerButton, 
              { backgroundColor: colors.white, borderColor: colors.primary }
            ]}
            onPress={() => router.push('/(auth)/Register')}
          >
            <Text style={[styles.registerButtonText, { color: colors.primary }]}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: height * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: width * 0.8,
    height: '80%',
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
    justifyContent: 'space-between',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: SIZES.padding,
  },
  title: {
    fontSize: SIZES.extraLarge + 4,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SIZES.padding,
  },
  subtitle: {
    fontSize: SIZES.medium,
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: SIZES.padding * 2,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  featureText: {
    fontSize: SIZES.small,
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonContainer: {
    marginBottom: SIZES.padding,
  },
  button: {
    height: 50,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.padding,
    ...SHADOWS.medium,
  },
  loginButton: {},
  loginButtonText: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  registerButton: {
    borderWidth: 2,
  },
  registerButtonText: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
});
