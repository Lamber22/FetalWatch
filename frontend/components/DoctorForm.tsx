import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';

interface DoctorFormProps {
  form: any;
  onChange: (key: string, value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const DoctorForm: React.FC<DoctorFormProps> = ({ form, onChange, onSubmit, onCancel, loading }) => (
  <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
    <TextInput style={styles.input} placeholder="First Name" value={form.firstName} onChangeText={v => onChange('firstName', v)} />
    <TextInput style={styles.input} placeholder="Last Name" value={form.lastName} onChangeText={v => onChange('lastName', v)} />
    <TextInput style={styles.input} placeholder="Email" value={form.email} onChangeText={v => onChange('email', v)} keyboardType="email-address" />
    <TextInput style={styles.input} placeholder="Phone" value={form.phone} onChangeText={v => onChange('phone', v)} keyboardType="phone-pad" />
    <TextInput style={styles.input} placeholder="License Number" value={form.licenseNumber} onChangeText={v => onChange('licenseNumber', v)} />
    <TextInput style={styles.input} placeholder="Specialization" value={form.specialization} onChangeText={v => onChange('specialization', v)} />
    <TextInput style={styles.input} placeholder="Years of Experience" value={form.yearsOfExperience} onChangeText={v => onChange('yearsOfExperience', v)} keyboardType="numeric" />
    <TextInput style={styles.input} placeholder="Hospital Name" value={form.hospitalName} onChangeText={v => onChange('hospitalName', v)} />
    <TextInput style={styles.input} placeholder="Hospital Address" value={form.hospitalAddress} onChangeText={v => onChange('hospitalAddress', v)} />
    <TextInput style={styles.input} placeholder="Bio" value={form.bio} onChangeText={v => onChange('bio', v)} multiline numberOfLines={3} />
    <TouchableOpacity style={styles.addButton} onPress={onSubmit} disabled={loading}>
      <Text style={styles.addButtonText}>{loading ? 'Adding...' : 'Add Doctor'}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
      <Text style={styles.closeButtonText}>Cancel</Text>
    </TouchableOpacity>
  </ScrollView>
);

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#f4f6fb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#2d3a4b',
    borderWidth: 1,
    borderColor: '#e6eaf0',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#2d3a4b',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
    paddingVertical: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#2d3a4b',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DoctorForm; 