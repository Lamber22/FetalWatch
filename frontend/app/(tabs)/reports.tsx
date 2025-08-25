import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, FlatList, TextInput, Animated, Keyboard, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../components/constants/Theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useReports } from '../../contexts/ReportsContext';
import { usePatients } from '../../contexts/PatientsContext';
import { usePatientReports, PatientReportUtils } from '../../hooks/usePatientReports';
import { SearchBar } from '../../utils/Search';

export default function ReportsScreen() {
  const { colors } = useTheme();
  const {
    dashboardReport,
    facilityReport,
    riskIndicatorsReport,
    riskAssessment,
    vitalTrends,
    complications,
    loading,
    error,
    getDashboardReport,
    getFacilityReport,
    getRiskIndicatorsReport,
    fetchRiskAssessment,
    fetchVitalTrends,
    fetchComplications,
    exportReport,
    clearError
  } = useReports();

  const { patients, fetchPatients } = usePatients();
  const { patientReports, loadingReports, loadPatientReports, isLoading, hasData } = usePatientReports();
  const [showPatients, setShowPatients] = useState(false);
  const [expandedPatient, setExpandedPatient] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [searchFilter, setSearchFilter] = useState<'all' | 'high-risk' | 'recent'>('all');

  useEffect(() => {
    // Load initial reports when component mounts
    loadReports();
    loadPatients();
  }, []);

  useEffect(() => {
    // Filter patients based on search query
    let filtered = patients || [];
    
    // Apply search filter first
    if (searchFilter === 'high-risk') {
      // This would need actual risk data, for now just filter by name containing certain keywords
      filtered = filtered.filter((patient: any) => 
        patient.name?.toLowerCase().includes('risk') || 
        patient.contact?.includes('urgent')
      );
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
  }, [searchQuery, patients, searchFilter]);

  const loadReports = async () => {
    try {
      await Promise.all([
        getDashboardReport(),
        getFacilityReport(),
        getRiskIndicatorsReport()
      ]);
    } catch (error) {
      console.error('Failed to load reports:', error);
    }
  };

  const loadPatients = async () => {
    try {
      await fetchPatients();
    } catch (error) {
      console.error('Failed to load patients:', error);
    }
  };

  const togglePatientDetails = async (patientId: string) => {
    if (expandedPatient === patientId) {
      setExpandedPatient(null);
    } else {
      setExpandedPatient(patientId);
      await loadPatientReports(patientId);
    }
  };

  const handleQuickSearch = (searchTerm: string) => {
    setSearchQuery(searchTerm);
  };

  // Transform the context reports into the format expected by the UI
  const reports = [
    {
      id: 'dashboard',
      title: 'Dashboard Report',
      date: dashboardReport?.generatedAt ? new Date(dashboardReport.generatedAt).toLocaleDateString() : 'Not generated',
      type: 'Analytics',
      status: dashboardReport ? 'Completed' : 'Pending',
      data: dashboardReport,
      summary: dashboardReport ? `${dashboardReport.summary.totalPatients} patients, ${dashboardReport.summary.highRiskPatients} high risk` : 'No data'
    },
    {
      id: 'facility',
      title: 'Facility Report',
      date: facilityReport?.generatedAt ? new Date(facilityReport.generatedAt).toLocaleDateString() : 'Not generated',
      type: 'Facility Analysis',
      status: facilityReport ? 'Completed' : 'Pending',
      data: facilityReport,
      summary: facilityReport ? `${facilityReport.overview.totalPatients} total patients, ${facilityReport.overview.totalRecords} records` : 'No data'
    },
    {
      id: 'risk',
      title: 'Risk Indicators Report',
      date: riskIndicatorsReport?.generatedAt ? new Date(riskIndicatorsReport.generatedAt).toLocaleDateString() : 'Not generated',
      type: 'Risk Assessment',
      status: riskIndicatorsReport ? 'Completed' : 'Pending',
      data: riskIndicatorsReport,
      summary: riskIndicatorsReport ? `${riskIndicatorsReport.summary.totalPatientsWithRisk} at-risk patients` : 'No data'
    },
  ];

  const handleExportReport = async (reportType: string) => {
    try {
      await exportReport(reportType as any);
      // Handle successful export (e.g., show success message)
    } catch (error) {
      // Error is already handled in the context
      console.error('Export failed:', error);
    }
  };

  const renderPatientItem = ({ item }: { item: any }) => {
    // Calculate age from dateOfBirth if available
    const age = item.dateOfBirth 
      ? new Date().getFullYear() - new Date(item.dateOfBirth).getFullYear()
      : 'N/A';
    
    const isExpanded = expandedPatient === item._id;
    const reportData = patientReports[item._id];
    const isLoadingReports = isLoading(item._id);
    
    return (
      <View style={[styles.patientRow, { backgroundColor: colors.white }]}>
        <TouchableOpacity 
          style={styles.patientHeader}
          onPress={() => togglePatientDetails(item._id)}
        >
          <View style={styles.patientInfo}>
            <Text style={[styles.patientName, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.patientDetails, { color: colors.gray }]}>
              ID: {item._id?.slice(-6) || 'N/A'} • Age: {age} • Contact: {item.contact || 'N/A'}
            </Text>
            <Text style={[styles.patientMedical, { color: colors.gray }]}>
              Week of Pregnancy: {item.weekOfPregnancy || 'N/A'} • Gender: {item.gender || 'N/A'}
            </Text>
          </View>
          <View style={styles.expandButton}>
            <Ionicons 
              name={isExpanded ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={colors.primary} 
            />
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
                {/* Risk Assessment Tab */}
                <View style={[styles.reportSection, { backgroundColor: colors.white }]}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Risk Assessment</Text>
                  {reportData.riskAssessment ? (
                    <View>
                      <View style={styles.riskSummary}>
                        <View style={[
                          styles.riskBadge, 
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
  };

  const renderPatientsTable = () => (
    <View style={[styles.patientsContainer, { backgroundColor: colors.white }]}>
      <View style={styles.patientsHeader}>
        <Text style={[styles.patientsTitle, { color: colors.text }]}>Patients List</Text>
        <Text style={[styles.patientsCount, { color: colors.gray }]}>
          {searchQuery 
            ? `${filteredPatients?.length || 0} of ${patients?.length || 0} patients`
            : `${patients?.length || 0} patients`
          }
        </Text>
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

      {/* Search Results Summary */}
      {searchQuery.length > 0 && (
        <View style={styles.searchSummary}>
          <View style={styles.searchSummaryContent}>
            <Ionicons 
              name={filteredPatients.length > 0 ? "checkmark-circle" : "alert-circle"} 
              size={16} 
              color={filteredPatients.length > 0 ? colors.success : colors.warning} 
            />
            <Text style={[styles.searchSummaryText, { color: colors.gray }]}>
              {filteredPatients.length === 0 
                ? `No results found for "${searchQuery}"`
                : `Found ${filteredPatients.length} patient${filteredPatients.length !== 1 ? 's' : ''} matching "${searchQuery}"`
              }
            </Text>
            {filteredPatients.length === 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.searchSuggestionButton}>
                <Text style={[styles.searchSuggestionButtonText, { color: colors.primary }]}>
                  Clear search
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <FlatList
        data={filteredPatients}
        renderItem={renderPatientItem}
        keyExtractor={(item) => item._id || Math.random().toString()}
        style={styles.patientsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={48} color={colors.gray} />
            <Text style={[styles.emptyText, { color: colors.gray }]}>
              {searchQuery ? 'No patients found matching your search' : 'No patients available'}
            </Text>
            {searchQuery && (
              <Text style={[styles.emptySubText, { color: colors.gray }]}>
                Try searching with a different term
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading reports...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={{ flex: 2 }} />
        <View style={styles.titleContainer}>
          <Image source={require('../../assets/logo/fetalwatch.png')} style={styles.logo} />
          <Text style={styles.title} numberOfLines={1}>Reports</Text>
        </View>
        <View style={{ flex: 2 }} />
      </View>
      <View style={[styles.subHeader, { backgroundColor: colors.primary }]}>
        <View style={styles.headerLeft}>
          {!showPatients && (
            <Text style={[styles.headerHint, { color: colors.white }]}>
              Tap 👥 to view patients
            </Text>
          )}
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.toggleButton, { backgroundColor: colors.white }]}
            onPress={() => {
              setShowPatients(!showPatients);
              setSearchQuery(''); // Clear search when switching views
              setExpandedPatient(null); // Collapse any expanded patient
            }}
          >
            <Ionicons 
              name={showPatients ? "list" : "people"} 
              size={20} 
              color={colors.primary} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.refreshButton, { backgroundColor: colors.white }]}
            onPress={loadReports}
          >
            <Ionicons name="refresh" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {error && (
          <View style={[styles.errorContainer, { backgroundColor: colors.error }]}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={clearError}>
              <Ionicons name="close" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        )}

        {showPatients ? (
          renderPatientsTable()
        ) : (
          <>
            {/* Reports Summary */}
            <View style={[styles.summaryCard, { backgroundColor: colors.white }]}>
              <Text style={[styles.summaryTitle, { color: colors.text }]}>Reports Summary</Text>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryNumber, { color: colors.primary }]}>
                    {dashboardReport?.summary.totalPatients || 0}
                  </Text>
                  <Text style={[styles.summaryLabel, { color: colors.gray }]}>Total Patients</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryNumber, { color: colors.error }]}>
                    {dashboardReport?.summary.highRiskPatients || 0}
                  </Text>
                  <Text style={[styles.summaryLabel, { color: colors.gray }]}>High Risk</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryNumber, { color: colors.warning }]}>
                    {dashboardReport?.summary.moderateRiskPatients || 0}
                  </Text>
                  <Text style={[styles.summaryLabel, { color: colors.gray }]}>Moderate Risk</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryNumber, { color: colors.success }]}>
                    {dashboardReport?.summary.lowRiskPatients || 0}
                  </Text>
                  <Text style={[styles.summaryLabel, { color: colors.gray }]}>Low Risk</Text>
                </View>
              </View>
            </View>

            {/* Reports List */}
            {reports.map((report) => (
              <TouchableOpacity
                key={report.id}
                style={[styles.reportCard, { backgroundColor: colors.white }]}
                onPress={() => handleExportReport(report.id)}
              >
                <View style={styles.reportInfo}>
                  <Text style={[styles.reportTitle, { color: colors.text }]}>
                    {report.title}
                  </Text>
                  <Text style={[styles.reportDate, { color: colors.gray }]}>
                    {report.date}
                  </Text>
                  <Text style={[styles.reportType, { color: colors.gray }]}>
                    {report.type}
                  </Text>
                  <Text style={[styles.reportSummary, { color: colors.gray }]}>
                    {report.summary}
                  </Text>
                </View>
                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          report.status === 'Completed' ? colors.success : colors.warning,
                      },
                    ]}
                  >
                    <Text style={styles.statusText}>{report.status}</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.exportButton, { backgroundColor: colors.primary }]}
                    onPress={() => handleExportReport(report.id)}
                  >
                    <Ionicons name="download" size={16} color={colors.white} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    paddingTop: SIZES.padding,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  headerHint: {
    fontSize: SIZES.small,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: SIZES.base / 2,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: SIZES.base,
  },
  toggleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
  },
  loadingText: {
    marginTop: SIZES.base,
    fontSize: SIZES.font,
  },
  errorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
  },
  errorText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    flex: 1,
  },
  summaryCard: {
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
    ...SHADOWS.light,
  },
  summaryTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: SIZES.padding,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryNumber: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
  },
  summaryLabel: {
    fontSize: SIZES.small,
    marginTop: SIZES.base / 2,
    textAlign: 'center',
  },
  reportCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
    ...SHADOWS.light,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: SIZES.medium,
    fontWeight: '500',
  },
  reportDate: {
    fontSize: SIZES.small,
    marginTop: SIZES.base / 2,
  },
  reportType: {
    fontSize: SIZES.small,
    marginTop: SIZES.base / 2,
  },
  reportSummary: {
    fontSize: SIZES.small,
    marginTop: SIZES.base / 2,
    fontStyle: 'italic',
  },
  statusContainer: {
    alignItems: 'center',
    gap: SIZES.base,
  },
  statusBadge: {
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
  },
  statusText: {
    color: COLORS.white,
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  exportButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  patientsContainer: {
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  patientsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  patientsTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  patientsCount: {
    fontSize: SIZES.font,
  },
  searchContainer: {
    margin: SIZES.padding,
    borderRadius: SIZES.radius * 1.5,
    borderWidth: 1,
    overflow: 'hidden',
  ...SHADOWS.light,
  ...SHADOWS.light,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base + 2,
    minHeight: 48,
  },
  searchIconContainer: {
    marginRight: SIZES.base,
    padding: SIZES.base / 2,
  },
  searchInput: {
    flex: 1,
    fontSize: SIZES.font,
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.base / 2,
    borderRadius: SIZES.radius / 2,
    minHeight: 32,
  },
  clearButtonContainer: {
    marginLeft: SIZES.base,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchHints: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  searchHintText: {
    fontSize: SIZES.small,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  suggestionsContainer: {
    marginHorizontal: SIZES.padding,
    marginTop: -SIZES.base,
    borderRadius: SIZES.radius,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: 'hidden',
    zIndex: 1000,
  },
  suggestionsTitle: {
    fontSize: SIZES.small,
    fontWeight: '600',
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.base,
    paddingBottom: SIZES.base / 2,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderBottomWidth: 1,
  },
  suggestionText: {
    flex: 1,
    fontSize: SIZES.font,
    marginLeft: SIZES.base,
  },
  searchSummary: {
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.base,
  },
  searchSummaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  searchSummaryText: {
    fontSize: SIZES.small,
    marginLeft: SIZES.base,
    flex: 1,
  },
  searchSuggestionButton: {
    marginLeft: SIZES.base,
  },
  searchSuggestionButtonText: {
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.padding * 2,
  },
  emptyText: {
    fontSize: SIZES.font,
    textAlign: 'center',
    marginTop: SIZES.base,
    fontWeight: '500',
  },
  emptySubText: {
    fontSize: SIZES.small,
    textAlign: 'center',
    marginTop: SIZES.base / 2,
  },
  patientsList: {
    maxHeight: 400,
  },
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
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: SIZES.font,
    fontWeight: '500',
  },
  patientDetails: {
    fontSize: SIZES.small,
    marginTop: SIZES.base / 2,
  },
  patientMedical: {
    fontSize: SIZES.small,
    marginTop: SIZES.base / 2,
  },
  expandButton: {
    padding: SIZES.base,
  },
  patientDetailsContainer: {
    padding: SIZES.padding,
  },
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
  reportTabs: {
    gap: SIZES.padding,
  },
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
  riskBadge: {
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
  riskFactors: {
    marginTop: SIZES.base,
  },
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
  vitalItem: {
    marginBottom: SIZES.base,
  },
  vitalDate: {
    fontSize: SIZES.small,
    fontWeight: '500',
    marginBottom: SIZES.base / 2,
  },
  vitalData: {
    fontSize: SIZES.small,
  },
  complicationItem: {
    marginBottom: SIZES.base,
  },
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
  complicationDescription: {
    fontSize: SIZES.small,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: SIZES.small,
    fontStyle: 'italic',
    padding: SIZES.padding,
  },
  viewButton: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
  },
  viewButtonText: {
    color: COLORS.white,
    fontSize: SIZES.small,
    fontWeight: '500',
  },
}); 