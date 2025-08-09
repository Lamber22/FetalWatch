import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { userService } from '../../services/UserService';
import { ThemedText } from '../ThemedText';
import Modal from '../ui/Modal';
import AddUser from '../shared/AddUser';
import SearchFilterBar from '../ui/Search';
import { SIZES, SHADOWS } from '../constants/Theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useColorScheme } from '@/hooks/useColorScheme';

const UsersScreen: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string | null>(null);

  // Theme colors
  const { colors } = useTheme();
  const colorScheme = useColorScheme();

  const roles = [
    { label: 'All', value: null },
    { label: 'Doctor', value: 'doctor' },
    { label: 'Nurse', value: 'nurse' },
    { label: 'Midwife', value: 'midwife' },
    // { label: 'Health Provider', value: 'healthProvider' },
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={{ flex: 2 }} />
        <View style={styles.titleContainer}>
          <Image source={require('../../assets/logo/fetalwatch.png')} style={styles.logo} />
          <Text style={styles.title} numberOfLines={1}>Users</Text>
        </View>
        <View style={{ flex: 2 }} />
      </View>
      <View style={{ paddingHorizontal: 16 }}>
        <View style={{ alignItems: 'flex-end', marginBottom: 12 }}>
          <TouchableOpacity
            style={[styles.addUserButton, { backgroundColor: colors.primary }]}
            onPress={openAddModal}
          >
            <Text style={styles.addUserButtonText}>+ Add User</Text>
          </TouchableOpacity>
        </View>
      </View>
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
          <TouchableOpacity style={[styles.card, { backgroundColor: colors.white }]} onPress={() => { openUserModal(item); }}>
            <View style={styles.avatarWrapper}>
              <Image
                source={item.profileImage ? { uri: item.profileImage } : require('../../assets/images/icon.png')}
                style={styles.avatar}
              />
            </View>
            <View style={styles.info}>
              <Text style={[styles.name, { color: colors.text }]}>{item.firstName} {item.lastName}</Text>
              <Text style={[styles.specialization, { color: colors.gray }]}>{item.role}</Text>
              <Text style={[styles.email, { color: colors.gray }]}>{item.email}</Text>
              <Text style={[styles.clickToView, { color: colors.primary }]}>Tap to view details</Text>
            </View>
          </TouchableOpacity>
        )
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={[styles.emptyText, { color: colors.gray }]}>No users found.</Text>}
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
            <Text style={[styles.modalSpecialization, { color: colors.gray }]}>{selectedUser.role}</Text>
            <Text style={[styles.modalHospital, { color: colors.gray }]}>{selectedUser.hospital?.name}</Text>
            <Text style={[styles.modalBio, { color: colors.text }]}>{selectedUser.bio || 'No bio available.'}</Text>
            <View style={styles.modalSection}>
              <Text style={[styles.modalSectionTitle, { color: colors.text }]}>Contact</Text>
              <Text style={[styles.modalSectionText, { color: colors.gray }]}>Email: {selectedUser.email}</Text>
              <Text style={[styles.modalSectionText, { color: colors.gray }]}>Phone: {selectedUser.phone}</Text>
            </View>
            {selectedUser.createdAt && <Text style={[styles.modalSectionText, { color: colors.gray }]}>Created: {new Date(selectedUser.createdAt).toLocaleString()}</Text>}
            {selectedUser.updatedAt && <Text style={[styles.modalSectionText, { color: colors.gray }]}>Updated: {new Date(selectedUser.updatedAt).toLocaleString()}</Text>}
          </ScrollView>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 0,
  },
  searchBarWrapper: {
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.base,
  },
  searchBar: {
    borderRadius: SIZES.radius * 2,
    paddingHorizontal: SIZES.padding + 2,
    paddingVertical: SIZES.base + 2,
    fontSize: SIZES.medium,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  filterScroll: {
    maxHeight: 44,
    marginBottom: SIZES.base,
  },
  filterChipsContainer: {
    alignItems: 'center',
    paddingHorizontal: SIZES.base + 4,
  },
  chip: {
    borderRadius: SIZES.radius * 2,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    marginRight: SIZES.base,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: '#2d3a4b',
    borderColor: '#2d3a4b',
  },
  chipText: {
    fontWeight: '600',
    fontSize: SIZES.small + 3,
  },
  chipTextActive: {
    color: '#fff',
  },
  list: {
    paddingHorizontal: SIZES.base + 4,
    paddingBottom: SIZES.padding + 8,
  },
  card: {
    flexDirection: 'row',
    borderRadius: SIZES.radius * 2 + 2,
    padding: SIZES.padding + 2,
    marginBottom: SIZES.padding + 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e6eaf0',
    ...SHADOWS.light,
  },
  avatarWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    marginRight: SIZES.padding + 2,
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
    fontSize: SIZES.large + 1,
    fontWeight: '700',
    marginBottom: 2,
  },
  specialization: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    marginBottom: SIZES.base - 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  dot: {
    marginHorizontal: SIZES.base - 2,
    fontSize: SIZES.font,
  },
  hospital: {
    fontSize: SIZES.small + 3,
    fontWeight: '500',
  },
  experience: {
    fontSize: SIZES.small + 3,
    fontWeight: '500',
  },
  email: {
    fontSize: SIZES.small + 1,
  },
  clickToView: {
    fontSize: SIZES.extraSmall + 1,
    fontStyle: 'italic',
    marginTop: SIZES.base / 2,
  },
  phone: {
    fontSize: SIZES.small + 1,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: SIZES.medium,
    marginTop: SIZES.padding * 2,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: SIZES.medium,
  },
  modalAvatarWrapper: {
    alignSelf: 'center',
    marginBottom: SIZES.base + 4,
    borderRadius: SIZES.padding * 3,
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
    fontSize: SIZES.medium + 2,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  modalHospital: {
    fontSize: SIZES.medium,
    textAlign: 'center',
    marginBottom: SIZES.base,
  },
  modalBio: {
    fontSize: SIZES.small + 3,
    textAlign: 'center',
    marginBottom: SIZES.base + 4,
  },
  modalSection: {
    marginBottom: SIZES.base + 4,
  },
  modalSectionTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  modalSectionText: {
    fontSize: SIZES.small + 3,
    marginBottom: 2,
  },
  closeButton: {
    borderRadius: SIZES.radius * 2,
    paddingVertical: SIZES.base + 4,
    marginTop: SIZES.padding,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  input: {
    borderRadius: SIZES.base + 4,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base + 2,
    fontSize: SIZES.medium,
    borderWidth: 1,
    marginBottom: SIZES.base + 2,
  },
  addButton: {
    borderRadius: SIZES.radius * 2,
    paddingVertical: SIZES.font,
    alignItems: 'center',
    marginTop: SIZES.base,
  },
  addButtonText: {
    color: '#fff',
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  addUserButton: {
    borderRadius: SIZES.base,
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.large,
    marginBottom: 4,
    ...SHADOWS.light,
  },
  addUserButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: SIZES.medium,
  },
});

export default UsersScreen;