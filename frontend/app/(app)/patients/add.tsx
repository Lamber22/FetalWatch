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
import { router } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../../../constants/theme';

export default function AddPatientScreen() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    address: '',
    contact: '',
    medicalId: '',
    weekOfPregnancy: '',
    expectedDeliveryDate: '',
  });

  const handleSubmit = () => {
    // TODO: Implement patient registration logic
    console.log('Form Data:', formData);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            value={formData.age}
            onChangeText={(text) => setFormData({ ...formData, age: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Contact Number"
            value={formData.contact}
            onChangeText={(text) => setFormData({ ...formData, contact: text })}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Medical ID"
            value={formData.medicalId}
            onChangeText={(text) => setFormData({ ...formData, medicalId: text })}
          />

          <Text style={[styles.sectionTitle, { marginTop: SIZES.medium }]}>
            Pregnancy Information
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Week of Pregnancy"
            value={formData.weekOfPregnancy}
            onChangeText={(text) =>
              setFormData({ ...formData, weekOfPregnancy: text })
            }
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Expected Delivery Date (YYYY-MM-DD)"
            value={formData.expectedDeliveryDate}
            onChangeText={(text) =>
              setFormData({ ...formData, expectedDeliveryDate: text })
            }
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
                Add Patient
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