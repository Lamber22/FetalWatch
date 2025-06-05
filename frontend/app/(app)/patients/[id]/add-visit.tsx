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
import { COLORS, SIZES, SHADOWS } from '../../../../constants/theme';

export default function AddVisitScreen() {
  const { id } = useLocalSearchParams();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    type: '',
    notes: '',
    symptoms: '',
    recommendations: '',
  });

  const handleSubmit = () => {
    // TODO: Implement visit recording logic
    console.log('Visit Data:', formData);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Visit Details</Text>
          
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
          
          <TextInput
            style={styles.input}
            placeholder="Visit Type (e.g., Regular Checkup, Ultrasound)"
            value={formData.type}
            onChangeText={(text) => setFormData({ ...formData, type: text })}
          />

          <Text style={[styles.sectionTitle, { marginTop: SIZES.medium }]}>
            Clinical Notes
          </Text>
          
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Notes"
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            multiline
            numberOfLines={4}
          />
          
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Symptoms"
            value={formData.symptoms}
            onChangeText={(text) => setFormData({ ...formData, symptoms: text })}
            multiline
            numberOfLines={4}
          />
          
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Recommendations"
            value={formData.recommendations}
            onChangeText={(text) =>
              setFormData({ ...formData, recommendations: text })
            }
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
                Save Visit
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