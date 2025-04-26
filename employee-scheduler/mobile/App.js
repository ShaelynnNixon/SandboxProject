import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';

export default function App() {
  // Replace with your computer's actual IP address
  const SERVER_URL = 'http://10.3.165.37:3000';
  
  // App state
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [storeSettings, setStoreSettings] = useState(null);
  const [currentView, setCurrentView] = useState('employees'); // 'employees', 'settings', 'addEmployee'
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    hourPreferences: {
      minHoursPerWeek: 20,
      maxHoursPerWeek: 40,
      maxHoursPerDay: 8
    }
  });

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
    fetchStoreSettings();
  }, []);

  // API calls
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/api/employees`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
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

  const addEmployee = async () => {
    if (!newEmployee.name.trim()) {
      Alert.alert('Error', 'Employee name is required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/api/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee),
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      setEmployees([...employees, data]);
      setNewEmployee({
        name: '',
        hourPreferences: {
          minHoursPerWeek: 20,
          maxHoursPerWeek: 40,
          maxHoursPerDay: 8
        }
      });
      setCurrentView('employees');
      Alert.alert('Success', 'Employee added successfully');
    } catch (error) {
      Alert.alert('Error', `Failed to add employee: ${error.message}`);
      console.error('Error adding employee:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      const response = await fetch(`${SERVER_URL}/api/employees/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      setEmployees(employees.filter(emp => emp.id !== id));
      Alert.alert('Success', 'Employee deleted successfully');
    } catch (error) {
      Alert.alert('Error', `Failed to delete employee: ${error.message}`);
      console.error('Error deleting employee:', error);
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
            <TouchableOpacity 
              key={employee.id}
              style={styles.employeeCard}
              onPress={() => {
                setSelectedEmployee(employee);
                setModalVisible(true);
              }}
            >
              <View style={styles.employeeInfo}>
                <Text style={styles.employeeName}>{employee.name}</Text>
                <Text style={styles.employeeDetail}>
                  Hours: {employee.hourPreferences?.minHoursPerWeek ?? 0}–{employee.hourPreferences?.maxHoursPerWeek ?? 0} hrs/week
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => {
                  Alert.alert(
                    'Confirm Delete',
                    `Are you sure you want to delete ${employee.name}?`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Delete', onPress: () => deleteEmployee(employee.id), style: 'destructive' }
                    ]
                  );
                }}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </View>
    );
  };

  const renderAddEmployeeForm = () => {
    return (
      <View style={styles.sectionContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Add New Employee</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setCurrentView('employees')}
          >
            <Text style={styles.backButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={newEmployee.name}
            onChangeText={(text) => setNewEmployee({...newEmployee, name: text})}
            placeholder="Employee Name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Minimum Hours per Week</Text>
          <TextInput
            style={styles.input}
            value={String(newEmployee.hourPreferences.minHoursPerWeek)}
            onChangeText={(text) => {
              const value = parseInt(text) || 0;
              setNewEmployee({
                ...newEmployee, 
                hourPreferences: {
                  ...newEmployee.hourPreferences,
                  minHoursPerWeek: value
                }
              });
            }}
            placeholder="Minimum Hours"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Maximum Hours per Week</Text>
          <TextInput
            style={styles.input}
            value={String(newEmployee.hourPreferences.maxHoursPerWeek)}
            onChangeText={(text) => {
              const value = parseInt(text) || 0;
              setNewEmployee({
                ...newEmployee, 
                hourPreferences: {
                  ...newEmployee.hourPreferences,
                  maxHoursPerWeek: value
                }
              });
            }}
            placeholder="Maximum Hours"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Maximum Hours per Day</Text>
          <TextInput
            style={styles.input}
            value={String(newEmployee.hourPreferences.maxHoursPerDay)}
            onChangeText={(text) => {
              const value = parseInt(text) || 0;
              setNewEmployee({
                ...newEmployee, 
                hourPreferences: {
                  ...newEmployee.hourPreferences,
                  maxHoursPerDay: value
                }
              });
            }}
            placeholder="Maximum Hours Per Day"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={addEmployee}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Add Employee</Text>
          )}
        </TouchableOpacity>
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
                <Text style={styles.modalSectionTitle}>Hour Preferences</Text>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Min Hours/Week:</Text>
                  <Text style={styles.modalValue}>{selectedEmployee.hourPreferences.minHoursPerWeek}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Max Hours/Week:</Text>
                  <Text style={styles.modalValue}>{selectedEmployee.hourPreferences.maxHoursPerWeek}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Max Hours/Day:</Text>
                  <Text style={styles.modalValue}>{selectedEmployee.hourPreferences.maxHoursPerDay}</Text>
                </View>
              </View>
              
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Availability</Text>
                {selectedEmployee.availability ? (
                  Object.entries(selectedEmployee.availability).map(([day, hours]) => (
                    <View key={day} style={styles.modalRow}>
                      <Text style={styles.modalLabel}>{day.charAt(0).toUpperCase() + day.slice(1)}:</Text>
                      <Text style={styles.modalValue}>
                        {hours ? `${hours.start} - ${hours.end}` : 'Not Available'}
                      </Text>
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

  // Main render
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Employee Scheduler</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {currentView === 'employees' && renderEmployeeList()}
        {currentView === 'addEmployee' && renderAddEmployeeForm()}
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
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  backButtonText: {
    color: '#666',
  },
  employeeCard: {
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
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  employeeDetail: {
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
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
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
})