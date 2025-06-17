import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function IndexScreen() {
  const { user, loading } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/main');
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
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  loader: {
    marginTop: 20,
  },
});

