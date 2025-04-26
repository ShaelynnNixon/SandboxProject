import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { getEmployeeAvailability } from '../services/apiService';

const EmployeeCard = ({ employee, onPress, onDelete }) => {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load availability if the component is mounted
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    if (!employee.id) return;

    setLoading(true);
    try {
      const data = await getEmployeeAvailability(employee.id);
      setAvailability(data);
    } catch (error) {
      console.error('Error loading availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
        'Confirm Delete',
        `Are you sure you want to delete ${employee.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', onPress: () => onDelete(employee.id), style: 'destructive' }
        ]
    );
  };

  return (
      <TouchableOpacity
          style={styles.card}
          onPress={() => onPress(employee, availability)}
      >
        <View style={styles.info}>
          <Text style={styles.name}>{employee.name}</Text>
          <Text style={styles.detail}>
            Role: {employee.role || 'Staff'}
          </Text>
          {loading ? (
              <ActivityIndicator size="small" color="#4CAF50" />
          ) : availability ? (
              <Text style={styles.detail}>
                Available: {availability.length} days
              </Text>
          ) : (
              <Text style={styles.detail}>No availability set</Text>
          )}
        </View>
        <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  detail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  deleteButton: {
    backgroundColor: '#ffebee',
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#d32f2f',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default EmployeeCard;