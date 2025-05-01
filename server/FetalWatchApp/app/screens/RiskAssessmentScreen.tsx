import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  FaHeartbeat, 
  FaExclamationTriangle, 
  FaChartLine, 
  FaNotesMedical 
} from 'react-icons/fa';

export default function RiskAssessmentScreen() {
  const router = useRouter();
  const [riskFactors, setRiskFactors] = useState({
    bloodPressure: 140,
    heartRate: 82,
    gestationalDiabetes: false,
    preeclampsia: false,
    previousComplications: false,
    age: 32,
  });

  const calculateRiskScore = () => {
    let score = 0;

    // Blood Pressure Risk
    if (riskFactors.bloodPressure > 130) score += 2;

    // Heart Rate Risk
    if (riskFactors.heartRate > 80) score += 1;

    // Age Risk
    if (riskFactors.age > 35) score += 2;

    // Medical Condition Risks
    if (riskFactors.gestationalDiabetes) score += 3;
    if (riskFactors.preeclampsia) score += 3;
    if (riskFactors.previousComplications) score += 2;

    return score;
  };

  const getRiskLevel = (score: number) => {
    if (score <= 3) return { level: 'Low', color: '#2ecc71' };
    if (score <= 6) return { level: 'Medium', color: '#f39c12' };
    return { level: 'High', color: '#e74c3c' };
  };

  const riskScore = calculateRiskScore();
  const { level: riskLevel, color: riskColor } = getRiskLevel(riskScore);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.headerContainer}>
          <FaExclamationTriangle size={50} color="#e74c3c" />
          <Text style={styles.headerTitle}>Risk Assessment</Text>
        </View>

        {/* Overall Risk */}
        <View style={styles.riskSummaryContainer}>
          <Text style={styles.riskSummaryTitle}>Overall Risk Level</Text>
          <View 
            style={[
              styles.riskLevelBadge, 
              { backgroundColor: riskColor }
            ]}
          >
            <Text style={styles.riskLevelText}>{riskLevel} Risk</Text>
          </View>
          <Text style={styles.riskScoreText}>Risk Score: {riskScore}</Text>
        </View>

        {/* Risk Factors */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Risk Factors</Text>
          
          {/* Blood Pressure */}
          <View style={styles.riskFactorItem}>
            <FaHeartbeat size={24} color="#e74c3c" />
            <View style={styles.riskFactorDetails}>
              <Text style={styles.riskFactorLabel}>Blood Pressure</Text>
              <Text style={styles.riskFactorValue}>
                {riskFactors.bloodPressure} mmHg
                {riskFactors.bloodPressure > 130 && 
                  <Text style={styles.riskWarning}> (Elevated)</Text>
                }
              </Text>
            </View>
          </View>

          {/* Heart Rate */}
          <View style={styles.riskFactorItem}>
            <FaChartLine size={24} color="#3498db" />
            <View style={styles.riskFactorDetails}>
              <Text style={styles.riskFactorLabel}>Heart Rate</Text>
              <Text style={styles.riskFactorValue}>
                {riskFactors.heartRate} bpm
                {riskFactors.heartRate > 80 && 
                  <Text style={styles.riskWarning}> (Slightly Elevated)</Text>
                }
              </Text>
            </View>
          </View>

          {/* Medical Conditions */}
          <View style={styles.riskFactorItem}>
            <FaNotesMedical size={24} color="#9b59b6" />
            <View style={styles.riskFactorDetails}>
              <Text style={styles.riskFactorLabel}>Medical Conditions</Text>
              <View>
                {riskFactors.gestationalDiabetes && 
                  <Text style={styles.riskWarning}>• Gestational Diabetes</Text>
                }
                {riskFactors.preeclampsia && 
                  <Text style={styles.riskWarning}>• Preeclampsia Risk</Text>
                }
                {riskFactors.previousComplications && 
                  <Text style={styles.riskWarning}>• Previous Pregnancy Complications</Text>
                }
                {!riskFactors.gestationalDiabetes && 
                 !riskFactors.preeclampsia && 
                 !riskFactors.previousComplications && 
                  <Text style={styles.noRiskText}>No Additional Risks Detected</Text>
                }
              </View>
            </View>
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          <View style={styles.recommendationContainer}>
            {riskLevel === 'High' && (
              <>
                <Text style={styles.recommendationText}>
                  • Schedule more frequent prenatal checkups
                </Text>
                <Text style={styles.recommendationText}>
                  • Consider specialized maternal-fetal medicine consultation
                </Text>
                <Text style={styles.recommendationText}>
                  • Monitor blood pressure and glucose levels closely
                </Text>
              </>
            )}
            {riskLevel === 'Medium' && (
              <>
                <Text style={styles.recommendationText}>
                  • Increase monitoring frequency
                </Text>
                <Text style={styles.recommendationText}>
                  • Maintain a healthy diet and exercise routine
                </Text>
                <Text style={styles.recommendationText}>
                  • Regular blood tests and ultrasounds
                </Text>
              </>
            )}
            {riskLevel === 'Low' && (
              <>
                <Text style={styles.recommendationText}>
                  • Continue standard prenatal care
                </Text>
                <Text style={styles.recommendationText}>
                  • Maintain healthy lifestyle
                </Text>
                <Text style={styles.recommendationText}>
                  • Regular checkups as scheduled
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/screens/PatientDetailScreen')}
          >
            <Text style={styles.actionButtonText}>View Patient Details</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => {/* Trigger alert or notification system */}}
          >
            <Text style={styles.actionButtonText}>Notify Healthcare Provider</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  headerContainer: {
    backgroundColor: '#e74c3c',
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  riskSummaryContainer: {
    backgroundColor: 'white',
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  riskSummaryTitle: {
    fontSize: 18,
    color: '#2c3e50',
    marginBottom: 10,
  },
  riskLevelBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  riskLevelText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  riskScoreText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  sectionContainer: {
    backgroundColor: 'white',
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  riskFactorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 10,
  },
  riskFactorDetails: {
    marginLeft: 15,
    flex: 1,
  },
  riskFactorLabel: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  riskFactorValue: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  riskWarning: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  noRiskText: {
    color: '#2ecc71',
  },
  recommendationContainer: {
    backgroundColor: '#e8f4f8',
    padding: 15,
    borderRadius: 10,
  },
  recommendationText: {
    color: '#2c3e50',
    fontSize: 14,
    marginBottom: 5,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    paddingHorizontal: 15,
  },
  actionButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#2ecc71',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
