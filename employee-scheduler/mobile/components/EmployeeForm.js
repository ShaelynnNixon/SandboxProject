import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from 'react-native';

const EmployeeForm = ({ onSubmit, onCancel, loading }) => {
  const [employee, setEmployee] = useState({
    name: '',
    role: 'Staff'
  });

  const handleChange = (field, value) => {
    setEmployee({
      ...employee,
      [field]: value
    });
  };

  const handleSubmit = () => {
    if (!employee.name.trim()) {
      alert('Employee name is required');
      return;
    }
    onSubmit(employee);
  };

  return (
      <ScrollView style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Add New Employee</Text>
          <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
              style={styles.input}
              value={employee.name}
              onChangeText={(text) => handleChange('name', text)}
              placeholder="Employee Name"
              placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Role</Text>
          <TextInput
              style={styles.input}
              value={employee.role}
              onChangeText={(text) => handleChange('role', text)}
              placeholder="Employee Role"
              placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
        >
          {loading ? (
              <ActivityIndicator size="small" color="#fff" />
          ) : (
              <Text style={styles.submitButtonText}>Add Employee</Text>
          )}
        </TouchableOpacity>

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            Note: After adding an employee, you'll be able to set their availability on their profile.
          </Text>
        </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cancelButtonText: {
    color: '#666',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoSection: {
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 5,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#2e7d32',
  },
});

export default EmployeeForm;