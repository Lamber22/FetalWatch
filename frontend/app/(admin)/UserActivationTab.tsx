import React, { useEffect, useState } from 'react';
import { View, Button, FlatList, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { userService } from '../../services/UserService';
import { PendingUser } from '../../interface/iUser';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import Modal from '../../components/ui/Modal';
import AddUser from '../../components/shared/AddUser';

export default function UserActivationTab() {
  // TODO: Replace this with your actual user context or auth logic
  const [currentUserRole] = useState<'admin' | 'healthProvider'>('admin'); // or 'healthProvider'
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addUserModalVisible, setAddUserModalVisible] = useState(false);

  useEffect(() => {
    userService.getPendingActivationUsers().then(users => {
      // Ensure each user has an 'id' property for activation
      const mappedUsers = users.map(u => ({ ...u, id: u.id || (u as any)._id }));
      setPendingUsers(mappedUsers);
      setLoading(false);
    });
  }, []);

  const handleActivate = async (userId: string | undefined) => {
    if (!userId) {
      console.warn('Attempted to activate user with undefined id:', userId);
      Alert.alert('Activation Failed', 'User ID is undefined.');
      return;
    }
    try {
      await userService.activateUser(userId);
      setPendingUsers(pendingUsers.filter(u => u.id !== userId));
      Alert.alert('Success', 'Account activated successfully.');
    } catch (error: any) {
      const message = error?.message || 'Unknown error';
      Alert.alert('Activation Failed', message);
    }
  };

  if (loading) return <ThemedText>Loading...</ThemedText>;

  return (
    <ThemedView style={styles.container}>
      {/* Add User Button */}
      <View style={{ alignItems: 'flex-end', marginBottom: 12 }}>
        <TouchableOpacity
          style={styles.addUserButton}
          onPress={() => setAddUserModalVisible(true)}
        >
          <ThemedText style={styles.addUserButtonText}>+ Add User</ThemedText>
        </TouchableOpacity>
      </View>
      <FlatList
        data={pendingUsers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ThemedView style={styles.userRow}>
            <ThemedText type="defaultSemiBold">{item.firstName} {item.lastName}</ThemedText>
            <ThemedText type="subtitle">({item.email})</ThemedText>
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.activateButton} onPress={() => handleActivate(item.id)}>
                <ThemedText style={styles.activateButtonText}>Activate</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.viewButton} onPress={() => { setSelectedUser(item); setModalVisible(true); }}>
                <ThemedText style={styles.viewButtonText}>View</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        )}
        ListEmptyComponent={<ThemedText>No users to activate.</ThemedText>}
        style={{ flexGrow: 0 }}
      />
      {/* Add User Modal */}
      {addUserModalVisible && (
        <Modal
          visible={addUserModalVisible}
          onClose={() => setAddUserModalVisible(false)}
          title="Add Admin User"
          size="medium"
        >
          <AddUser
            onClose={() => setAddUserModalVisible(false)}
            onUserAdded={user => {
              setAddUserModalVisible(false);
              // Optionally, refresh pending users or show a message
            }}
            currentUserRole={currentUserRole}
          />
        </Modal>
      )}
      {selectedUser && (
        <Modal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          title="User Details"
          size="medium"
        >
          <ScrollView style={{maxHeight: 400, minWidth: 280, maxWidth: 350, padding: 8}} contentContainerStyle={{gap: 8}}>
            <ThemedText type="subtitle" style={{textAlign: 'center', marginBottom: 8}}>{selectedUser.firstName} {selectedUser.lastName}</ThemedText>
            <ThemedText>Email: {selectedUser.email}</ThemedText>
            <ThemedText>Role: {selectedUser.role}</ThemedText>
            <ThemedText>Status: {selectedUser.isActive ? 'Active' : 'Inactive'}</ThemedText>
            {/* Facility details from either direct properties or nested facility object */}
            {('facilityName' in selectedUser || (selectedUser as any).facilityName) && (
              <ThemedText>Facility Name: {(selectedUser as any).facilityName}</ThemedText>
            )}
            {/* Address: handle string or object */}
            {('facilityAddress' in selectedUser || (selectedUser as any).facilityAddress) && (
              typeof (selectedUser as any).facilityAddress === 'string' ? (
                <ThemedText>Facility Address: {(selectedUser as any).facilityAddress}</ThemedText>
              ) : typeof (selectedUser as any).facilityAddress === 'object' && (selectedUser as any).facilityAddress !== null ? (
                <ThemedText>Facility Address: {Object.entries((selectedUser as any).facilityAddress).map(([k, v]) => `${k}: ${v}`).join(', ')}</ThemedText>
              ) : null
            )}
            {('facilityPhone' in selectedUser || (selectedUser as any).facilityPhone) && (
              <ThemedText>Facility Phone: {(selectedUser as any).facilityPhone}</ThemedText>
            )}
            {('facilityType' in selectedUser || (selectedUser as any).facilityType) && (
              <ThemedText>Facility Type: {(selectedUser as any).facilityType}</ThemedText>
            )}
            {('facilityLicenseNumber' in selectedUser || (selectedUser as any).facilityLicenseNumber) && (
              <ThemedText>Facility License #: {(selectedUser as any).facilityLicenseNumber}</ThemedText>
            )}
            {('facilityServices' in selectedUser || (selectedUser as any).facilityServices) && Array.isArray((selectedUser as any).facilityServices) && (
              <ThemedText>Facility Services: {(selectedUser as any).facilityServices.join(', ')}</ThemedText>
            )}
            {/* If user has a nested facility object, show its details too */}
            {(selectedUser as any).facility && (
              <>
                {(selectedUser as any).facility.name && <ThemedText>Facility Name: {(selectedUser as any).facility.name}</ThemedText>}
                {/* Address: handle string or object */}
                {(selectedUser as any).facility.address && (typeof (selectedUser as any).facility.address === 'string' ? (
                  <ThemedText>Facility Address: {(selectedUser as any).facility.address}</ThemedText>
                ) : typeof (selectedUser as any).facility.address === 'object' && (selectedUser as any).facility.address !== null ? (
                  <ThemedText>Facility Address: {Object.entries((selectedUser as any).facility.address).map(([k, v]) => `${k}: ${v}`).join(', ')}</ThemedText>
                ) : null)}
                {(selectedUser as any).facility.facilityPhone && <ThemedText>Facility Phone: {(selectedUser as any).facility.facilityPhone}</ThemedText>}
                {(selectedUser as any).facility.facilityType && <ThemedText>Facility Type: {(selectedUser as any).facility.facilityType}</ThemedText>}
                {(selectedUser as any).facility.facilityLicenseNumber && <ThemedText>Facility License #: {(selectedUser as any).facility.facilityLicenseNumber}</ThemedText>}
                {(selectedUser as any).facility.facilityServices && Array.isArray((selectedUser as any).facility.facilityServices) && (
                  <ThemedText>Facility Services: {(selectedUser as any).facility.facilityServices.join(', ')}</ThemedText>
                )}
              </>
            )}
            {selectedUser.createdAt && <ThemedText>Created: {new Date(selectedUser.createdAt).toLocaleString()}</ThemedText>}
            {selectedUser.updatedAt && <ThemedText>Updated: {new Date(selectedUser.updatedAt).toLocaleString()}</ThemedText>}
          </ScrollView>
        </Modal>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  userRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderRadius: 8, padding: 12, backgroundColor: 'rgba(82,113,255,0.07)' },
  actionRow: { flexDirection: 'row', gap: 8 },
  activateButton: { backgroundColor: '#5271FF', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16 },
  activateButtonText: { color: '#fff', fontWeight: 'bold' },
  viewButton: { backgroundColor: '#6C63FF', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16 },
  viewButtonText: { color: '#fff', fontWeight: 'bold' },
  addUserButton: {
    backgroundColor: '#5271FF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  addUserButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
