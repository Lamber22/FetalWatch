import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/Theme';
import { useTheme } from '../../contexts/ThemeContext';

interface Patient {
  _id?: string;
  name: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  contact?: string;
  weekOfPregnancy?: number;
  expectedDeliveryDate?: string;
  createdAt?: string;
}

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

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return 'N/A';
    const birth = new Date(dateOfBirth);
    const today = new Date();
    return Math.floor((today.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  };

  const getRiskLevel = (weekOfPregnancy?: number) => {
    if (!weekOfPregnancy) return 'Medium';
    if (weekOfPregnancy < 20 || weekOfPregnancy > 35) return 'High';
    if (weekOfPregnancy < 24 || weekOfPregnancy > 32) return 'Medium';
    return 'Low';
  };

  const age = calculateAge(patient.dateOfBirth);
  const riskLevel = getRiskLevel(patient.weekOfPregnancy);

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
            Age: {age} {patient._id && `• ID: ${patient._id}`}
          </Text>
        </View>
        <View
          style={[
            styles.riskBadge,
            {
              backgroundColor:
                riskLevel === 'High'
                  ? colors.error || COLORS.error
                  : riskLevel === 'Medium'
                  ? colors.warning || COLORS.warning
                  : colors.success || COLORS.success,
            },
          ]}
        >
          <Text style={styles.riskText}>{riskLevel} Risk</Text>
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

      {/* Patient Info */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text || COLORS.text }]}>
          Patient Information
        </Text>
        <View style={[styles.card, { backgroundColor: colors.white || COLORS.white }]}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.gray || COLORS.gray }]}>
              Full Name
            </Text>
            <Text style={[styles.detailValue, { color: colors.text || COLORS.text }]}>
              {patient.name}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.gray || COLORS.gray }]}>
              Gender
            </Text>
            <Text style={[styles.detailValue, { color: colors.text || COLORS.text }]}>
              {patient.gender || 'N/A'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.gray || COLORS.gray }]}>
              Address
            </Text>
            <Text style={[styles.detailValue, { color: colors.text || COLORS.text }]}>
              {patient.address || 'N/A'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.gray || COLORS.gray }]}>
              Contact
            </Text>
            <Text style={[styles.detailValue, { color: colors.text || COLORS.text }]}>
              {patient.contact || 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      {/* Pregnancy Details */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text || COLORS.text }]}>
          Pregnancy Details
        </Text>
        <View style={[styles.card, { backgroundColor: colors.white || COLORS.white }]}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.gray || COLORS.gray }]}>
              Week of Pregnancy
            </Text>
            <Text style={[styles.detailValue, { color: colors.text || COLORS.text }]}>
              {patient.weekOfPregnancy || 'N/A'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.gray || COLORS.gray }]}>
              Expected Delivery
            </Text>
            <Text style={[styles.detailValue, { color: colors.text || COLORS.text }]}>
              {patient.expectedDeliveryDate || 'N/A'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.gray || COLORS.gray }]}>
              Risk Level
            </Text>
            <Text style={[styles.detailValue, { color: colors.text || COLORS.text }]}>
              {riskLevel}
            </Text>
          </View>
        </View>
      </View>

      {/* Placeholder sections for future data */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text || COLORS.text }]}>
          Latest Vitals
        </Text>
        <View style={[styles.card, { backgroundColor: colors.white || COLORS.white }]}>
          <Text style={[styles.placeholderText, { color: colors.gray || COLORS.gray }]}>
            No vitals recorded yet
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text || COLORS.text }]}>
          Current Symptoms
        </Text>
        <View style={[styles.card, { backgroundColor: colors.white || COLORS.white }]}>
          <Text style={[styles.placeholderText, { color: colors.gray || COLORS.gray }]}>
            No symptoms recorded
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text || COLORS.text }]}>
          Current Medications
        </Text>
        <View style={[styles.card, { backgroundColor: colors.white || COLORS.white }]}>
          <Text style={[styles.placeholderText, { color: colors.gray || COLORS.gray }]}>
            No medications recorded
          </Text>
        </View>
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
});
