import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Platform, TouchableOpacity, useColorScheme } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

interface SearchFilterProps {
  search: string;
  setSearch: (v: string) => void;
  filterRole: string | null;
  setFilterRole: (v: string | null) => void;
  roles?: { label: string; value: string | null }[];
  userRole?: string;
  dateFilter?: 'createdAt' | 'updatedAt' | null;
  setDateFilter?: (v: 'createdAt' | 'updatedAt' | null) => void;
  dateValue?: Date | null;
  setDateValue?: (d: Date | null) => void;
}

export default function SearchFilterBar({
  search,
  setSearch,
  filterRole,
  setFilterRole,
  roles = [
    { label: 'All', value: null },
    { label: 'Doctor', value: 'doctor' },
    { label: 'Midwife', value: 'midwife' },
    { label: 'Admin', value: 'admin' },
    { label: 'Health Provider', value: 'healthProvider' },
  ],
  userRole,
  dateFilter,
  setDateFilter,
  dateValue,
  setDateValue,
}: SearchFilterProps) {
  const colorScheme = useColorScheme();
  const theme = {
    background: colorScheme === 'dark' ? '#181A20' : '#fff',
    card: colorScheme === 'dark' ? '#23262F' : '#F5F6FA',
    border: colorScheme === 'dark' ? '#333' : '#E2E8F0',
    text: colorScheme === 'dark' ? '#fff' : '#333',
    placeholder: colorScheme === 'dark' ? '#aaa' : '#888',
    icon: colorScheme === 'dark' ? '#aaa' : '#888',
    accent: '#5271FF',
    shadow: colorScheme === 'dark' ? '#000' : '#000',
  };

  const filteredRoles = userRole === 'healthProvider'
    ? roles.filter(r => r.value !== 'admin')
    : roles;

  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: theme.background, shadowColor: theme.shadow }]}> 
      <View style={styles.inputRow}>
        <View style={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.border }]}> 
          <Ionicons name="search" size={18} color={theme.icon} style={{ marginRight: 6 }} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Search..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor={theme.placeholder}
            clearButtonMode="while-editing"
          />
        </View>
        <View style={[styles.pickerBox, { backgroundColor: theme.card, borderColor: theme.border }]}> 
          <Picker
            selectedValue={filterRole}
            style={[styles.picker, { color: theme.text }]}
            onValueChange={setFilterRole}
            dropdownIconColor={theme.accent}
          >
            {filteredRoles.map(role => (
              <Picker.Item key={role.label} label={role.label} value={role.value} />
            ))}
          </Picker>
        </View>
        <TouchableOpacity
          style={[styles.dateButton, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar-outline" size={18} color={theme.accent} />
        </TouchableOpacity>
        {showDatePicker && (
          Platform.OS === 'web' ? (
            <input
              type="date"
              style={{
                marginLeft: 8,
                height: 40,
                borderRadius: 8,
                border: `1px solid ${theme.border}`,
                padding: 6,
                outline: 'none',
                fontSize: 16,
                background: theme.card,
                color: theme.text,
              }}
              value={dateValue ? dateValue.toISOString().split('T')[0] : ''}
              onChange={e => {
                const value = (e.target as any).value;
                if (setDateValue) setDateValue(value ? new Date(value) : null);
                setShowDatePicker(false);
              }}
              autoFocus
            />
          ) : (
            <DateTimePicker
              value={dateValue || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (setDateValue) setDateValue(selectedDate || null);
              }}
            />
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 10,
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    height: 40,
  },
  input: {
    flex: 1,
    fontSize: 16,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  pickerBox: {
    minWidth: 110,
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
  },
  picker: {
    height: 40,
    width: '100%',
  },
  dateButton: {
    marginLeft: 4,
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
