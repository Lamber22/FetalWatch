import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  FaBaby, 
  FaCalendarAlt, 
  FaHeartbeat, 
  FaChild, 
  FaChartLine 
} from 'react-icons/fa';

// Mock Pregnancy Tracking Data
const pregnancyStages = [
  {
    week: 4,
    title: 'Early Pregnancy',
    description: 'Embryo is developing basic structures',
    milestones: [
      'Implantation complete',
      'Primitive heart forming',
      'Neural tube developing'
    ],
    imageUrl: null
  },
  {
    week: 12,
    title: 'First Trimester',
    description: 'Major organ development begins',
    milestones: [
      'Fetus is fully formed',
      'Fingers and toes visible',
      'Facial features developing'
    ],
    imageUrl: null
  },
  {
    week: 24,
    title: 'Second Trimester',
    description: 'Rapid growth and movement',
    milestones: [
      'Fetal movement becomes noticeable',
      'Lungs developing',
      'Skin becoming less transparent'
    ],
    imageUrl: null
  },
  {
    week: 36,
    title: 'Third Trimester',
    description: 'Preparing for birth',
    milestones: [
      'Gaining weight rapidly',
      'Bones fully developed',
      'Immune system strengthening'
    ],
    imageUrl: null
  }
];

export default function PregnancyTrackingScreen() {
  const router = useRouter();
  const [currentGestationalWeek, setCurrentGestationalWeek] = useState(24);

  const getCurrentStage = () => {
    return pregnancyStages.reduce((prev, current) => 
      (current.week <= currentGestationalWeek && current.week > prev.week) ? current : prev
    );
  };

  const currentStage = getCurrentStage();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.headerContainer}>
          <FaBaby size={50} color="#3498db" />
          <Text style={styles.headerTitle}>Pregnancy Tracking</Text>
        </View>

        {/* Current Stage Overview */}
        <View style={styles.stageContainer}>
          <View style={styles.stageHeader}>
            <FaCalendarAlt size={24} color="#2ecc71" />
            <Text style={styles.stageHeaderText}>
              Current Stage: {currentStage.title}
            </Text>
          </View>
          
          <View style={styles.stageContent}>
            <View style={styles.stageImagePlaceholder}>
              <Text style={styles.stageImagePlaceholderText}>Week {currentStage.week}</Text>
            </View>
            <View style={styles.stageTextContainer}>
              <Text style={styles.stageDescription}>
                {currentStage.description}
              </Text>
              <Text style={styles.gestationalWeekText}>
                Gestational Week: {currentGestationalWeek}
              </Text>
            </View>
          </View>
        </View>

        {/* Milestones */}
        <View style={styles.milestonesContainer}>
          <View style={styles.milestonesHeader}>
            <FaChartLine size={24} color="#e74c3c" />
            <Text style={styles.milestonesHeaderText}>
              Key Milestones
            </Text>
          </View>
          {currentStage.milestones.map((milestone, index) => (
            <View key={index} style={styles.milestoneItem}>
              <FaChild size={20} color="#3498db" />
              <Text style={styles.milestoneText}>{milestone}</Text>
            </View>
          ))}
        </View>

        {/* Health Indicators */}
        <View style={styles.healthIndicatorsContainer}>
          <View style={styles.healthIndicatorsHeader}>
            <FaHeartbeat size={24} color="#9b59b6" />
            <Text style={styles.healthIndicatorsHeaderText}>
              Health Indicators
            </Text>
          </View>
          <View style={styles.healthIndicatorItem}>
            <Text style={styles.healthIndicatorLabel}>Fetal Heart Rate</Text>
            <Text style={styles.healthIndicatorValue}>
              {Math.round(120 + Math.random() * 20)} bpm
            </Text>
          </View>
          <View style={styles.healthIndicatorItem}>
            <Text style={styles.healthIndicatorLabel}>Estimated Fetal Weight</Text>
            <Text style={styles.healthIndicatorValue}>
              {(0.5 + Math.random() * 0.5).toFixed(2)} kg
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/screens/AddCheckupScreen')}
          >
            <Text style={styles.actionButtonText}>Log New Checkup</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => router.push('/screens/RiskAssessmentScreen')}
          >
            <Text style={styles.actionButtonText}>Risk Assessment</Text>
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
    backgroundColor: '#3498db',
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  stageContainer: {
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
  stageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stageHeaderText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  stageContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stageImagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#f1f2f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginRight: 15,
  },
  stageImagePlaceholderText: {
    color: '#2c3e50',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stageImage: {
    width: 100,
    height: 100,
    marginRight: 15,
  },
  stageTextContainer: {
    flex: 1,
  },
  stageDescription: {
    color: '#7f8c8d',
    fontSize: 14,
    marginBottom: 5,
  },
  gestationalWeekText: {
    color: '#2c3e50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  milestonesContainer: {
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
  milestonesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  milestonesHeaderText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  milestoneText: {
    marginLeft: 10,
    color: '#2c3e50',
    fontSize: 16,
  },
  healthIndicatorsContainer: {
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
  healthIndicatorsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  healthIndicatorsHeaderText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  healthIndicatorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  healthIndicatorLabel: {
    color: '#7f8c8d',
    fontSize: 16,
  },
  healthIndicatorValue: {
    color: '#2c3e50',
    fontSize: 16,
    fontWeight: 'bold',
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
