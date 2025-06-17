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

export default function AddMedicationScreen() {
  const { id } = useLocalSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: '',
    instructions: '',
    notes: '',
  });

  const handleSubmit = () => {
    // TODO: Implement medication prescription logic
    console.log('Medication Data:', formData);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Medication Details</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Medication Name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Dosage (e.g., 500mg, 1 tablet)"
            value={formData.dosage}
            onChangeText={(text) => setFormData({ ...formData, dosage: text })}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Frequency (e.g., Twice daily, Every 8 hours)"
            value={formData.frequency}
            onChangeText={(text) => setFormData({ ...formData, frequency: text })}
          />

          <Text style={[styles.sectionTitle, { marginTop: SIZES.medium }]}>
            Duration
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="Start Date (YYYY-MM-DD)"
            value={formData.startDate}
            onChangeText={(text) => setFormData({ ...formData, startDate: text })}
          />
          
          <TextInput
            style={styles.input}
            placeholder="End Date (YYYY-MM-DD)"
            value={formData.endDate}
            onChangeText={(text) => setFormData({ ...formData, endDate: text })}
          />

          <Text style={[styles.sectionTitle, { marginTop: SIZES.medium }]}>
            Additional Information
          </Text>
          
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Instructions for Use"
            value={formData.instructions}
            onChangeText={(text) =>
              setFormData({ ...formData, instructions: text })
            }
            multiline
            numberOfLines={4}
          />
          
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
                Prescribe Medication
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
  input: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    fontSize: SIZES.font,
    ...SHADOWS.light,
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