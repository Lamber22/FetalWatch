import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { ScrollView } from 'react-native';
import { userService } from '../../services/UserService';
import { User, UserWithFacility } from '../../interface/iUser';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import Modal from '../../components/ui/Modal';
import SearchFilterBar from '../../components/ui/Search';
import { useThemeColor } from '../../hooks/useThemeColor';
import Button from '../../components/ui/Button';

export default function UsersInfoTab() {
  const [users, setUsers] = useState<UserWithFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<'createdAt' | 'updatedAt' | null>(null);

  const background = useThemeColor({}, 'background');
  const border = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const tint = useThemeColor({}, 'tint');

  const roles = [
    { label: 'All', value: null },
    { label: 'Doctor', value: 'doctor' },
    { label: 'Midwife', value: 'midwife' },
    { label: 'Admin', value: 'admin' },
    { label: 'Health Provider', value: 'healthProvider' },
  ];

  useEffect(() => {
    // Fetch all users (admin)
    userService.getAllUsers().then(users => {
      // Ensure each user has an 'id' property for deactivation
      const mappedUsers = users.map(u => ({ ...u, id: u.id || (u as any)._id }));
      setUsers(mappedUsers);
      setLoading(false);
    });
  }, []);

  const filteredUsers = users
    .filter(user => {
      const matchesSearch =
        (user.firstName && user.firstName.toLowerCase().includes(search.toLowerCase())) ||
        (user.lastName && user.lastName.toLowerCase().includes(search.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(search.toLowerCase()));
      const matchesRole = filterRole ? user.role === filterRole : true;
      return matchesSearch && matchesRole;
    })
    .filter(user => {
      if (!dateFilter) return true;
      // Only include users with the relevant date field
      return Boolean(user[dateFilter]);
    })
    .sort((a, b) => {
      // Always sort by selected date filter if set, otherwise by createdAt (most recent first)
      const sortField = dateFilter || 'createdAt';
      const aDate = a[sortField] ? new Date(a[sortField] as string).getTime() : 0;
      const bDate = b[sortField] ? new Date(b[sortField] as string).getTime() : 0;
      return bDate - aDate;
    });

  if (loading) return <ThemedText>Loading...</ThemedText>;

  // Responsive Table Headers
  const tableHeaders = [
    'Name',
    'Role',
    'Status',
    'Actions',
  ];

  return (
    <ThemedView style={[styles.container, { backgroundColor: background }]}> 
      <SearchFilterBar
        search={search}
        setSearch={setSearch}
        filterRole={filterRole}
        setFilterRole={setFilterRole}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />
      <View style={[styles.table, { backgroundColor: background, borderColor: border }]}> 
        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeaderRow, { backgroundColor: tint + '20' }]}> 
          <View style={[styles.tableCell, { flex: 2 }]}> 
            <ThemedText style={[styles.tableHeaderText, { color: tint } ]}>Name</ThemedText>
          </View>
          <View style={[styles.tableCell, { flex: 1 }]}> 
            <ThemedText style={[styles.tableHeaderText, { color: tint } ]}>Status</ThemedText>
          </View>
          <View style={[styles.tableCell, { flex: 2 }]}> 
            <ThemedText style={[styles.tableHeaderText, { color: tint } ]}>Actions</ThemedText>
          </View>
        </View>
        {/* Table Body - Make this scrollable */}
        {filteredUsers.length === 0 ? (
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { flex: 1 }]}> 
              <ThemedText style={{ color: text }}>No users found.</ThemedText>
            </View>
          </View>
        ) : (
          <FlatList
            data={filteredUsers}
            keyExtractor={item => item.id}
            style={{ maxHeight: 400 }}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                {/* Name (with facility and role if present) */}
                <View style={[styles.tableCell, { flex: 2, minWidth: 100, maxWidth: 180, flexShrink: 1 }]}> 
                  <ThemedText type="defaultSemiBold" style={{ color: text }} numberOfLines={1} ellipsizeMode="tail">{item.firstName} {item.lastName}</ThemedText>
                  {(item.facility && item.facility.facilityName) || item.facilityName ? (
                    <ThemedText
                      type="subtitle"
                      style={{ fontSize: 12, color: text + '99', minWidth: 0, maxWidth: '100%', flexShrink: 1 }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.facility && item.facility.facilityName ? item.facility.facilityName : item.facilityName}
                    </ThemedText>
                  ) : null}
                  <ThemedText type="default" style={{ fontSize: 12, color: tint }} numberOfLines={1} ellipsizeMode="tail">{item.role}</ThemedText>
                </View>
                {/* Status */}
                <View style={[styles.tableCell, { flex: 1, justifyContent: 'flex-start', minWidth: 70, maxWidth: 100, flexShrink: 1 }]}> 
                  <ThemedText type="default" style={{ fontSize: 12, color: item.isActive ? '#388e3c' : '#d32f2f', fontWeight: 'bold' }} numberOfLines={1} ellipsizeMode="tail">
                    {item.isActive ? 'Active' : 'Inactive'}
                  </ThemedText>
                </View>
                {/* Actions */}
                <View style={[styles.tableCell, styles.actionsCell, { minWidth: 120, maxWidth: 180, flexShrink: 1 }]}> 
                  <Button
                    title="View"
                    onPress={() => { setSelectedUser(item); setModalVisible(true); }}
                    style={{ backgroundColor: tint, minWidth: 50, height: 28, marginLeft: 0, paddingHorizontal: 6 }}
                    textStyle={{ color: background, fontSize: 12 }}
                  />
                  {item.isActive && (
                    <Button
                      title="Deactivate"
                      onPress={async () => {
                        try {
                          setLoading(true);
                          const updatedUser = await userService.deactivateUser(item.id);
                          setUsers(prev => prev.map(u => u.id === item.id ? updatedUser : u));
                        } catch (e) {
                          // Optionally show error feedback
                        } finally {
                          setLoading(false);
                        }
                      }}
                      style={{ backgroundColor: '#d32f2f', minWidth: 70, height: 28, marginLeft: 6, paddingHorizontal: 6 }}
                      textStyle={{ color: '#fff', fontSize: 12 }}
                    />
                  )}
                </View>
              </View>
            )}
          />
        )}
      </View>
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
  // Table styles
  table: { borderRadius: 8, overflow: 'hidden', borderWidth: 1 },
  tableRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, minHeight: 48 },
  tableHeaderRow: {},
  tableCell: { flex: 1, paddingVertical: 8, paddingHorizontal: 10, justifyContent: 'center', flexWrap: 'wrap', minWidth: 60, maxWidth: 200, flexShrink: 1 },
  actionsCell: { flex: 2, flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', gap: 6, minWidth: 120, maxWidth: 180, flexShrink: 1 },
  tableHeaderCell: { justifyContent: 'center', alignItems: 'center' },
  tableHeaderText: { fontWeight: 'bold', fontSize: 15 },
  viewButton: { borderRadius: 8, paddingVertical: 4, paddingHorizontal: 8, minWidth: 50, height: 28 },
  viewButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});
