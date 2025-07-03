import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useUser } from '../contexts/UserContext';
import { userService } from '../services/UserService';
import { authService } from '../services/AuthService';
import { useRouter } from 'expo-router';

function formatDate(dateString?: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString();
}

const ProfileScreen: React.FC = () => {
  const { user, loading, error, loadUser, clearUser } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, [user]);

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaveError(null);
    try {
      await userService.updateUser(user.id, {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
      });
      setEditMode(false);
      await loadUser();
      Alert.alert('Profile updated!');
    } catch (e: any) {
      setSaveError(e.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await authService.signOut();
      await clearUser();
      router.replace('/(auth)/login');
    } catch (e: any) {
      Alert.alert('Logout failed', e.message || 'Could not log out.');
    } finally {
      setLogoutLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }
  if (error) {
    return <View style={styles.centered}><Text style={styles.error}>{error}</Text></View>;
  }
  if (!user) {
    return <View style={styles.centered}><Text style={styles.error}>No user data found.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={[styles.input, !editMode && styles.inputDisabled]}
          value={form.firstName}
          onChangeText={v => handleChange('firstName', v)}
          editable={editMode}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={[styles.input, !editMode && styles.inputDisabled]}
          value={form.lastName}
          onChangeText={v => handleChange('lastName', v)}
          editable={editMode}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, !editMode && styles.inputDisabled]}
          value={form.email}
          onChangeText={v => handleChange('email', v)}
          editable={editMode}
          keyboardType="email-address"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>{user.role}</Text>
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Account Created</Text>
        <Text style={styles.value}>{formatDate((user as any).createdAt)}</Text>
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Last Updated</Text>
        <Text style={styles.value}>{formatDate((user as any).updatedAt)}</Text>
      </View>
      {saveError && <Text style={styles.error}>{saveError}</Text>}
      {editMode ? (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
            <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setEditMode(false)} disabled={saving}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.editButton} onPress={() => setEditMode(true)}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={logoutLoading}>
        <Text style={styles.logoutButtonText}>{logoutLoading ? 'Logging out...' : 'Logout'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fb',
    padding: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#2d3a4b',
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    color: '#7a869a',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#2d3a4b',
    borderWidth: 1,
    borderColor: '#e6eaf0',
  },
  inputDisabled: {
    backgroundColor: '#e6eaf0',
    color: '#b0b8c1',
  },
  value: {
    fontSize: 16,
    color: '#2d3a4b',
    backgroundColor: '#e6eaf0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  saveButton: {
    backgroundColor: '#2d3a4b',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#2d3a4b',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#2d3a4b',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 32,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 32,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen; 