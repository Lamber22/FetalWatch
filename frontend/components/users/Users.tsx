import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { userService } from '../../services/UserService';
import { ThemedText } from '../ThemedText';
import Modal from '../ui/Modal';
import AddUser from '../shared/AddUser';
import SearchFilterBar from '../ui/Search';

const UsersScreen: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string | null>(null);

  const roles = [
    { label: 'All', value: null },
    { label: 'Doctor', value: 'doctor' },
    { label: 'Nurse', value: 'nurse' },
    { label: 'Midwife', value: 'midwife' },
    { label: 'Health Provider', value: 'healthProvider' },
  ];

  useEffect(() => {
    userService.getAllUsers().then(users => {
      setUsers(users);
      setLoading(false);
    });
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      (user.firstName && user.firstName.toLowerCase().includes(search.toLowerCase())) ||
      (user.lastName && user.lastName.toLowerCase().includes(search.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = filterRole ? user.role === filterRole : true;
    return matchesSearch && matchesRole;
  });

  const openUserModal = (user: any) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const closeUserModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  const openAddModal = () => {
    setAddModalVisible(true);
  };

  const closeAddModal = () => {
    setAddModalVisible(false);
  };

  const handleAddUser = async (userData: any) => {
    try {
      await userService.createUser(userData);
      closeAddModal();
      setLoading(true);
      userService.getAllUsers().then(users => {
        setUsers(users);
        setLoading(false);
      });
    } catch (e) {
      // error handled in service
    }
  };

  if (loading) return <ThemedText>Loading...</ThemedText>;

  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 16 }}>
        <View style={{ alignItems: 'flex-end', marginBottom: 12 }}>
          <TouchableOpacity
            style={styles.addUserButton}
            onPress={openAddModal}
          >
            <Text style={styles.addUserButtonText}>+ Add User</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.header}>Users</Text>
      {/* Search and filter bar */}
      <SearchFilterBar
        search={search}
        setSearch={setSearch}
        filterRole={filterRole}
        setFilterRole={setFilterRole}
        roles={roles}
        userRole="healthProvider"
      />
      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.id || item._id || item.email}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => { openUserModal(item); }}>
            <View style={styles.avatarWrapper}>
              <Image
                source={item.profileImage ? { uri: item.profileImage } : require('../../assets/images/icon.png')}
                style={styles.avatar}
              />
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
              <Text style={styles.specialization}>{item.role}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
          </TouchableOpacity>
        )
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No users found.</Text>}
      />
      <Modal
        visible={addModalVisible}
        onClose={closeAddModal}
        title="Add User"
        size="medium"
        showCloseButton
      >
        <AddUser
          onClose={closeAddModal}
          onUserAdded={() => {
            setAddModalVisible(false);
            setLoading(true);
            userService.getAllUsers().then(users => {
              setUsers(users);
              setLoading(false);
            });
          }}
          currentUserRole="healthProvider"
        />
      </Modal>
      {selectedUser && (
        <Modal
          visible={modalVisible}
          onClose={closeUserModal}
          title="User Details"
          size="medium"
          showCloseButton
        >
          <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
            <View style={styles.modalAvatarWrapper}>
              <Image
                source={selectedUser.profileImage ? { uri: selectedUser.profileImage } : require('../../assets/images/icon.png')}
                style={styles.modalAvatar}
              />
            </View>
            <Text style={styles.modalSpecialization}>{selectedUser.role}</Text>
            <Text style={styles.modalHospital}>{selectedUser.hospital?.name}</Text>
            <Text style={styles.modalBio}>{selectedUser.bio || 'No bio available.'}</Text>
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Contact</Text>
              <Text style={styles.modalSectionText}>Email: {selectedUser.email}</Text>
              <Text style={styles.modalSectionText}>Phone: {selectedUser.phone}</Text>
            </View>
            {selectedUser.createdAt && <Text style={styles.modalSectionText}>Created: {new Date(selectedUser.createdAt).toLocaleString()}</Text>}
            {selectedUser.updatedAt && <Text style={styles.modalSectionText}>Updated: {new Date(selectedUser.updatedAt).toLocaleString()}</Text>}
          </ScrollView>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fb',
    paddingTop: 32,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#2d3a4b',
    letterSpacing: 1,
  },
  searchBarWrapper: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    fontSize: 16,
    color: '#2d3a4b',
    borderWidth: 1,
    borderColor: '#e6eaf0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  filterScroll: {
    maxHeight: 44,
    marginBottom: 8,
  },
  filterChipsContainer: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  chip: {
    backgroundColor: '#f4f6fb',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e6eaf0',
  },
  chipActive: {
    backgroundColor: '#2d3a4b',
    borderColor: '#2d3a4b',
  },
  chipText: {
    color: '#7a869a',
    fontWeight: '600',
    fontSize: 15,
  },
  chipTextActive: {
    color: '#fff',
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e6eaf0',
  },
  avatarWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    marginRight: 18,
    borderWidth: 2,
    borderColor: '#e6eaf0',
    backgroundColor: '#f4f6fb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e0e0e0',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 21,
    fontWeight: '700',
    color: '#2d3a4b',
    marginBottom: 2,
  },
  specialization: {
    fontSize: 16,
    color: '#5a6b7b',
    fontWeight: '600',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  dot: {
    marginHorizontal: 6,
    color: '#b0b8c1',
    fontSize: 14,
  },
  hospital: {
    fontSize: 15,
    color: '#7a869a',
    fontWeight: '500',
  },
  experience: {
    fontSize: 15,
    color: '#7a869a',
    fontWeight: '500',
  },
  email: {
    fontSize: 13,
    color: '#8a99b0',
  },
  phone: {
    fontSize: 13,
    color: '#8a99b0',
  },
  emptyText: {
    textAlign: 'center',
    color: '#b0b8c1',
    fontSize: 16,
    marginTop: 32,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  modalAvatarWrapper: {
    alignSelf: 'center',
    marginBottom: 12,
    borderRadius: 48,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e6eaf0',
    backgroundColor: '#f4f6fb',
    width: 96,
    height: 96,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#e0e0e0',
  },
  modalSpecialization: {
    fontSize: 18,
    color: '#5a6b7b',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  modalHospital: {
    fontSize: 16,
    color: '#7a869a',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalBio: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalSection: {
    marginBottom: 12,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3a4b',
    marginBottom: 2,
  },
  modalSectionText: {
    fontSize: 15,
    color: '#5a6b7b',
    marginBottom: 2,
  },
  closeButton: {
    backgroundColor: '#2d3a4b',
    borderRadius: 16,
    paddingVertical: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
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

export default UsersScreen;