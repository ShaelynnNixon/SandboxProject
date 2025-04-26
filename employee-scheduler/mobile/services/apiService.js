// Replace this with your computer's actual IP address
const API_URL = 'http://10.3.165.37:3000/api';

/**
 * Fetch all employees from the API
 * @returns {Promise<Array>} Promise resolving to array of employees
 */
export const getEmployees = async () => {
  try {
    const response = await fetch(`${API_URL}/employees`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

/**
 * Fetch a specific employee from the API
 * @param {number} id - Employee ID
 * @returns {Promise<Object>} Promise resolving to employee object
 */
export const getEmployee = async (id) => {
  try {
    const response = await fetch(`${API_URL}/employees/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching employee ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new employee
 * @param {Object} employee - Employee data
 * @returns {Promise<Object>} Promise resolving to created employee
 */
export const createEmployee = async (employee) => {
  try {
    const response = await fetch(`${API_URL}/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employee),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

/**
 * Update an existing employee
 * @param {number} id - Employee ID
 * @param {Object} updates - Employee data updates
 * @returns {Promise<Object>} Promise resolving to updated employee
 */
export const updateEmployee = async (id, updates) => {
  try {
    const response = await fetch(`${API_URL}/employees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating employee ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an employee
 * @param {number} id - Employee ID
 * @returns {Promise<void>}
 */
export const deleteEmployee = async (id) => {
  try {
    const response = await fetch(`${API_URL}/employees/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error deleting employee ${id}:`, error);
    throw error;
  }
};

/**
 * Fetch store settings
 * @returns {Promise<Object>} Promise resolving to store settings
 */
export const getStoreSettings = async () => {
  try {
    const response = await fetch(`${API_URL}/store-settings`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching store settings:', error);
    throw error;
  }
};

/**
 * Update store settings
 * @param {Object} settings - Updated store settings
 * @returns {Promise<Object>} Promise resolving to updated store settings
 */
export const updateStoreSettings = async (settings) => {
  try {
    const response = await fetch(`${API_URL}/store-settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating store settings:', error);
    throw error;
  }
};

/**
 * Fetch availability for a specific employee
 * @param {number} id
 * @returns {Promise<Array>} Promise resolving to availability records
 */
export const getEmployeeAvailability = async (id) => {
  try {
    const response = await fetch(`${API_URL}/employees/${id}/availability`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching availability for employee ${id}:`, error);
    throw error;
  }
};

/**
 * Add availability for an employee
 * @param {number} employeeId - Employee ID
 * @param {Object} availability - Availability data
 * @returns {Promise<Object>} Promise resolving to created availability
 */
export const addEmployeeAvailability = async (employeeId, availability) => {
  try {
    const response = await fetch(`${API_URL}/employees/${employeeId}/availability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(availability),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error adding availability for employee ${employeeId}:`, error);
    throw error;
  }
};
