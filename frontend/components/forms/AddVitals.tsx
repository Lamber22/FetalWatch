import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../constants/Theme';

export default function AddVitalsScreen() {
  const { id } = useLocalSearchParams();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    weight: '',
    hemoglobin: '',
    notes: '',
  });

  const handleSubmit = () => {
    // TODO: Implement vitals recording logic
    console.log('Vitals Data:', formData);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Vital Signs</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={formData.date}
            onChangeText={(text) => setFormData({ ...formData, date: text })}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Time (HH:MM)"
            value={formData.time}
            onChangeText={(text) => setFormData({ ...formData, time: text })}
          />

          <View style={styles.vitalsGrid}>
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>Blood Pressure</Text>
              <TextInput
                style={styles.vitalInput}
                placeholder="e.g., 120/80"
                value={formData.bloodPressure}
                onChangeText={(text) =>
                  setFormData({ ...formData, bloodPressure: text })
                }
                keyboardType="numeric"
              />
            </View>

            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>Heart Rate</Text>
              <TextInput
                style={styles.vitalInput}
                placeholder="bpm"
                value={formData.heartRate}
                onChangeText={(text) =>
                  setFormData({ ...formData, heartRate: text })
                }
                keyboardType="numeric"
              />
            </View>

            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>Temperature</Text>
              <TextInput
                style={styles.vitalInput}
                placeholder="°C"
                value={formData.temperature}
                onChangeText={(text) =>
                  setFormData({ ...formData, temperature: text })
                }
                keyboardType="numeric"
              />
            </View>

            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>Weight</Text>
              <TextInput
                style={styles.vitalInput}
                placeholder="kg"
                value={formData.weight}
                onChangeText={(text) =>
                  setFormData({ ...formData, weight: text })
                }
                keyboardType="numeric"
              />
            </View>

            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>Hemoglobin</Text>
              <TextInput
                style={styles.vitalInput}
                placeholder="g/dL"
                value={formData.hemoglobin}
                onChangeText={(text) =>
                  setFormData({ ...formData, hemoglobin: text })
                }
                keyboardType="numeric"
              />
            </View>
          </View>

          <Text style={[styles.sectionTitle, { marginTop: SIZES.medium }]}>
            Additional Notes
          </Text>
          
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Notes"
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            multiline
            numberOfLines={4}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => router.back()}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={[styles.buttonText, styles.submitButtonText]}>
                Save Vitals
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: SIZES.medium,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -SIZES.base,
  },
  vitalItem: {
    width: '50%',
    padding: SIZES.base,
  },
  vitalLabel: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: SIZES.base / 2,
  },
  vitalInput: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    padding: SIZES.medium,
    fontSize: SIZES.font,
    boxShadow: '0px 2px 3px rgba(0,0,0,0.1)',
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    fontSize: SIZES.font,
    boxShadow: '0px 2px 3px rgba(0,0,0,0.1)',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.medium,
  },
  button: {
    flex: 1,
    padding: SIZES.medium,
    borderRadius: SIZES.base,
    alignItems: 'center',
    marginHorizontal: SIZES.base,
  },
  cancelButton: {
    backgroundColor: COLORS.lightGray,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  submitButtonText: {
    color: COLORS.white,
  },
}); 