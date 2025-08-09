import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../../components/constants/Theme';
import { useTheme } from '../../contexts/ThemeContext';
import { usePatients } from '../../contexts/PatientsContext';
import { useReports } from '../../contexts/ReportsContext';

export default function PatientReportScreen() {
  const params = useLocalSearchParams();
  const patientId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  
  const { colors } = useTheme();
  const { selectedPatient, loading: patientLoading, error: patientError, getPatient } = usePatients();
  const {
    riskAssessment,
    vitalTrends,
    complications,
    loading: reportsLoading,
    error: reportsError,
    fetchRiskAssessment,
    fetchVitalTrends,
    fetchComplications,
    exportReport,
    clearError
  } = useReports();

  const [activeTab, setActiveTab] = useState<'overview' | 'risk' | 'vitals' | 'complications'>('overview');

  useEffect(() => {
    if (patientId) {
      loadPatientData();
    }
  }, [patientId]);

  const loadPatientData = async () => {
    try {
      await getPatient(patientId);
      await Promise.all([
        fetchRiskAssessment(patientId),
        fetchVitalTrends(patientId),
        fetchComplications(patientId)
      ]);
    } catch (error) {
      console.error('Failed to load patient data:', error);
    }
  };

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return 'N/A';
    const birth = new Date(dateOfBirth);
    const today = new Date();
    return Math.floor((today.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  };

  const getRiskLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'high': return colors.error;
      case 'moderate': return colors.warning;
      case 'low': return colors.success;
      default: return colors.gray;
    }
  };

  const formatBloodPressure = (bp?: string | { systolic: number; diastolic: number; }) => {
    if (!bp) return 'N/A';
    if (typeof bp === 'string') return bp;
    return `${bp.systolic}/${bp.diastolic}`;
  };

  const handleExportReport = async (reportType: 'risk-assessment' | 'vital-trends' | 'complications') => {
    try {
      const blob = await exportReport(reportType, patientId);
      Alert.alert('Success', `${reportType} report exported successfully`);
    } catch (error) {
      Alert.alert('Error', `Failed to export ${reportType} report`);
    }
  };

  const renderTabButton = (tab: typeof activeTab, title: string, icon: string) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        {
          backgroundColor: activeTab === tab ? colors.primary : colors.white,
          borderColor: colors.primary,
        }
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <Ionicons
        name={icon as any}
        size={16}
        color={activeTab === tab ? colors.white : colors.primary}
      />
      <Text style={[
        styles.tabButtonText,
        { color: activeTab === tab ? colors.white : colors.primary }
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderOverview = () => (
    <View>
      {/* Patient Summary Card */}
      <View style={[styles.card, { backgroundColor: colors.white }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Patient Summary</Text>
        
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.gray }]}>Risk Score</Text>
            <Text style={[styles.summaryValue, { color: colors.primary }]}>
              {riskAssessment?.riskScore || 'N/A'}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.gray }]}>Risk Level</Text>
            <Text style={[
              styles.summaryValue,
              { color: getRiskLevelColor(riskAssessment?.riskLevel || '') }
            ]}>
              {riskAssessment?.riskLevel || 'N/A'}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.gray }]}>Complications</Text>
            <Text style={[styles.summaryValue, { color: colors.error }]}>
              {complications.length}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.gray }]}>Vital Records</Text>
            <Text style={[styles.summaryValue, { color: colors.success }]}>
              {vitalTrends.length}
            </Text>
          </View>
        </View>
      </View>

      {/* Patient Information */}
      <View style={[styles.card, { backgroundColor: colors.white }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Patient Information</Text>
        
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.gray }]}>Name</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{selectedPatient?.name}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.gray }]}>Age</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {calculateAge(selectedPatient?.dateOfBirth)}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.gray }]}>Gender</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{selectedPatient?.gender || 'N/A'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.gray }]}>Contact</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{selectedPatient?.contact || 'N/A'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.gray }]}>Week of Pregnancy</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {selectedPatient?.weekOfPregnancy || 'N/A'}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.gray }]}>Expected Delivery</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {selectedPatient?.expectedDeliveryDate ? new Date(selectedPatient.expectedDeliveryDate).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={[styles.card, { backgroundColor: colors.white }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Recent Vital Signs</Text>
        
        {vitalTrends.length > 0 ? (
          vitalTrends.slice(0, 3).map((vital, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityInfo}>
                <Text style={[styles.activityDate, { color: colors.text }]}>
                  {new Date(vital.date).toLocaleDateString()}
                </Text>
                <Text style={[styles.activityDetails, { color: colors.gray }]}>
                  Weight: {vital.weight || 'N/A'} kg • BP: {formatBloodPressure(vital.bloodPressure)} • Temp: {vital.temperature || 'N/A'}°C
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.gray} />
            </View>
          ))
        ) : (
          <Text style={[styles.emptyText, { color: colors.gray }]}>No recent vital signs recorded</Text>
        )}
      </View>
    </View>
  );

  const renderRiskAssessment = () => (
    <View>
      {riskAssessment ? (
        <>
          <View style={[styles.card, { backgroundColor: colors.white }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Risk Assessment</Text>
              <TouchableOpacity
                style={[styles.exportButton, { backgroundColor: colors.primary }]}
                onPress={() => handleExportReport('risk-assessment')}
              >
                <Ionicons name="download" size={16} color={colors.white} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.riskSummary}>
              <View style={[styles.riskBadge, { backgroundColor: getRiskLevelColor(riskAssessment.riskLevel) }]}>
                <Text style={styles.riskBadgeText}>{riskAssessment.riskLevel.toUpperCase()}</Text>
              </View>
              <Text style={[styles.riskScore, { color: colors.text }]}>
                Score: {riskAssessment.riskScore}
              </Text>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: colors.white }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Risk Factors</Text>
            {riskAssessment.riskFactors.length > 0 ? (
              riskAssessment.riskFactors.map((factor, index) => (
                <View key={index} style={styles.riskFactorItem}>
                  <Ionicons name="warning" size={16} color={colors.warning} />
                  <Text style={[styles.riskFactorText, { color: colors.text }]}>{factor}</Text>
                </View>
              ))
            ) : (
              <Text style={[styles.emptyText, { color: colors.gray }]}>No risk factors identified</Text>
            )}
          </View>

          <View style={[styles.card, { backgroundColor: colors.white }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Recommendations</Text>
            {riskAssessment.recommendations.length > 0 ? (
              riskAssessment.recommendations.map((rec, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Ionicons 
                    name={rec.priority === 'high' ? "warning" : "checkmark-circle"} 
                    size={16} 
                    color={rec.priority === 'high' ? colors.warning : colors.success} 
                  />
                  <View style={styles.recommendationContent}>
                    <Text style={[styles.recommendationText, { color: colors.text }]}>{rec.description}</Text>
                    <Text style={[styles.recommendationDetails, { color: colors.gray }]}>{rec.details}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={[styles.emptyText, { color: colors.gray }]}>No specific recommendations available</Text>
            )}
          </View>
        </>
      ) : (
        <View style={[styles.card, { backgroundColor: colors.white }]}>
          <Text style={[styles.emptyText, { color: colors.gray }]}>No risk assessment data available</Text>
        </View>
      )}
    </View>
  );

  const renderVitalTrends = () => (
    <View>
      <View style={[styles.card, { backgroundColor: colors.white }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Vital Signs Trends</Text>
          <TouchableOpacity
            style={[styles.exportButton, { backgroundColor: colors.primary }]}
            onPress={() => handleExportReport('vital-trends')}
          >
            <Ionicons name="download" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
        
        {vitalTrends.length > 0 ? (
          vitalTrends.map((vital, index) => (
            <View key={index} style={styles.vitalItem}>
              <View style={styles.vitalDate}>
                <Text style={[styles.vitalDateText, { color: colors.text }]}>
                  {new Date(vital.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.vitalData}>
                <View style={styles.vitalDataItem}>
                  <Text style={[styles.vitalLabel, { color: colors.gray }]}>Weight</Text>
                  <Text style={[styles.vitalValue, { color: colors.text }]}>{vital.weight || 'N/A'} kg</Text>
                </View>
                <View style={styles.vitalDataItem}>
                  <Text style={[styles.vitalLabel, { color: colors.gray }]}>Blood Pressure</Text>
                  <Text style={[styles.vitalValue, { color: colors.text }]}>{formatBloodPressure(vital.bloodPressure)}</Text>
                </View>
                <View style={styles.vitalDataItem}>
                  <Text style={[styles.vitalLabel, { color: colors.gray }]}>Temperature</Text>
                  <Text style={[styles.vitalValue, { color: colors.text }]}>{vital.temperature || 'N/A'}°C</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={[styles.emptyText, { color: colors.gray }]}>No vital signs data available</Text>
        )}
      </View>
    </View>
  );

  const renderComplications = () => (
    <View>
      <View style={[styles.card, { backgroundColor: colors.white }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Potential Complications</Text>
          <TouchableOpacity
            style={[styles.exportButton, { backgroundColor: colors.primary }]}
            onPress={() => handleExportReport('complications')}
          >
            <Ionicons name="download" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
        
        {complications.length > 0 ? (
          complications.map((complication, index) => (
            <View key={index} style={[styles.complicationItem, { borderLeftColor: getRiskLevelColor(complication.probability) }]}>
              <View style={styles.complicationHeader}>
                <Text style={[styles.complicationName, { color: colors.text }]}>{complication.name}</Text>
                <View style={[styles.probabilityBadge, { backgroundColor: getRiskLevelColor(complication.probability) }]}>
                  <Text style={styles.probabilityText}>{complication.probability.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={[styles.complicationDescription, { color: colors.gray }]}>{complication.description}</Text>
              <View style={styles.recommendationsContainer}>
                {complication.recommendations.map((rec, recIndex) => (
                  <Text key={recIndex} style={[styles.complicationRecommendation, { color: colors.text }]}>
                    • {rec}
                  </Text>
                ))}
              </View>
            </View>
          ))
        ) : (
          <Text style={[styles.emptyText, { color: colors.gray }]}>No complications identified</Text>
        )}
      </View>
    </View>
  );

  if (patientLoading || reportsLoading) {
    return (
      <View style={[styles.container, styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading patient report...</Text>
      </View>
    );
  }

  if (patientError || reportsError) {
    return (
      <View style={[styles.container, styles.centerContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle" size={48} color={colors.error} />
        <Text style={[styles.errorText, { color: colors.error }]}>
          {patientError || reportsError}
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={loadPatientData}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!selectedPatient) {
    return (
      <View style={[styles.container, styles.centerContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="person-remove" size={48} color={colors.gray} />
        <Text style={[styles.errorText, { color: colors.gray }]}>Patient not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{selectedPatient.name}</Text>
          <Text style={styles.headerSubtitle}>
            Age: {calculateAge(selectedPatient.dateOfBirth)} • ID: {selectedPatient._id?.slice(-6)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={loadPatientData}
        >
          <Ionicons name="refresh" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={[styles.tabsContainer, { backgroundColor: colors.white }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          {renderTabButton('overview', 'Overview', 'home')}
          {renderTabButton('risk', 'Risk', 'warning')}
          {renderTabButton('vitals', 'Vitals', 'fitness')}
          {renderTabButton('complications', 'Complications', 'medical')}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'risk' && renderRiskAssessment()}
        {activeTab === 'vitals' && renderVitalTrends()}
        {activeTab === 'complications' && renderComplications()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding,
    paddingTop: SIZES.padding * 2,
  },
  backButton: {
    marginRight: SIZES.padding,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: SIZES.font,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: SIZES.base / 2,
  },
  refreshButton: {
    marginLeft: SIZES.padding,
  },
  tabsContainer: {
    paddingVertical: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  tabsScroll: {
    paddingHorizontal: SIZES.padding,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    marginRight: SIZES.base,
  },
  tabButtonText: {
    fontSize: SIZES.font,
    fontWeight: '500',
    marginLeft: SIZES.base / 2,
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
  },
  card: {
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    ...SHADOWS.light,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  cardTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  exportButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SIZES.padding,
  },
  summaryItem: {
    width: '50%',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  summaryLabel: {
    fontSize: SIZES.small,
    marginBottom: SIZES.base / 2,
  },
  summaryValue: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  infoGrid: {
    marginTop: SIZES.base,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  infoLabel: {
    fontSize: SIZES.font,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: SIZES.font,
    flex: 1,
    textAlign: 'right',
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  activityInfo: {
    flex: 1,
  },
  activityDate: {
    fontSize: SIZES.font,
    fontWeight: '500',
  },
  activityDetails: {
    fontSize: SIZES.small,
    marginTop: SIZES.base / 2,
  },
  riskSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.padding,
  },
  riskBadge: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
  },
  riskBadgeText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  riskScore: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  riskFactorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  riskFactorText: {
    marginLeft: SIZES.base,
    fontSize: SIZES.font,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.base,
  },
  recommendationContent: {
    marginLeft: SIZES.base,
    flex: 1,
  },
  recommendationText: {
    fontSize: SIZES.font,
    fontWeight: '500',
  },
  recommendationDetails: {
    fontSize: SIZES.small,
    marginTop: SIZES.base / 2,
  },
  vitalItem: {
    flexDirection: 'row',
    marginBottom: SIZES.padding,
    paddingBottom: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  vitalDate: {
    width: 80,
    marginRight: SIZES.padding,
  },
  vitalDateText: {
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  vitalData: {
    flex: 1,
  },
  vitalDataItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.base / 2,
  },
  vitalLabel: {
    fontSize: SIZES.small,
  },
  vitalValue: {
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  complicationItem: {
    borderLeftWidth: 4,
    paddingLeft: SIZES.padding,
    marginBottom: SIZES.padding,
    paddingBottom: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  complicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  complicationName: {
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  probabilityBadge: {
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius / 2,
  },
  probabilityText: {
    color: COLORS.white,
    fontSize: SIZES.small,
    fontWeight: 'bold',
  },
  complicationDescription: {
    fontSize: SIZES.font,
    marginBottom: SIZES.base,
  },
  recommendationsContainer: {
    marginTop: SIZES.base,
  },
  complicationRecommendation: {
    fontSize: SIZES.small,
    marginBottom: SIZES.base / 2,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: SIZES.font,
    fontStyle: 'italic',
    padding: SIZES.padding,
  },
  loadingText: {
    marginTop: SIZES.base,
    fontSize: SIZES.font,
  },
  errorText: {
    fontSize: SIZES.font,
    textAlign: 'center',
    marginTop: SIZES.base,
  },
  retryButton: {
    marginTop: SIZES.padding,
    paddingHorizontal: SIZES.padding * 2,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontWeight: '500',
  },
});
