import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  FaCog, 
  FaLanguage, 
  FaPalette, 
  FaBell, 
  FaShieldAlt,
  FaDatabase,
  FaChartLine 
} from 'react-icons/fa';

export default function SettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    language: 'English',
    theme: 'Light',
    notifications: {
      highRiskAlerts: true,
      weeklyReports: true,
      systemUpdates: false,
    },
    dataSharing: false,
    analyticsTracking: true,
  });

  const toggleSetting = (category: keyof typeof settings, setting?: keyof typeof settings['notifications']) => {
    setSettings(prev => {
      if (category === 'notifications' && setting) {
        return {
          ...prev,
          notifications: {
            ...prev.notifications,
            [setting]: !prev.notifications[setting as keyof typeof prev.notifications]
          }
        };
      } else if (typeof prev[category] === 'boolean') {
        return {
          ...prev,
          [category]: !prev[category]
        };
      }
      return prev;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.headerContainer}>
          <FaCog size={50} color="#3498db" />
          <Text style={styles.headerTitle}>App Settings</Text>
        </View>

        {/* Language & Appearance */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          {/* Language */}
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => {/* Language selection modal */}}
          >
            <View style={styles.settingIconAndLabel}>
              <FaLanguage size={24} color="#9b59b6" />
              <Text style={styles.settingLabel}>Language</Text>
            </View>
            <Text style={styles.settingValue}>{settings.language}</Text>
          </TouchableOpacity>

          {/* Theme */}
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => {/* Theme selection modal */}}
          >
            <View style={styles.settingIconAndLabel}>
              <FaPalette size={24} color="#e74c3c" />
              <Text style={styles.settingLabel}>Theme</Text>
            </View>
            <Text style={styles.settingValue}>{settings.theme}</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          {/* High Risk Alerts */}
          <View style={styles.settingItem}>
            <View style={styles.settingIconAndLabel}>
              <FaBell size={24} color="#f39c12" />
              <Text style={styles.settingLabel}>High Risk Alerts</Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={settings.notifications.highRiskAlerts ? "#f5dd4b" : "#f4f3f4"}
              onValueChange={() => toggleSetting('notifications', 'highRiskAlerts')}
              value={settings.notifications.highRiskAlerts}
            />
          </View>

          {/* Weekly Reports */}
          <View style={styles.settingItem}>
            <View style={styles.settingIconAndLabel}>
              <FaChartLine size={24} color="#2ecc71" />
              <Text style={styles.settingLabel}>Weekly Reports</Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={settings.notifications.weeklyReports ? "#f5dd4b" : "#f4f3f4"}
              onValueChange={() => toggleSetting('notifications', 'weeklyReports')}
              value={settings.notifications.weeklyReports}
            />
          </View>

          {/* System Updates */}
          <View style={styles.settingItem}>
            <View style={styles.settingIconAndLabel}>
              <FaShieldAlt size={24} color="#3498db" />
              <Text style={styles.settingLabel}>System Updates</Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={settings.notifications.systemUpdates ? "#f5dd4b" : "#f4f3f4"}
              onValueChange={() => toggleSetting('notifications', 'systemUpdates')}
              value={settings.notifications.systemUpdates}
            />
          </View>
        </View>

        {/* Data & Privacy */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Data & Privacy</Text>
          
          {/* Data Sharing */}
          <View style={styles.settingItem}>
            <View style={styles.settingIconAndLabel}>
              <FaDatabase size={24} color="#9b59b6" />
              <Text style={styles.settingLabel}>Data Sharing</Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={settings.dataSharing ? "#f5dd4b" : "#f4f3f4"}
              onValueChange={() => toggleSetting('dataSharing')}
              value={settings.dataSharing}
            />
          </View>

          {/* Analytics Tracking */}
          <View style={styles.settingItem}>
            <View style={styles.settingIconAndLabel}>
              <FaChartLine size={24} color="#e74c3c" />
              <Text style={styles.settingLabel}>Analytics Tracking</Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={settings.analyticsTracking ? "#f5dd4b" : "#f4f3f4"}
              onValueChange={() => toggleSetting('analyticsTracking')}
              value={settings.analyticsTracking}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {/* Reset to default settings */}}
          >
            <Text style={styles.actionButtonText}>Reset to Default</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.saveButton]}
            onPress={() => {/* Save settings */}}
          >
            <Text style={styles.actionButtonText}>Save Changes</Text>
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
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
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
  settingValue: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    paddingHorizontal: 15,
  },
  actionButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#2ecc71',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
