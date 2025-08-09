import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/Theme';
import { useTheme } from '../../contexts/ThemeContext';
import { usePatientReports, PatientReportUtils } from '../../hooks/usePatientReports';
import { PatientUtils } from '../../hooks/usePatient';
import { Patient } from '../../interface/iPatient';

interface PatientDetailsViewProps {
  patient: Patient;
  onActionPress?: (action: string, patientId: string) => void;
  showActions?: boolean;
}

export default function PatientDetailsView({ 
  patient, 
  onActionPress, 
  showActions = false 
}: PatientDetailsViewProps) {
  const { colors } = useTheme();
  
  // Use the patient reports hook
  const { 
    loadPatientReports, 
    isLoading, 
    hasData, 
    patientReports 
  } = usePatientReports();

  const patientId = patient._id;
  const reportData = patientId ? patientReports[patientId] : null;

  // Load patient reports when component mounts
  useEffect(() => {
    if (patientId && !hasData(patientId)) {
      loadPatientReports(patientId).catch((error) => {
        console.error('Failed to load patient reports in PatientDetailsView:', error);
      });
    }
  }, [patientId, hasData, loadPatientReports]);

  const age = PatientUtils.calculateAge(patient.dateOfBirth) || 'N/A';
  const gestationalAge = PatientUtils.getGestationalAge(patient);
  
  // Use report data for risk level if available, otherwise calculate from gestational age
  const getRiskLevel = () => {
    if (!gestationalAge) return 'Medium';
    if (gestationalAge < 20 || gestationalAge > 35) return 'High';
    if (gestationalAge < 24 || gestationalAge > 32) return 'Medium';
    return 'Low';
  };

  const riskLevel = reportData?.riskAssessment?.riskLevel 
    ? reportData.riskAssessment.riskLevel.charAt(0).toUpperCase() + reportData.riskAssessment.riskLevel.slice(1)
    : getRiskLevel();

  const handleActionPress = (action: string) => {
    if (onActionPress && patient._id) {
      onActionPress(action, patient._id);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background || COLORS.background }]}>
      {/* Patient Header */}
      <View style={[styles.header, { backgroundColor: colors.white || COLORS.white }]}>
        <View style={styles.headerInfo}>
          <Text style={[styles.patientName, { color: colors.text || COLORS.text }]}>
            {patient.name}
          </Text>
          <Text style={[styles.patientDetails, { color: colors.gray || COLORS.gray }]}>
            Age: {age} 
          </Text>
        </View>
        <View style={styles.riskContainer}>
          {patientId && isLoading(patientId) && (
            <ActivityIndicator size="small" color={colors.primary || COLORS.primary} style={styles.loadingIndicator} />
          )}
          <View
            style={[
              styles.riskBadge,
              {
                backgroundColor: PatientReportUtils.getRiskLevelColor(riskLevel, colors) || 
                  (riskLevel === 'High'
                    ? colors.error || COLORS.error
                    : riskLevel === 'Medium'
                    ? colors.warning || COLORS.warning
                    : colors.success || COLORS.success),
              },
            ]}
          >
            <Text style={styles.riskText}>{riskLevel} Risk</Text>
          </View>
          {reportData?.riskAssessment?.riskScore && (
            <Text style={[styles.riskScore, { color: colors.gray || COLORS.gray }]}>
              Score: {reportData.riskAssessment.riskScore}
            </Text>
          )}
        </View>
      </View>

      {/* Quick Actions */}
      {showActions && patient._id && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary || COLORS.primary }]}
            onPress={() => handleActionPress('addVisit')}
          >
            <Ionicons name="add-circle" size={24} color={COLORS.white} />
            <Text style={styles.actionText}>Add Visit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary || COLORS.primary }]}
            onPress={() => handleActionPress('addVitals')}
          >
            <Ionicons name="fitness" size={24} color={COLORS.white} />
            <Text style={styles.actionText}>Add Vitals</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary || COLORS.primary }]}
            onPress={() => handleActionPress('addMedication')}
          >
            <Ionicons name="medkit" size={24} color={COLORS.white} />
            <Text style={styles.actionText}>Add Medication</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Latest Vitals */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text || COLORS.text }]}>
          Latest Vitals
        </Text>
        {reportData?.vitalTrends && reportData.vitalTrends.length > 0 ? (
          <View style={[styles.card, { backgroundColor: colors.white || COLORS.white }]}>
            {(() => {
              const latestVital = reportData.vitalTrends[reportData.vitalTrends.length - 1];
              return (
                <View style={styles.vitalsGrid}>
                  <View style={styles.vitalItem}>
                    <Text style={[styles.detailLabel, { color: colors.gray || COLORS.gray }]}>
                      Blood Pressure
                    </Text>
                    <Text style={[styles.vitalValue, { color: colors.text || COLORS.text }]}>
                      {PatientReportUtils.formatBloodPressure(latestVital.bloodPressure) || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.vitalItem}>
                    <Text style={[styles.detailLabel, { color: colors.gray || COLORS.gray }]}>
                      Heart Rate
                    </Text>
                    <Text style={[styles.vitalValue, { color: colors.text || COLORS.text }]}>
                      {latestVital.heartRate ? `${latestVital.heartRate} bpm` : 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.vitalItem}>
                    <Text style={[styles.detailLabel, { color: colors.gray || COLORS.gray }]}>
                      Weight
                    </Text>
                    <Text style={[styles.vitalValue, { color: colors.text || COLORS.text }]}>
                      {latestVital.weight ? `${latestVital.weight} kg` : 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.vitalItem}>
                    <Text style={[styles.detailLabel, { color: colors.gray || COLORS.gray }]}>
                      Temperature
                    </Text>
                    <Text style={[styles.vitalValue, { color: colors.text || COLORS.text }]}>
                      {latestVital.temperature ? `${latestVital.temperature}°C` : 'N/A'}
                    </Text>
                  </View>
                </View>
              );
            })()}
          </View>
        ) : (
          <View style={[styles.card, { backgroundColor: colors.white || COLORS.white }]}>
            <Text style={[styles.placeholderText, { color: colors.gray || COLORS.gray }]}>
              {patientId && isLoading(patientId) ? 'Loading vitals...' : 'No vitals recorded yet'}
            </Text>
          </View>
        )}
      </View>

      {/* Risk Assessment */}
      {patientId && reportData?.riskAssessment && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text || COLORS.text }]}>
            Risk Assessment Details
          </Text>
          <View style={[styles.card, { backgroundColor: colors.white || COLORS.white }]}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.gray || COLORS.gray }]}>
                Risk Level
              </Text>
              <Text style={[styles.detailValue, { color: colors.text || COLORS.text }]}>
                {reportData.riskAssessment.riskLevel || 'N/A'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.gray || COLORS.gray }]}>
                Risk Score
              </Text>
              <Text style={[styles.detailValue, { color: colors.text || COLORS.text }]}>
                {reportData.riskAssessment.riskScore || 'N/A'}
              </Text>
            </View>
            {reportData.riskAssessment.riskFactors && reportData.riskAssessment.riskFactors.length > 0 && (
              <View style={styles.riskFactorsContainer}>
                <Text style={[styles.subSectionTitle, { color: colors.text || COLORS.text }]}>
                  Risk Factors:
                </Text>
                {reportData.riskAssessment.riskFactors.slice(0, 3).map((factor, index) => (
                  <Text key={index} style={[styles.riskFactor, { color: colors.gray || COLORS.gray }]}>
                    • {factor}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>
      )}

      {/* Current Symptoms/Complications */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text || COLORS.text }]}>
          Potential Complications
        </Text>
        {reportData?.complications && reportData.complications.length > 0 ? (
          <View style={[styles.card, { backgroundColor: colors.white || COLORS.white }]}>
            {reportData.complications.slice(0, 3).map((complication, index) => (
              <View 
                key={index} 
                style={[
                  styles.complicationItem,
                  index === reportData.complications!.slice(0, 3).length - 1 && styles.lastItem
                ]}
              >
                <View style={styles.complicationHeader}>
                  <Text style={[styles.complicationName, { color: colors.text || COLORS.text }]}>
                    {complication.name}
                  </Text>
                  <View style={[
                    styles.probabilityBadge,
                    { backgroundColor: PatientReportUtils.getProbabilityColor(complication.probability, colors) }
                  ]}>
                    <Text style={styles.probabilityText}>
                      {complication.probability}
                    </Text>
                  </View>
                </View>
                {complication.description && (
                  <Text style={[styles.complicationDescription, { color: colors.gray || COLORS.gray }]}>
                    {complication.description}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={[styles.card, { backgroundColor: colors.white || COLORS.white }]}>
            <Text style={[styles.placeholderText, { color: colors.gray || COLORS.gray }]}>
              {patientId && isLoading(patientId) ? 'Loading complications...' : 'No complications identified'}
            </Text>
          </View>
        )}
      </View>

      {/* Current Medications/Recommendations */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text || COLORS.text }]}>
          Current Recommendations
        </Text>
        {reportData?.riskAssessment?.recommendations && reportData.riskAssessment.recommendations.length > 0 ? (
          <View style={[styles.card, { backgroundColor: colors.white || COLORS.white }]}>
            {reportData.riskAssessment.recommendations.slice(0, 3).map((rec, index) => (
              <View 
                key={index} 
                style={[
                  styles.recommendationItem,
                  index === reportData.riskAssessment!.recommendations.slice(0, 3).length - 1 && styles.lastItem
                ]}
              >
                <View style={[
                  styles.priorityDot,
                  { backgroundColor: PatientReportUtils.getPriorityColor(rec.priority, colors) }
                ]} />
                <View style={styles.recommendationContent}>
                  <Text style={[styles.recommendationType, { color: colors.text || COLORS.text }]}>
                    {rec.type}
                  </Text>
                  <Text style={[styles.recommendationDescription, { color: colors.gray || COLORS.gray }]}>
                    {rec.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={[styles.card, { backgroundColor: colors.white || COLORS.white }]}>
            <Text style={[styles.placeholderText, { color: colors.gray || COLORS.gray }]}>
              {patientId && isLoading(patientId) ? 'Loading recommendations...' : 'No recommendations available'}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.medium,
    backgroundColor: COLORS.white,
    ...SHADOWS.light,
  },
  headerInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  patientDetails: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginTop: SIZES.base / 2,
  },
  riskBadge: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.base,
  },
  riskText: {
    color: COLORS.white,
    fontSize: SIZES.small,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SIZES.medium,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: SIZES.medium,
    margin: SIZES.base,
    borderRadius: SIZES.base,
    ...SHADOWS.medium,
  },
  actionText: {
    color: COLORS.white,
    marginLeft: SIZES.base,
    fontWeight: 'bold',
  },
  section: {
    padding: SIZES.medium,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    padding: SIZES.medium,
    ...SHADOWS.light,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.base,
  },
  detailLabel: {
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  detailValue: {
    fontSize: SIZES.font,
    color: COLORS.text,
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
    marginLeft: SIZES.medium,
  },
  placeholderText: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  riskContainer: {
    alignItems: 'flex-end',
  },
  loadingIndicator: {
    marginBottom: SIZES.base / 2,
  },
  riskScore: {
    fontSize: SIZES.small,
    marginTop: SIZES.base / 2,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  vitalItem: {
    width: '50%',
    marginBottom: SIZES.medium,
  },
  vitalValue: {
    fontSize: SIZES.font,
    fontWeight: 'bold',
    marginTop: SIZES.base / 2,
  },
  subSectionTitle: {
    fontSize: SIZES.font,
    fontWeight: '600',
    marginTop: SIZES.medium,
    marginBottom: SIZES.base,
  },
  riskFactorsContainer: {
    marginTop: SIZES.base,
  },
  riskFactor: {
    fontSize: SIZES.small,
    marginBottom: SIZES.base / 2,
  },
  complicationItem: {
    marginBottom: SIZES.medium,
    paddingBottom: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  complicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.base / 2,
  },
  complicationName: {
    fontSize: SIZES.font,
    fontWeight: '600',
    flex: 1,
  },
  probabilityBadge: {
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.base / 2,
  },
  probabilityText: {
    fontSize: SIZES.small,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  complicationDescription: {
    fontSize: SIZES.small,
    lineHeight: SIZES.font * 1.3,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.medium,
    paddingBottom: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: SIZES.base,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationType: {
    fontSize: SIZES.font,
    fontWeight: '600',
    marginBottom: SIZES.base / 2,
  },
  recommendationDescription: {
    fontSize: SIZES.small,
    lineHeight: SIZES.font * 1.3,
  },
  lastItem: {
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
});
