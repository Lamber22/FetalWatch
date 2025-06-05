import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

export default function ReportsScreen() {
  const { colors } = useTheme();

  const reports = [
    {
      id: '1',
      title: 'Monthly Patient Statistics',
      date: 'March 2024',
      type: 'Analytics',
      status: 'Completed',
    },
    {
      id: '2',
      title: 'High Risk Cases Report',
      date: 'March 15, 2024',
      type: 'Risk Assessment',
      status: 'In Progress',
    },
    {
      id: '3',
      title: 'Lab Results Summary',
      date: 'March 14, 2024',
      type: 'Lab Analysis',
      status: 'Completed',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Reports</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.white }]}
          onPress={() => router.push('/(tabs)')}
        >
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {reports.map((report) => (
          <TouchableOpacity
            key={report.id}
            style={[styles.reportCard, { backgroundColor: colors.white }]}
            onPress={() => router.push(`/(tabs)/reports/${report.id}`)}
          >
            <View style={styles.reportInfo}>
              <Text style={[styles.reportTitle, { color: colors.text }]}>
                {report.title}
              </Text>
              <Text style={[styles.reportDate, { color: colors.gray }]}>
                {report.date}
              </Text>
              <Text style={[styles.reportType, { color: colors.gray }]}>
                {report.type}
              </Text>
            </View>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      report.status === 'Completed' ? colors.success : colors.warning,
                  },
                ]}
              >
                <Text style={styles.statusText}>{report.status}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    paddingTop: SIZES.padding * 2,
  },
  headerTitle: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
  },
  reportCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
    ...SHADOWS.light,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: SIZES.medium,
    fontWeight: '500',
  },
  reportDate: {
    fontSize: SIZES.small,
    marginTop: SIZES.base / 2,
  },
  reportType: {
    fontSize: SIZES.small,
    marginTop: SIZES.base / 2,
  },
  statusContainer: {
    marginLeft: SIZES.base,
  },
  statusBadge: {
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
  },
  statusText: {
    color: COLORS.white,
    fontSize: SIZES.small,
    fontWeight: '500',
  },
}); 