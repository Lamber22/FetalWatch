import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const { height } = Dimensions.get('window');

export default function IndexScreen() {
  const { user, loading } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/home');
      } else {
        router.replace('/auth');
      }
    }
  }, [user, loading, router]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image
        source={require('../assets/illustration/a_vibrant_2d_illustration_featuring_black_obstetricians_and_healthcare_providers_engaging_with_the__lyacw4geud106dkbw8zq_0.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={[styles.title, { color: colors.primary }]}>FetalWatch</Text>
      <Text style={[styles.subtitle, { color: colors.gray }]}>Comprehensive Fetal Health Monitoring</Text>
      <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: height,
  },
  logo: {
    width: '50%',
    height: height * 0.2,
    maxWidth: 150,
    maxHeight: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: Math.min(32, height * 0.04),
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: Math.min(16, height * 0.02),
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  loader: {
    marginTop: 20,
  },
});

