import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  FaUserPlus, 
  FaCalendarAlt, 
  FaHeartbeat, 
  FaWeight, 
  FaRulerVertical 
} from 'react-icons/fa';

export default function AddPatientScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gestationalWeek: '',
    bloodPressure: '',
    weight: '',
    height: '',
    medicalHistory: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Validation logic
    if (!formData.firstName || !formData.lastName) {
      alert('Please enter patient name');
      return;
    }

    // Here you would typically send data to backend
    console.log('Patient Data:', formData);
    router.push('/screens/PatientListScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.headerContainer}>
          <FaUserPlus size={50} color="#3498db" />
          <Text style={styles.headerTitle}>Add New Patient</Text>
        </View>

        {/* Personal Information */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter first name"
                value={formData.firstName}
                onChangeText={(text) => handleInputChange('firstName', text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter last name"
                value={formData.lastName}
                onChangeText={(text) => handleInputChange('lastName', text)}
              />
            </View>
          </View>
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Age</Text>
              <View style={styles.iconInputContainer}>
                <FaHeartbeat size={20} color="#e74c3c" style={styles.inputIcon} />
                <TextInput
                  style={styles.iconInput}
                  placeholder="Age"
                  keyboardType="numeric"
                  value={formData.age}
                  onChangeText={(text) => handleInputChange('age', text)}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Gestational Week</Text>
              <View style={styles.iconInputContainer}>
                <FaCalendarAlt size={20} color="#3498db" style={styles.inputIcon} />
                <TextInput
                  style={styles.iconInput}
                  placeholder="Weeks"
                  keyboardType="numeric"
                  value={formData.gestationalWeek}
                  onChangeText={(text) => handleInputChange('gestationalWeek', text)}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Health Measurements */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Health Measurements</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Blood Pressure</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 120/80"
                value={formData.bloodPressure}
                onChangeText={(text) => handleInputChange('bloodPressure', text)}
              />
            </View>
          </View>
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Weight</Text>
              <View style={styles.iconInputContainer}>
                <FaWeight size={20} color="#2ecc71" style={styles.inputIcon} />
                <TextInput
                  style={styles.iconInput}
                  placeholder="kg"
                  keyboardType="numeric"
                  value={formData.weight}
                  onChangeText={(text) => handleInputChange('weight', text)}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Height</Text>
              <View style={styles.iconInputContainer}>
                <FaRulerVertical size={20} color="#9b59b6" style={styles.inputIcon} />
                <TextInput
                  style={styles.iconInput}
                  placeholder="cm"
                  keyboardType="numeric"
                  value={formData.height}
                  onChangeText={(text) => handleInputChange('height', text)}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Medical History */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Medical History</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter any existing medical conditions"
            multiline
            numberOfLines={4}
            value={formData.medicalHistory}
            onChangeText={(text) => handleInputChange('medicalHistory', text)}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Add Patient</Text>
        </TouchableOpacity>
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
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  inputLabel: {
    color: '#7f8c8d',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  iconInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
  },
  inputIcon: {
    marginLeft: 10,
  },
  iconInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
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
