import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { useDoctorContext } from '../contexts/DoctorContext';
import Modal from './ui/Modal';
import DoctorForm from './DoctorForm';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  licenseNumber: '',
  specialization: '',
  yearsOfExperience: '',
  hospitalName: '',
  hospitalAddress: '',
  bio: '',
};

const DoctorScreen: React.FC = () => {
  const { state, actions } = useDoctorContext();
  const [filteredDoctors, setFilteredDoctors] = useState(state.doctors);
  const [search, setSearch] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [formLoading, setFormLoading] = useState(false);

  // Debug logs
  useEffect(() => {
    console.log('DoctorScreen state:', state);
    console.log('DoctorScreen filteredDoctors:', filteredDoctors);
  }, [state, filteredDoctors]);

  // Only fetch doctors on mount
  useEffect(() => {
    actions.getAllDoctors();
    // eslint-disable-next-line
  }, []);

  // Filter doctors when state.doctors, search, or selectedSpecialization changes
  useEffect(() => {
    let filtered = state.doctors.filter(doc => doc && typeof doc.specialization === 'string');
    if (search) {
      filtered = filtered.filter(doc =>
        `${doc.firstName} ${doc.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(search.toLowerCase()) ||
        doc.hospital?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedSpecialization) {
      filtered = filtered.filter(doc => doc.specialization === selectedSpecialization);
    }
    setFilteredDoctors(filtered);
  }, [search, selectedSpecialization, state.doctors]);

  const specializations = Array.from(
    new Set(
      state.doctors
        .filter(doc => doc && typeof doc.specialization === 'string')
        .map(doc => doc.specialization)
    )
  );

  const openDoctorModal = (doctor: any) => {
    setSelectedDoctor(doctor);
    setModalVisible(true);
  };

  const closeDoctorModal = () => {
    setModalVisible(false);
    setSelectedDoctor(null);
  };

  const openAddModal = () => {
    setForm(initialForm);
    setAddModalVisible(true);
  };

  const closeAddModal = () => {
    setAddModalVisible(false);
  };

  const handleFormChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleAddDoctor = async () => {
    setFormLoading(true);
    try {
      await actions.createDoctor({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        licenseNumber: form.licenseNumber,
        specialization: form.specialization,
        yearsOfExperience: Number(form.yearsOfExperience),
        qualifications: [],
        hospital: {
          name: form.hospitalName,
          address: form.hospitalAddress,
        },
        availableHours: {
          monday: { start: '', end: '', available: false },
          tuesday: { start: '', end: '', available: false },
          wednesday: { start: '', end: '', available: false },
          thursday: { start: '', end: '', available: false },
          friday: { start: '', end: '', available: false },
          saturday: { start: '', end: '', available: false },
          sunday: { start: '', end: '', available: false },
        },
        bio: form.bio,
      });
      closeAddModal();
      actions.getAllDoctors();
    } catch (e) {
      // error handled in context
    } finally {
      setFormLoading(false);
    }
  };

  const renderDoctor = ({ item }: { item: any }) => (
    <TouchableOpacity activeOpacity={0.85} style={styles.card} onPress={() => openDoctorModal(item)}>
      <View style={styles.avatarWrapper}>
        <Image
          source={item.profileImage ? { uri: item.profileImage } : require('../assets/images/icon.png')}
          style={styles.avatar}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
        <Text style={styles.specialization}>{item.specialization}</Text>
        <View style={styles.row}>
          <Text style={styles.hospital}>{item.hospital?.name}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.experience}>{item.yearsOfExperience} yrs</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.email}>{item.email}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.phone}>{item.phone}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Minimal fallback if no doctors and not loading
  if (!state.loading && !state.error && (!filteredDoctors || filteredDoctors.length === 0)) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Doctors</Text>
        <Text style={styles.emptyText}>No doctors found. Add a doctor using the + button.</Text>
        <TouchableOpacity style={styles.fab} onPress={openAddModal}>
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
        <Modal
          visible={addModalVisible}
          onClose={closeAddModal}
          title="Add Doctor"
          size="medium"
          showCloseButton
        >
          <DoctorForm
            form={form}
            onChange={handleFormChange}
            onSubmit={handleAddDoctor}
            onCancel={closeAddModal}
            loading={formLoading}
          />
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Doctors</Text>
      <View style={styles.searchBarWrapper}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search doctors, specialization, hospital..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#b0b8c1"
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterChipsContainer}>
        <TouchableOpacity
          style={[styles.chip, !selectedSpecialization && styles.chipActive]}
          onPress={() => setSelectedSpecialization('')}
        >
          <Text style={[styles.chipText, !selectedSpecialization && styles.chipTextActive]}>All</Text>
        </TouchableOpacity>
        {specializations.map(spec => (
          <TouchableOpacity
            key={spec}
            style={[styles.chip, selectedSpecialization === spec && styles.chipActive]}
            onPress={() => setSelectedSpecialization(spec)}
          >
            <Text style={[styles.chipText, selectedSpecialization === spec && styles.chipTextActive]}>{spec}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {state.loading ? (
        <ActivityIndicator size="large" style={styles.centered} />
      ) : state.error ? (
        <View style={styles.centered}><Text style={styles.error}>{state.error}</Text></View>
      ) : (
        <FlatList
          data={filteredDoctors}
          keyExtractor={item => item._id || item.email}
          renderItem={renderDoctor}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No doctors found.</Text>}
        />
      )}
      {/* Doctor Details Modal */}
      <Modal
        visible={modalVisible}
        onClose={closeDoctorModal}
        title={selectedDoctor ? `${selectedDoctor.firstName} ${selectedDoctor.lastName}` : ''}
        size="medium"
        showCloseButton
      >
        {selectedDoctor && (
          <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
            <View style={styles.modalAvatarWrapper}>
              <Image
                source={selectedDoctor.profileImage ? { uri: selectedDoctor.profileImage } : require('../assets/images/icon.png')}
                style={styles.modalAvatar}
              />
            </View>
            <Text style={styles.modalSpecialization}>{selectedDoctor.specialization}</Text>
            <Text style={styles.modalHospital}>{selectedDoctor.hospital?.name}</Text>
            <Text style={styles.modalBio}>{selectedDoctor.bio || 'No bio available.'}</Text>
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Qualifications</Text>
              {selectedDoctor.qualifications && selectedDoctor.qualifications.length > 0 ? (
                selectedDoctor.qualifications.map((q: any, idx: number) => (
                  <Text key={idx} style={styles.modalSectionText}>{q.degree} - {q.institution} ({q.year})</Text>
                ))
              ) : (
                <Text style={styles.modalSectionText}>No qualifications listed.</Text>
              )}
            </View>
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Languages</Text>
              <Text style={styles.modalSectionText}>{selectedDoctor.languages?.join(', ') || 'Not specified'}</Text>
            </View>
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Contact</Text>
              <Text style={styles.modalSectionText}>Email: {selectedDoctor.email}</Text>
              <Text style={styles.modalSectionText}>Phone: {selectedDoctor.phone}</Text>
            </View>
          </ScrollView>
        )}
      </Modal>
      {/* Add Doctor Modal */}
      <Modal
        visible={addModalVisible}
        onClose={closeAddModal}
        title="Add Doctor"
        size="medium"
        showCloseButton
      >
        <DoctorForm
          form={form}
          onChange={handleFormChange}
          onSubmit={handleAddDoctor}
          onCancel={closeAddModal}
          loading={formLoading}
        />
      </Modal>
      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={openAddModal}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
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
  fab: {
    position: 'absolute',
    right: 24,
    bottom: Platform.OS === 'ios' ? 44 : 24,
    backgroundColor: '#2d3a4b',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  fabIcon: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: -2,
  },
});

export default DoctorScreen; 