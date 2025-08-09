import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../constants/Theme';
import { useTheme } from '../../contexts/ThemeContext';
import { usePatient, PatientUtils } from '../../hooks/usePatient';
import { useReports } from '../../contexts/ReportsContext';
import { usePatientReports, PatientReportUtils } from '../../hooks/usePatientReports';
import Modal from '../ui/Modal';
import AddPatient from '../forms/AddPatient';
import AddRecord from '../forms/AddRecord';
import Button from '../ui/Button';
import { SearchBar } from '../../utils/Search';

export default function PatientsListTab() {
  const { colors } = useTheme();
  const { allPatients, loadingAllPatients, loadAllPatients } = usePatient();
  const { patientReports, loadingReports, loadPatientReports, isLoading, hasData } = usePatientReports();
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [selectedPatientForRecord, setSelectedPatientForRecord] = useState<string | null>(null);
  const [expandedPatient, setExpandedPatient] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [searchFilter, setSearchFilter] = useState<'all' | 'high-risk' | 'recent'>('all');

  useEffect(() => {
    loadAllPatients();
  }, [loadAllPatients]);

  useEffect(() => {
    // Filter patients based on search query and filter
    let filtered = allPatients || [];
    
    // Apply search filter first
    if (searchFilter === 'high-risk') {
      filtered = filtered.filter((patient: any) => {
        const riskFactors = PatientUtils.getRiskFactors(patient);
        return riskFactors.length > 0;
      });
    } else if (searchFilter === 'recent') {
      // Filter patients created in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filtered = filtered.filter((patient: any) => 
        new Date(patient.createdAt || patient.dateOfBirth) >= thirtyDaysAgo
      );
    }
    
    // Apply text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((patient: any) => {
        const name = patient.name?.toLowerCase() || '';
        const contact = patient.contact?.toLowerCase() || '';
        const id = patient._id?.toLowerCase() || '';
        const shortId = patient._id?.slice(-6).toLowerCase() || '';
        
        return name.includes(query) || 
               contact.includes(query) || 
               id.includes(query) ||
               shortId.includes(query);
      });
    }
    
    setFilteredPatients(filtered);
    
    // Generate search suggestions
    if (filtered.length > 0 && searchQuery.length > 1) {
      const suggestions = filtered
        .slice(0, 3)
        .map((patient: any) => patient.name)
        .filter((name: string) => name.toLowerCase() !== searchQuery.toLowerCase());
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery, allPatients, searchFilter]);

  const togglePatientDetails = async (patientId: string) => {
    if (expandedPatient === patientId) {
      setExpandedPatient(null);
    } else {
      setExpandedPatient(patientId);
      await loadPatientReports(patientId);
    }
  };

  const handleAddRecord = (patientId: string) => {
    setSelectedPatientForRecord(patientId);
    setShowAddRecordModal(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={[styles.header, { backgroundColor: colors.primary }]}> 
        <Text style={styles.headerTitle}>Patients</Text>
        <Button
          title="Add Patient"
          onPress={() => setShowAddPatientModal(true)}
          style={{ marginLeft: 8 }}
        />
      </View>
      
      {/* Search Bar */}
      <SearchBar
        placeholder="Search patients by name, contact, or ID..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        suggestions={searchSuggestions}
        onSuggestionPress={(suggestion) => setSearchQuery(suggestion)}
        filters={[
          { key: 'all', label: 'All Patients', icon: 'people' },
          { key: 'high-risk', label: 'High Risk', icon: 'warning' },
          { key: 'recent', label: 'Recent', icon: 'time' }
        ]}
        activeFilter={searchFilter}
        onFilterChange={(filter) => setSearchFilter(filter as 'all' | 'high-risk' | 'recent')}
        hintText="💡 Try searching by: patient name, phone number, or ID"
        debounceMs={300}
      />
      
      <ScrollView style={styles.content}>
        {loadingAllPatients && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
        {!loadingAllPatients && filteredPatients.map((patient) => {
          if (!patient._id) return null; // Skip patients without ID
          
          const age = PatientReportUtils.calculateAge(patient.dateOfBirth);
          const risk = PatientReportUtils.getRiskLevel(patient.weekOfPregnancy);
          const isExpanded = expandedPatient === patient._id;
          const reportData = patientReports[patient._id];
          const isLoadingReports = isLoading(patient._id);
          
          return (
            <View key={patient._id} style={[styles.patientRow, { backgroundColor: colors.white }]}>
              <TouchableOpacity
                style={styles.patientHeader}
                onPress={() => togglePatientDetails(patient._id!)}
              >
                <View style={styles.patientInfo}>
                  <Text style={[styles.patientName, { color: colors.text }]}>{patient.name}</Text>
                  <Text style={[styles.patientDetails, { color: colors.gray }]}>
                  Age: {age} • Contact: {patient.contact || 'N/A'}
                  </Text>
                  <Text style={[styles.patientMedical, { color: colors.gray }]}>
                    Week of Pregnancy: {patient.weekOfPregnancy || 'N/A'} • Gender: {patient.gender || 'N/A'}
                  </Text>
                </View>
                <View style={styles.patientStatus}>
                  <View
                    style={[
                      styles.riskBadge,
                      {
                        backgroundColor:
                          risk === 'High' ? colors.error : colors.success,
                      },
                    ]}
                  >
                    <Text style={styles.riskText}>{risk} Risk</Text>
                  </View>
                  <View style={styles.expandButton}>
                    <Text style={[styles.clickHintText, { color: colors.gray }]}>
                      {isExpanded ? 'Tap to collapse' : 'Tap to view details'}
                    </Text>
                    <Ionicons 
                      name={isExpanded ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color={colors.primary} 
                    />
                  </View>
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <View style={[styles.patientDetailsContainer, { backgroundColor: colors.lightGray }]}>
                  {isLoadingReports ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color={colors.primary} />
                      <Text style={[styles.patientLoadingText, { color: colors.gray }]}>Loading patient reports...</Text>
                    </View>
                  ) : reportData ? (
                    <View style={styles.reportTabs}>
                      {/* Patient Details Section */}
                      <View style={[styles.reportSection, { backgroundColor: colors.white }]}>
                        <View style={styles.sectionHeader}>
                          <Text style={[styles.sectionTitle, { color: colors.text }]}>Patient Details</Text>
                          <Button
                            title="Add Record"
                            onPress={() => handleAddRecord(patient._id!)}
                            style={styles.addRecordButton}
                          />
                        </View>
                        <View style={styles.detailsGrid}>
                          <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: colors.gray }]}>Full Name:</Text>
                            <Text style={[styles.detailValue, { color: colors.text }]}>{patient.name}</Text>
                          </View>
                          <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: colors.gray }]}>Age:</Text>
                            <Text style={[styles.detailValue, { color: colors.text }]}>{age} years</Text>
                          </View>
                          <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: colors.gray }]}>Date of Birth:</Text>
                            <Text style={[styles.detailValue, { color: colors.text }]}>
                              {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'}
                            </Text>
                          </View>
                          <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: colors.gray }]}>Gender:</Text>
                            <Text style={[styles.detailValue, { color: colors.text }]}>{patient.gender || 'N/A'}</Text>
                          </View>
                          <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: colors.gray }]}>Contact:</Text>
                            <Text style={[styles.detailValue, { color: colors.text }]}>{patient.contact || 'N/A'}</Text>
                          </View>
                          <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: colors.gray }]}>Address:</Text>
                            <Text style={[styles.detailValue, { color: colors.text }]}>{patient.address || 'N/A'}</Text>
                          </View>
                          <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: colors.gray }]}>Emergency Contact:</Text>
                            <Text style={[styles.detailValue, { color: colors.text }]}>
                              {patient.emergencyContact?.name ? (
                                `${patient.emergencyContact.name}${patient.emergencyContact.contactNumber ? ` - ${patient.emergencyContact.contactNumber}` : ''}${patient.emergencyContact.location ? ` (${patient.emergencyContact.location})` : ''}`
                              ) : 'N/A'}
                            </Text>
                          </View>
                          <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: colors.gray }]}>Week of Pregnancy:</Text>
                            <Text style={[styles.detailValue, { color: colors.text }]}>{patient.weekOfPregnancy || 'N/A'} weeks</Text>
                          </View>
                          <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: colors.gray }]}>Expected Delivery Date:</Text>
                            <Text style={[styles.detailValue, { color: colors.text }]}>
                              {patient.expectedDueDate ? new Date(patient.expectedDueDate).toLocaleDateString() : 'N/A'}
                            </Text>
                          </View>
                          <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: colors.gray }]}>Registration Date:</Text>
                            <Text style={[styles.detailValue, { color: colors.text }]}>
                              {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : 'N/A'}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Risk Assessment Tab */}
                      <View style={[styles.reportSection, { backgroundColor: colors.white }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Risk Assessment</Text>
                        {reportData.riskAssessment ? (
                          <View>
                            <View style={styles.riskSummary}>
                              <View style={[
                                styles.riskBadgeDetail, 
                                { backgroundColor: PatientReportUtils.getRiskLevelColor(reportData.riskAssessment.riskLevel, colors) }
                              ]}>
                                <Text style={styles.riskBadgeText}>
                                  {reportData.riskAssessment.riskLevel?.toUpperCase() || 'N/A'}
                                </Text>
                              </View>
                              <Text style={[styles.riskScore, { color: colors.text }]}>
                                Score: {reportData.riskAssessment.riskScore || 'N/A'}
                              </Text>
                            </View>
                            
                            {reportData.riskAssessment.riskFactors?.length > 0 && (
                              <View style={styles.riskFactors}>
                                <Text style={[styles.subSectionTitle, { color: colors.text }]}>Risk Factors:</Text>
                                {reportData.riskAssessment.riskFactors.slice(0, 3).map((factor: string, index: number) => (
                                  <Text key={index} style={[styles.riskFactorText, { color: colors.gray }]}>
                                    • {factor}
                                  </Text>
                                ))}
                                {reportData.riskAssessment.riskFactors.length > 3 && (
                                  <Text style={[styles.moreText, { color: colors.primary }]}>
                                    +{reportData.riskAssessment.riskFactors.length - 3} more
                                  </Text>
                                )}
                              </View>
                            )}
                            
                            {reportData.riskAssessment.recommendations?.length > 0 && (
                              <View style={styles.recommendationsSection}>
                                <Text style={[styles.subSectionTitle, { color: colors.text }]}>Recommendations:</Text>
                                {reportData.riskAssessment.recommendations.slice(0, 3).map((recommendation: any, index: number) => (
                                  <View key={index} style={styles.recommendationItem}>
                                    <View style={styles.recommendationHeader}>
                                      <Text style={[styles.recommendationTitle, { color: colors.text }]}>
                                        {recommendation.description}
                                      </Text>
                                      <View style={[
                                        styles.priorityBadge, 
                                        { backgroundColor: PatientReportUtils.getPriorityColor(recommendation.priority, colors) }
                                      ]}>
                                        <Text style={styles.priorityText}>
                                          {recommendation.priority?.toUpperCase() || 'N/A'}
                                        </Text>
                                      </View>
                                    </View>
                                    <Text style={[styles.recommendationDetails, { color: colors.gray }]}>
                                      {recommendation.details}
                                    </Text>
                                    <Text style={[styles.recommendationType, { color: colors.primary }]}>
                                      Type: {recommendation.type}
                                    </Text>
                                  </View>
                                ))}
                                {reportData.riskAssessment.recommendations.length > 3 && (
                                  <Text style={[styles.moreText, { color: colors.primary }]}>
                                    +{reportData.riskAssessment.recommendations.length - 3} more recommendations
                                  </Text>
                                )}
                              </View>
                            )}
                          </View>
                        ) : (
                          <Text style={[styles.noDataText, { color: colors.gray }]}>No risk assessment data</Text>
                        )}
                      </View>

                      {/* Recent Vitals Tab */}
                      <View style={[styles.reportSection, { backgroundColor: colors.white }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Vital Signs</Text>
                        {reportData.vitalTrends && reportData.vitalTrends.length > 0 ? (
                          reportData.vitalTrends.slice(0, 3).map((vital: any, index: number) => (
                            <View key={index} style={styles.vitalItem}>
                              <Text style={[styles.vitalDate, { color: colors.text }]}>
                                {new Date(vital.date).toLocaleDateString()}
                              </Text>
                              <Text style={[styles.vitalData, { color: colors.gray }]}>
                                Weight: {vital.weight || 'N/A'} kg • BP: {PatientReportUtils.formatBloodPressure(vital.bloodPressure)} • Pulse: {vital.pulse || 'N/A'} bpm • Temp: {vital.temperature || 'N/A'}°C
                              </Text>
                            </View>
                          ))
                        ) : (
                          <Text style={[styles.noDataText, { color: colors.gray }]}>No vital signs recorded</Text>
                        )}
                      </View>

                      {/* Complications Tab */}
                      <View style={[styles.reportSection, { backgroundColor: colors.white }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Complications</Text>
                        {reportData.complications && reportData.complications.length > 0 ? (
                          reportData.complications.slice(0, 2).map((complication: any, index: number) => (
                            <View key={index} style={styles.complicationItem}>
                              <View style={styles.complicationHeader}>
                                <Text style={[styles.complicationName, { color: colors.text }]}>
                                  {complication.name}
                                </Text>
                                <View style={[
                                  styles.probabilityBadge, 
                                  { backgroundColor: PatientReportUtils.getProbabilityColor(complication.probability, colors) }
                                ]}>
                                  <Text style={styles.probabilityText}>
                                    {complication.probability?.toUpperCase() || 'N/A'}
                                  </Text>
                                </View>
                              </View>
                              <Text style={[styles.complicationDescription, { color: colors.gray }]}>
                                {complication.description}
                              </Text>
                            </View>
                          ))
                        ) : (
                          <Text style={[styles.noDataText, { color: colors.gray }]}>No complications identified</Text>
                        )}
                        {reportData.complications && reportData.complications.length > 2 && (
                          <Text style={[styles.moreText, { color: colors.primary }]}>
                            +{reportData.complications.length - 2} more complications
                          </Text>
                        )}
                      </View>
                    </View>
                  ) : (
                    <Text style={[styles.noDataText, { color: colors.gray }]}>Unable to load patient reports</Text>
                  )}
                </View>
              )}
            </View>
          );
        })}
        {!loadingAllPatients && filteredPatients.length === 0 && (
          <View style={styles.centerContainer}>
            <Text style={[styles.emptyText, { color: colors.gray }]}>No patients found. Add a new patient to get started.</Text>
          </View>
        )}
      </ScrollView>
      <Modal
        visible={showAddPatientModal}
        onClose={() => setShowAddPatientModal(false)}
        title="Add New Patient"
        size="large"
        animationType="slide"
      >
        <AddPatient
          onSuccess={() => {
            setShowAddPatientModal(false);
            loadAllPatients();
          }}
          onCancel={() => setShowAddPatientModal(false)}
        />
      </Modal>

      <Modal
        visible={showAddRecordModal}
        onClose={() => {
          setShowAddRecordModal(false);
          setSelectedPatientForRecord(null);
        }}
        title="Add Medical Record"
        size="large"
        animationType="slide"
      >
        {selectedPatientForRecord && (
          <AddRecord
            patientId={selectedPatientForRecord}
            onSuccess={() => {
              setShowAddRecordModal(false);
              setSelectedPatientForRecord(null);
              // Optionally refresh patient reports
              if (expandedPatient === selectedPatientForRecord) {
                loadPatientReports(selectedPatientForRecord);
              }
            }}
            onCancel={() => {
              setShowAddRecordModal(false);
              setSelectedPatientForRecord(null);
            }}
          />
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    paddingTop: SIZES.padding * 2,
  },
  headerTitle: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  addButton: {
    borderRadius: 0, // Remove roundness
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  content: { flex: 1, padding: SIZES.padding },
  patientRow: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    marginBottom: SIZES.base,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    ...SHADOWS.light,
  },
  patientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  patientCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
    ...SHADOWS.light,
  },
  patientInfo: { flex: 1 },
  patientName: { fontSize: SIZES.medium, fontWeight: '500' },
  patientDetails: { fontSize: SIZES.small, marginTop: SIZES.base / 2 },
  patientMedical: { fontSize: SIZES.small, marginTop: SIZES.base / 2 },
  patientStatus: { alignItems: 'flex-end' },
  riskBadge: { paddingHorizontal: SIZES.base, paddingVertical: SIZES.base / 2, borderRadius: SIZES.radius },
  riskText: { color: COLORS.white, fontSize: SIZES.small, fontWeight: '500' },
  lastVisit: { fontSize: SIZES.small, marginTop: SIZES.base / 2 },
  expandButton: { padding: SIZES.base / 2, marginTop: SIZES.base / 2, alignItems: 'center' },
  clickHintText: {
    fontSize: SIZES.extraSmall,
    fontStyle: 'italic',
    marginBottom: SIZES.base / 4,
    textAlign: 'center',
  },
  patientDetailsContainer: { padding: SIZES.padding },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding,
  },
  patientLoadingText: {
    marginLeft: SIZES.base,
    fontSize: SIZES.small,
  },
  reportTabs: { gap: SIZES.padding },
  reportSection: {
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    ...SHADOWS.light,
  },
  sectionTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    marginBottom: SIZES.base,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  addRecordButton: {
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    minWidth: 80,
  },
  subSectionTitle: {
    fontSize: SIZES.font,
    fontWeight: '600',
    marginBottom: SIZES.base / 2,
  },
  riskSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.base,
  },
  riskBadgeDetail: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
  },
  riskBadgeText: {
    color: COLORS.white,
    fontSize: SIZES.small,
    fontWeight: 'bold',
  },
  riskScore: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  riskFactors: { marginTop: SIZES.base },
  riskFactorText: {
    fontSize: SIZES.small,
    marginBottom: SIZES.base / 2,
  },
  recommendationsSection: { marginTop: SIZES.base },
  recommendationItem: { 
    marginBottom: SIZES.base,
    paddingBottom: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base / 2,
  },
  recommendationTitle: {
    fontSize: SIZES.font,
    fontWeight: '500',
    flex: 1,
    marginRight: SIZES.base,
  },
  priorityBadge: {
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius / 2,
  },
  priorityText: {
    color: COLORS.white,
    fontSize: SIZES.extraSmall,
    fontWeight: 'bold',
  },
  recommendationDetails: {
    fontSize: SIZES.small,
    marginBottom: SIZES.base / 2,
    lineHeight: SIZES.font * 1.2,
  },
  recommendationType: {
    fontSize: SIZES.extraSmall,
    fontStyle: 'italic',
  },
  moreText: {
    fontSize: SIZES.small,
    fontStyle: 'italic',
    marginTop: SIZES.base / 2,
  },
  // Patient Details Styles
  detailsGrid: {
    gap: SIZES.base,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: SIZES.base / 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  detailLabel: {
    fontSize: SIZES.small,
    fontWeight: '600',
    flex: 1,
    marginRight: SIZES.base,
  },
  detailValue: {
    fontSize: SIZES.small,
    flex: 2,
    textAlign: 'right',
  },
  vitalItem: { marginBottom: SIZES.base },
  vitalDate: {
    fontSize: SIZES.small,
    fontWeight: '500',
    marginBottom: SIZES.base / 2,
  },
  vitalData: { fontSize: SIZES.small },
  complicationItem: { marginBottom: SIZES.base },
  complicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base / 2,
  },
  complicationName: {
    fontSize: SIZES.font,
    fontWeight: '500',
    flex: 1,
  },
  probabilityBadge: {
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius / 2,
  },
  probabilityText: {
    color: COLORS.white,
    fontSize: SIZES.extraSmall,
    fontWeight: 'bold',
  },
  complicationDescription: { fontSize: SIZES.small },
  noDataText: {
    textAlign: 'center',
    fontSize: SIZES.small,
    fontStyle: 'italic',
    padding: SIZES.padding,
  },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SIZES.padding * 2 },
  errorText: { fontSize: SIZES.medium, textAlign: 'center' },
  emptyText: { fontSize: SIZES.medium, textAlign: 'center' },
});
