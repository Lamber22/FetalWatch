import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Switch 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  FaUserCircle, 
  FaUserMd, 
  FaHospital, 
  FaCertificate, 
  FaLock,
  FaBell,
  FaSignOutAlt 
} from 'react-icons/fa';

export default function ProfileScreen() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState({
    name: 'Dr. Elena Rodriguez',
    role: 'Maternal Health Specialist',
    facility: 'Central City Maternity Clinic',
    email: 'elena.rodriguez@fetalwatch.com',
    notificationsEnabled: true,
    twoFactorAuth: true,
  });

  const handleLogout = () => {
    // Implement logout logic
    router.replace('/login');
  };

  const toggleNotifications = () => {
    setUserProfile(prev => ({
      ...prev,
      notificationsEnabled: !prev.notificationsEnabled
    }));
  };

  const toggleTwoFactorAuth = () => {
    setUserProfile(prev => ({
      ...prev,
      twoFactorAuth: !prev.twoFactorAuth
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.headerContainer}>
          <FaUserCircle size={80} color="#3498db" />
          <Text style={styles.profileName}>{userProfile.name}</Text>
          <Text style={styles.profileRole}>{userProfile.role}</Text>
        </View>

        {/* Professional Information */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Professional Details</Text>
          <View style={styles.profileInfoItem}>
            <FaHospital size={24} color="#2ecc71" />
            <Text style={styles.profileInfoLabel}>Facility</Text>
            <Text style={styles.profileInfoValue}>
              {userProfile.facility}
            </Text>
          </View>
          <View style={styles.profileInfoItem}>
            <FaCertificate size={24} color="#e74c3c" />
            <Text style={styles.profileInfoLabel}>Email</Text>
            <Text style={styles.profileInfoValue}>
              {userProfile.email}
            </Text>
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          {/* Notifications */}
          <View style={styles.settingItem}>
            <View style={styles.settingIconAndLabel}>
              <FaBell size={24} color="#f39c12" />
              <Text style={styles.settingLabel}>
                Enable Notifications
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={userProfile.notificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
              onValueChange={toggleNotifications}
              value={userProfile.notificationsEnabled}
            />
          </View>

          {/* Two-Factor Authentication */}
          <View style={styles.settingItem}>
            <View style={styles.settingIconAndLabel}>
              <FaLock size={24} color="#9b59b6" />
              <Text style={styles.settingLabel}>
                Two-Factor Authentication
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={userProfile.twoFactorAuth ? "#f5dd4b" : "#f4f3f4"}
              onValueChange={toggleTwoFactorAuth}
              value={userProfile.twoFactorAuth}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/screens/ProfileScreen')}
          >
            <Text style={styles.actionButtonText}>Change Password</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <FaSignOutAlt size={20} color="white" style={styles.logoutIcon} />
            <Text style={styles.actionButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  headerContainer: {
    backgroundColor: '#3498db',
    paddingVertical: 30,
    alignItems: 'center',
  },
  profileName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  profileRole: {
    color: 'white',
    fontSize: 16,
  },
  sectionContainer: {
    backgroundColor: 'white',
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  profileInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
  },
  profileInfoLabel: {
    marginLeft: 10,
    color: '#7f8c8d',
    flex: 1,
  },
  profileInfoValue: {
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
  },
  settingIconAndLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    marginLeft: 10,
    color: '#2c3e50',
    fontSize: 16,
  },
  actionContainer: {
    marginVertical: 20,
    paddingHorizontal: 15,
  },
  actionButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  logoutIcon: {
    marginRight: 10,
  },
});
