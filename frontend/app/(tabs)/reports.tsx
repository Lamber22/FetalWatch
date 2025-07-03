import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../../components/constants/Theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useReports } from '../../contexts/ReportsContext';

export default function ReportsScreen() {
  const { colors } = useTheme();
  const {
    dashboardReport,
    patientReport,
    facilityReport,
    riskIndicatorsReport,
    loading,
    error,
    getDashboardReport,
    getFacilityReport,
    getRiskIndicatorsReport,
    exportReport,
    clearError
  } = useReports();

  useEffect(() => {
    // Load initial reports when component mounts
    getDashboardReport();
    getFacilityReport();
    getRiskIndicatorsReport();
  }, [getDashboardReport, getFacilityReport, getRiskIndicatorsReport]);

  // Transform the context reports into the format expected by the UI
  const reports = [
    {
      id: 'dashboard',
      title: 'Dashboard Report',
      date: dashboardReport?.generatedAt ? new Date(dashboardReport.generatedAt).toLocaleDateString() : 'Not generated',
      type: 'Analytics',
      status: dashboardReport ? 'Completed' : 'Pending',
      data: dashboardReport
    },
    {
      id: 'facility',
      title: 'Facility Report',
      date: facilityReport?.generatedAt ? new Date(facilityReport.generatedAt).toLocaleDateString() : 'Not generated',
      type: 'Facility Analysis',
      status: facilityReport ? 'Completed' : 'Pending',
      data: facilityReport
    },
    {
      id: 'risk',
      title: 'Risk Indicators Report',
      date: riskIndicatorsReport?.generatedAt ? new Date(riskIndicatorsReport.generatedAt).toLocaleDateString() : 'Not generated',
      type: 'Risk Assessment',
      status: riskIndicatorsReport ? 'Completed' : 'Pending',
      data: riskIndicatorsReport
    },
  ];

  const handleExportReport = async (reportType: string) => {
    try {
      await exportReport(reportType);
      // Handle successful export (e.g., show success message)
    } catch (error) {
      // Error is already handled in the context
      console.error('Export failed:', error);
    }
  };

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