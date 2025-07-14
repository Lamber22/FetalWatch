import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { ThemedText } from '../ThemedText';
import { userService } from '../../services/UserService';
import { Picker } from '@react-native-picker/picker';

interface AddUserProps {
  onClose: () => void;
  onUserAdded?: (user: any) => void;
  currentUserRole: 'admin' | 'healthProvider';
}

export default function AddUser({ onClose, onUserAdded, currentUserRole }: AddUserProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(currentUserRole === 'admin' ? 'admin' : 'doctor');
  const [loading, setLoading] = useState(false);

  console.log('AddUser currentUserRole:', currentUserRole, 'loading:', loading);

  // Role options
  const roleOptions = currentUserRole === 'admin'
    ? [{ label: 'Admin', value: 'admin' }]
    : [
        { label: 'Doctor', value: 'doctor' },
        { label: 'Nurse', value: 'nurse' },
        { label: 'Midwife', value: 'midwife' },
      ];

  const handleAddUser = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }
    setLoading(true);
    try {
      const user = await userService.createUser({ firstName, lastName, email, password, role });
      Alert.alert('Success', 'User added successfully!');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setRole(currentUserRole === 'admin' ? 'admin' : 'doctor');
      if (onUserAdded) onUserAdded(user);
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
      <ThemedText>First Name</ThemedText>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="First Name"
        editable={true && !loading}
      />
      <ThemedText>Last Name</ThemedText>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Last Name"
        editable={true && !loading}
      />
      <ThemedText>Email</ThemedText>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        editable={true && !loading}
      />
      <ThemedText>Role</ThemedText>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={role}
          onValueChange={setRole}
          style={styles.picker}
          enabled={currentUserRole !== 'admin' ? true : false}
        >
          {roleOptions.map(opt => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>
      <ThemedText>Password</ThemedText>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        editable={true && !loading}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddUser}
        disabled={loading}
      >
        <ThemedText style={styles.addButtonText}>{loading ? 'Adding...' : 'Add User'}</ThemedText>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    gap: 10,
    padding: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 44,
    width: '100%',
  },
  addButton: {
    backgroundColor: '#5271FF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
