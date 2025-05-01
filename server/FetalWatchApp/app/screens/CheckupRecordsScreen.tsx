import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  FaClipboardList, 
  FaCalendarCheck, 
  FaHeartbeat, 
  FaWeight, 
  FaRulerVertical,
  FaEye 
} from 'react-icons/fa';

// Mock Checkup Data
const checkupRecords = [
  {
    id: '1',
    date: '2025-04-15',
    gestationalWeek: 22,
    bloodPressure: '138/88',
    heartRate: 76,
    weight: 68,
    height: 165,
    notes: 'Slight blood pressure elevation, recommend monitoring',
    recommendations: [
      'Reduce sodium intake',
      'Increase light exercise',
      'Follow-up in 2 weeks'
    ]
  },
  {
    id: '2',
    date: '2025-03-20',
    gestationalWeek: 16,
    bloodPressure: '132/82',
    heartRate: 72,
    weight: 65,
    height: 165,
    notes: 'Normal progress, fetal development on track',
    recommendations: [
      'Continue prenatal vitamins',
      'Schedule next ultrasound'
    ]
  },
  // Add more records as needed
];

export default function CheckupRecordsScreen() {
  const router = useRouter();
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openRecordDetails = (record) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const renderCheckupRecord = (record) => (
    <TouchableOpacity 
      key={record.id} 
      style={styles.recordCard}
      onPress={() => openRecordDetails(record)}
    >
      <View style={styles.recordHeader}>
        <FaCalendarCheck size={20} color="#3498db" />
        <Text style={styles.recordDate}>{record.date}</Text>
      </View>
      <View style={styles.recordDetails}>
        <View style={styles.recordDetailItem}>
          <FaHeartbeat size={16} color="#e74c3c" />
          <Text style={styles.recordDetailText}>
            BP: {record.bloodPressure}
          </Text>
        </View>
        <View style={styles.recordDetailItem}>
          <FaWeight size={16} color="#2ecc71" />
          <Text style={styles.recordDetailText}>
            Weight: {record.weight} kg
          </Text>
        </View>
        <View style={styles.recordDetailItem}>
          <FaRulerVertical size={16} color="#9b59b6" />
          <Text style={styles.recordDetailText}>
            Gestational Week: {record.gestationalWeek}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.headerContainer}>
          <FaClipboardList size={50} color="#3498db" />
          <Text style={styles.headerTitle}>Checkup Records</Text>
        </View>

        {/* Checkup Records List */}
        <View style={styles.recordsContainer}>
          {checkupRecords.length > 0 ? (
            checkupRecords.map(renderCheckupRecord)
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No checkup records found</Text>
            </View>
          )}
        </View>

        {/* Record Details Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          {selectedRecord && (
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <FaEye size={24} color="#3498db" />
                  <Text style={styles.modalHeaderTitle}>
                    Checkup Details - {selectedRecord.date}
                  </Text>
                </View>

                <ScrollView>
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Medical Measurements</Text>
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Blood Pressure:</Text>
                      <Text style={styles.modalDetailValue}>
                        {selectedRecord.bloodPressure} mmHg
                      </Text>
                    </View>
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Heart Rate:</Text>
                      <Text style={styles.modalDetailValue}>
                        {selectedRecord.heartRate} bpm
                      </Text>
                    </View>
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Weight:</Text>
                      <Text style={styles.modalDetailValue}>
                        {selectedRecord.weight} kg
                      </Text>
                    </View>
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Gestational Week:</Text>
                      <Text style={styles.modalDetailValue}>
                        {selectedRecord.gestationalWeek}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Checkup Notes</Text>
                    <Text style={styles.modalNotes}>
                      {selectedRecord.notes}
                    </Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Recommendations</Text>
                    {selectedRecord.recommendations.map((rec, index) => (
                      <View key={index} style={styles.recommendationItem}>
                        <Text style={styles.recommendationText}>
                          • {rec}
                        </Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>

                <TouchableOpacity 
                  style={styles.modalCloseButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalCloseButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Modal>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/screens/AddCheckupScreen')}
          >
            <Text style={styles.actionButtonText}>Add New Checkup</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // [Styles omitted for brevity, similar to previous screens]
  // You can copy the styles from previous screens and adjust as needed
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
  recordsContainer: {
    padding: 15,
  },
  recordCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recordDate: {
    marginLeft: 10,
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  recordDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recordDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordDetailText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#7f8c8d',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    color: '#7f8c8d',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalHeaderTitle: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  modalDetailLabel: {
    color: '#7f8c8d',
  },
  modalDetailValue: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  modalNotes: {
    color: '#2c3e50',
    fontSize: 14,
  },
  recommendationItem: {
    marginBottom: 5,
  },
  recommendationText: {
    color: '#2c3e50',
  },
  modalCloseButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionContainer: {
    padding: 15,
  },
  actionButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
