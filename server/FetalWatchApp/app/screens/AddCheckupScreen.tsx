import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Switch 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { 
  FaCalendarPlus, 
  FaHeartbeat, 
  FaWeight, 
  FaRulerVertical, 
  FaNotesMedical,
  FaStethoscope 
} from 'react-icons/fa';

export default function AddCheckupScreen() {
  const router = useRouter();
  const [checkupDate, setCheckupDate] = useState(new Date());
  const [formData, setFormData] = useState({
    gestationalWeek: '',
    bloodPressure: '',
    heartRate: '',
    weight: '',
    height: '',
    fetalHeartRate: '',
    notes: '',
    complications: false,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.gestationalWeek || !formData.bloodPressure) {
      alert('Please fill in required fields');
      return;
    }

    // Here you would typically send data to backend
    console.log('Checkup Data:', {
      ...formData,
      date: checkupDate.toISOString()
    });

    // Navigate back to checkup records
    router.push('/screens/CheckupRecordsScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.headerContainer}>
          <FaCalendarPlus size={50} color="#3498db" />
          <Text style={styles.headerTitle}>Add Checkup Record</Text>
        </View>

        {/* Date Selection */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Checkup Date</Text>
          <View style={styles.dateInputWrapper}>
            <View style={styles.dateInputContainer}>
              <FaCalendarPlus size={20} color="#7f8c8d" style={styles.dateInputIcon} />
              <TextInput
                style={styles.dateInput}
                placeholder="Select Checkup Date"
                placeholderTextColor="#7f8c8d"
                value={checkupDate ? checkupDate.toLocaleDateString('en-CA') : ''}
                onChangeText={(text) => {
                  const parsedDate = new Date(text);
                  if (!isNaN(parsedDate.getTime())) {
                    setCheckupDate(parsedDate);
                  }
                }}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Pregnancy Details */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Pregnancy Details</Text>
          <View style={styles.inputContainer}>
            <View style={styles.iconInputContainer}>
              <FaStethoscope size={20} color="#3498db" style={styles.inputIcon} />
              <TextInput
                style={styles.iconInput}
                placeholder="Gestational Week"
                keyboardType="numeric"
                value={formData.gestationalWeek}
                onChangeText={(text) => handleInputChange('gestationalWeek', text)}
              />
            </View>
          </View>
        </View>

        {/* Medical Measurements */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Medical Measurements</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <View style={styles.iconInputContainer}>
                <FaHeartbeat size={20} color="#e74c3c" style={styles.inputIcon} />
                <TextInput
                  style={styles.iconInput}
                  placeholder="Blood Pressure"
                  value={formData.bloodPressure}
                  onChangeText={(text) => handleInputChange('bloodPressure', text)}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.iconInputContainer}>
                <FaHeartbeat size={20} color="#2ecc71" style={styles.inputIcon} />
                <TextInput
                  style={styles.iconInput}
                  placeholder="Heart Rate"
                  keyboardType="numeric"
                  value={formData.heartRate}
                  onChangeText={(text) => handleInputChange('heartRate', text)}
                />
              </View>
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <View style={styles.iconInputContainer}>
                <FaWeight size={20} color="#9b59b6" style={styles.inputIcon} />
                <TextInput
                  style={styles.iconInput}
                  placeholder="Weight (kg)"
                  keyboardType="numeric"
                  value={formData.weight}
                  onChangeText={(text) => handleInputChange('weight', text)}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.iconInputContainer}>
                <FaRulerVertical size={20} color="#f39c12" style={styles.inputIcon} />
                <TextInput
                  style={styles.iconInput}
                  placeholder="Fetal Heart Rate"
                  keyboardType="numeric"
                  value={formData.fetalHeartRate}
                  onChangeText={(text) => handleInputChange('fetalHeartRate', text)}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Complications */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Complications</Text>
          <View style={styles.switchContainer}>
            <FaNotesMedical size={20} color="#e74c3c" style={styles.inputIcon} />
            <Text style={styles.switchLabel}>Any Complications Detected?</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={formData.complications ? "#f5dd4b" : "#f4f3f4"}
              onValueChange={(value) => handleInputChange('complications', value.toString())}
              value={formData.complications}
            />
          </View>
        </View>

        {/* Additional Notes */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Additional Notes</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder="Enter any additional observations or notes"
            value={formData.notes}
            onChangeText={(text) => handleInputChange('notes', text)}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Save Checkup Record</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dateInputWrapper: {
    marginBottom: 15,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
  },
  dateInputIcon: {
    marginRight: 10,
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
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
  datePickerContainer: {
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
    marginBottom: 10,
  },
  inputIcon: {
    marginLeft: 10,
  },
  iconInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 10,
  },
  textArea: {
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    marginHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
