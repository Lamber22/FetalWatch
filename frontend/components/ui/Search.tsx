import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Platform, TouchableOpacity, useColorScheme } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, SHADOWS } from '../constants/Theme';
import { useTheme } from '../../contexts/ThemeContext';

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
  const { colors } = useTheme();
  const colorScheme = useColorScheme();

  const filteredRoles = userRole === 'healthProvider'
    ? roles.filter(r => r.value !== 'admin')
    : roles;

  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
  <View style={[styles.container, { backgroundColor: colors.background, ...SHADOWS.light }]}>
      <View style={styles.inputRow}>
        <View style={[styles.searchBox, { backgroundColor: colors.white, borderColor: colors.gray }]}> 
          <Ionicons name="search" size={18} color={colors.gray} style={{ marginRight: SIZES.base - 2 }} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Search..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor={colors.gray}
            clearButtonMode="while-editing"
          />
        </View>
        <View style={[styles.pickerBox, { backgroundColor: colors.white, borderColor: colors.gray }]}> 
          <Picker
            selectedValue={filterRole}
            style={[styles.picker, { color: colors.text }]}
            onValueChange={setFilterRole}
            dropdownIconColor={colors.primary}
          >
            {filteredRoles.map(role => (
              <Picker.Item key={role.label} label={role.label} value={role.value} />
            ))}
          </Picker>
        </View>
        <TouchableOpacity
          style={[styles.dateButton, { backgroundColor: colors.white, borderColor: colors.gray }]}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar-outline" size={18} color={colors.primary} />
        </TouchableOpacity>
        {showDatePicker && (
          Platform.OS === 'web' ? (
            <input
              type="date"
              style={{
                marginLeft: SIZES.base,
                height: 40,
                borderRadius: SIZES.radius,
                border: `1px solid ${colors.gray}`,
                padding: SIZES.base - 2,
                outline: 'none',
                fontSize: SIZES.medium,
                background: colors.white,
                color: colors.text,
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
    padding: SIZES.base,
    borderRadius: SIZES.base + 2,
    marginBottom: SIZES.base + 4,
    boxShadow: '0px 2px 3px rgba(0,0,0,0.1)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.base + 2,
    borderWidth: 1,
    height: 40,
  },
  input: {
    flex: 1,
    fontSize: SIZES.medium,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  pickerBox: {
    minWidth: 110,
    borderRadius: SIZES.radius,
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
    borderRadius: SIZES.radius,
    borderWidth: 1,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
