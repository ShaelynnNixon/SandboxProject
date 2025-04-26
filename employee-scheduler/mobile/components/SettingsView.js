import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator, ScrollView } from 'react-native';

const SettingsView = ({ settings, loading }) => {
  if (loading || !settings) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading store settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Store Settings</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Operating Hours</Text>
        {Object.entries(settings.operatingHours).map(([day, hours]) => (
          <View key={day} style={styles.row}>
            <Text style={styles.dayName}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
            <Text style={styles.hours}>
              {hours ? `${hours.open} - ${hours.close}` : 'Closed'}
            </Text>
          </View>
        ))}
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Labor Requirements</Text>
        <Text style={styles.note}>
          Labor requirements can be configured for different time slots throughout the day
        </Text>
        {settings.laborRequirements && settings.laborRequirements.monday ? (
          settings.laborRequirements.monday.map((requirement, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.timeSlot}>{requirement.time}</Text>
              <Text style={styles.staffNumber}>{requirement.required} staff needed</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No labor requirements configured</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dayName: {
    fontSize: 14,
    color: '#555',
  },
  hours: {
    fontSize: 14,
    color: '#333',
  },
  timeSlot: {
    fontSize: 14,
    color: '#555',
  },
  staffNumber: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  note: {
    fontSize: 12,
    color: '#777',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
});

export default SettingsView;