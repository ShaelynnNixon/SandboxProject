import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';

// Import components
import EmployeeCard from './components/EmployeeCard';
import EmployeeForm from './components/EmployeeForm';
import AvailabilityForm from './components/AvailabilityForm';

// Import API services
import * as api from './services/apiService';

export default function App() {
  // Replace with your computer's actual IP address
  const SERVER_URL = 'http://10.3.165.37:3000';

  // App state
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [storeSettings, setStoreSettings] = useState(null);
  const [currentView, setCurrentView] = useState('employees'); // 'employees', 'settings', 'addEmployee', 'addAvailability'
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [availabilityModalVisible, setAvailabilityModalVisible] = useState(false);

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
    fetchStoreSettings();
  }, []);

  // API calls
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await api.getEmployees();
      setEmployees(data);
    } catch (error) {
      Alert.alert('Error', `Failed to fetch employees: ${error.message}`);
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStoreSettings = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/store-settings`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setStoreSettings(data);
    } catch (error) {
      Alert.alert('Error', `Failed to fetch store settings: ${error.message}`);
      console.error('Error fetching store settings:', error);
    }
  };

  const handleAddEmployee = async (employee) => {
    setLoading(true);
    try {
      const data = await api.createEmployee(employee);
      await fetchEmployees(); // Refresh the employee list
      setCurrentView('employees');
      Alert.alert('Success', 'Employee added successfully');
    } catch (error) {
      Alert.alert('Error', `Failed to add employee: ${error.message}`);
      console.error('Error adding employee:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await api.deleteEmployee(id);
      setEmployees(employees.filter(emp => emp.id !== id));
      Alert.alert('Success', 'Employee deleted successfully');
    } catch (error) {
      Alert.alert('Error', `Failed to delete employee: ${error.message}`);
      console.error('Error deleting employee:', error);
    }
  };

  const handleAddAvailability = async (availability) => {
    setLoading(true);
    try {
      // Call the API to add availability
      await api.addEmployeeAvailability(selectedEmployee.id, availability);

      // Refresh the employee's availability data
      const updatedAvailability = await api.getEmployeeAvailability(selectedEmployee.id);
      setSelectedAvailability(updatedAvailability);

      Alert.alert('Success', 'Availability added successfully');

      // Close the availability modal and show the employee modal again
      setAvailabilityModalVisible(false);
      setModalVisible(true);
    } catch (error) {
      Alert.alert('Error', `Failed to add availability: ${error.message}`);
      console.error('Error adding availability:', error);
    } finally {
      setLoading(false);
    }
  };

  // Render functions
  const renderEmployeeList = () => {
    if (loading) {
      return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Loading employees...</Text>
          </View>
      );
    }

    return (
        <View style={styles.sectionContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>Employees</Text>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setCurrentView('addEmployee')}
            >
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {employees.length === 0 ? (
              <Text style={styles.emptyText}>No employees found. Add your first employee.</Text>
          ) : (
              employees.map(employee => (
                  <EmployeeCard
                      key={employee.id}
                      employee={employee}
                      onPress={(emp, availability) => {
                        setSelectedEmployee(emp);
                        setSelectedAvailability(availability);
                        setModalVisible(true);
                      }}
                      onDelete={handleDeleteEmployee}
                  />
              ))
          )}
        </View>
    );
  };

  const renderStoreSettings = () => {
    if (!storeSettings) {
      return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Loading store settings...</Text>
          </View>
      );
    }

    return (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Store Settings</Text>

          <View style={styles.settingsCard}>
            <Text style={styles.settingsTitle}>Operating Hours</Text>
            {Object.entries(storeSettings.operatingHours).map(([day, hours]) => (
                <View key={day} style={styles.settingsRow}>
                  <Text style={styles.settingsDay}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
                  <Text style={styles.settingsHours}>
                    {hours ? `${hours.open} - ${hours.close}` : 'Closed'}
                  </Text>
                </View>
            ))}
          </View>

          <View style={styles.settingsCard}>
            <Text style={styles.settingsTitle}>Labor Requirements</Text>
            <Text style={styles.settingsNote}>
              Labor requirements can be configured for different time slots throughout the day
            </Text>
            {storeSettings.laborRequirements && storeSettings.laborRequirements.monday ? (
                storeSettings.laborRequirements.monday.map((requirement, index) => (
                    <View key={index} style={styles.settingsRow}>
                      <Text style={styles.settingsTime}>{requirement.time}</Text>
                      <Text style={styles.settingsStaff}>{requirement.required} staff needed</Text>
                    </View>
                ))
            ) : (
                <Text style={styles.emptyText}>No labor requirements configured</Text>
            )}
          </View>
        </View>
    );
  };

  const renderEmployeeModal = () => {
    if (!selectedEmployee) return null;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
              setSelectedEmployee(null);
            }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedEmployee.name}</Text>
                <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      setSelectedEmployee(null);
                    }}
                >
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </View>

              <ScrollView>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Employee Details</Text>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Name:</Text>
                    <Text style={styles.modalValue}>{selectedEmployee.name}</Text>
                  </View>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Role:</Text>
                    <Text style={styles.modalValue}>{selectedEmployee.role || 'Staff'}</Text>
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <View style={styles.modalSectionHeader}>
                    <Text style={styles.modalSectionTitle}>Availability</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => {
                          setModalVisible(false);
                          setAvailabilityModalVisible(true);
                        }}
                    >
                      <Text style={styles.addButtonText}>+ Add</Text>
                    </TouchableOpacity>
                  </View>

                  {selectedAvailability && selectedAvailability.length > 0 ? (
                      selectedAvailability.map((avail, index) => (
                          <View key={index} style={styles.modalRow}>
                            <Text style={styles.modalLabel}>{avail.day_of_week}:</Text>
                            <Text style={styles.modalValue}>{avail.start_time} - {avail.end_time}</Text>
                          </View>
                      ))
                  ) : (
                      <Text style={styles.emptyText}>No availability set</Text>
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
    );
  };

  const renderAvailabilityModal = () => {
    if (!selectedEmployee) return null;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={availabilityModalVisible}
            onRequestClose={() => {
              setAvailabilityModalVisible(false);
              setModalVisible(true);
            }}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { maxHeight: '80%' }]}>
              <AvailabilityForm
                  employeeId={selectedEmployee.id}
                  onSubmit={handleAddAvailability}
                  onCancel={() => {
                    setAvailabilityModalVisible(false);
                    setModalVisible(true);
                  }}
                  loading={loading}
              />
            </View>
          </View>
        </Modal>
    );
  };
  // Main render
  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Employee Scheduler</Text>
        </View>

        <ScrollView style={styles.scrollView}>
          {currentView === 'employees' && renderEmployeeList()}
          {currentView === 'addEmployee' && (
              <View style={styles.sectionContainer}>
                <EmployeeForm
                    onSubmit={handleAddEmployee}
                    onCancel={() => setCurrentView('employees')}
                    loading={loading}
                />
              </View>
          )}
          {currentView === 'settings' && renderStoreSettings()}
        </ScrollView>

        <View style={styles.tabBar}>
          <TouchableOpacity
              style={[styles.tab, currentView === 'employees' && styles.activeTab]}
              onPress={() => setCurrentView('employees')}
          >
            <Text style={[styles.tabText, currentView === 'employees' && styles.activeTabText]}>Employees</Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={[styles.tab, currentView === 'settings' && styles.activeTab]}
              onPress={() => setCurrentView('settings')}
          >
            <Text style={[styles.tabText, currentView === 'settings' && styles.activeTabText]}>Settings</Text>
          </TouchableOpacity>
        </View>

        {renderEmployeeModal()}
        {renderAvailabilityModal()}
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  sectionContainer: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  settingsCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingsDay: {
    fontSize: 14,
    color: '#555',
  },
  settingsHours: {
    fontSize: 14,
    color: '#333',
  },
  settingsTime: {
    fontSize: 14,
    color: '#555',
  },
  settingsStaff: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  settingsNote: {
    fontSize: 12,
    color: '#777',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#4CAF50',
  },
  tabText: {
    color: '#999',
    fontSize: 14,
  },
  activeTabText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCloseText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalLabel: {
    fontSize: 14,
    color: '#555',
  },
  modalValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});