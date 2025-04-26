import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';

const EmployeeCard = ({ employee, onPress, onDelete }) => {
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
      onPress={() => onPress(employee)}
    >
      <View style={styles.info}>
        <Text style={styles.name}>{employee.name}</Text>
        <Text style={styles.detail}>
          Hours: {employee.hourPreferences.minHoursPerWeek}-{employee.hourPreferences.maxHoursPerWeek} hrs/week
        </Text>
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