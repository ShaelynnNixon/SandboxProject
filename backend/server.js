const cors = require('cors');
const bodyParser = require('body-parser');
const db = require("./db.js");
const app = require('../app');
const port = 3000;

console.log("➡️  booting backend/server.js…");

// Sample data - in a real app, this would be in a database
let employees = [
    {
        id: 1,
        name: 'John Smith',
        availability: {
            monday: { start: '09:00', end: '17:00' },
            tuesday: { start: '09:00', end: '17:00' },
            wednesday: { start: '09:00', end: '17:00' },
            thursday: { start: '09:00', end: '17:00' },
            friday: { start: '09:00', end: '17:00' },
            saturday: null,
            sunday: null
        },
        hourPreferences: {
            minHoursPerWeek: 30,
            maxHoursPerWeek: 40,
            maxHoursPerDay: 8
        }
    },
    {
        id: 2,
        name: 'Jane Doe',
        availability: {
            monday: { start: '12:00', end: '20:00' },
            tuesday: { start: '12:00', end: '20:00' },
            wednesday: null,
            thursday: { start: '12:00', end: '20:00' },
            friday: { start: '12:00', end: '20:00' },
            saturday: { start: '10:00', end: '18:00' },
            sunday: null
        },
        hourPreferences: {
            minHoursPerWeek: 25,
            maxHoursPerWeek: 35,
            maxHoursPerDay: 8
        }
    }
];

let storeSettings = {
    operatingHours: {
        monday: { open: '09:00', close: '21:00' },
        tuesday: { open: '09:00', close: '21:00' },
        wednesday: { open: '09:00', close: '21:00' },
        thursday: { open: '09:00', close: '21:00' },
        friday: { open: '09:00', close: '22:00' },
        saturday: { open: '10:00', close: '22:00' },
        sunday: { open: '10:00', close: '18:00' }
    },
    laborRequirements: {
        monday: [
            { time: '09:00-13:00', required: 2 },
            { time: '13:00-17:00', required: 3 },
            { time: '17:00-21:00', required: 2 }
        ],
        // Other days would be defined similarly
    }
};

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON request bodies

// Base route
app.get('/', (req, res) => {
    res.send('Employee Scheduler API is running');
});

// Get all employees
app.get('/api/employees', async (req, res, next) => {
      try {
            const list = await db.getAllEmployees();
            res.json(list);
          } catch (err) {
          next(err);
          }
     });

// Get a specific employee
app.get('/api/employees/:id', async (req, res, next) => {
    const id = parseInt(req.params.id);

    try {
        const list = await db.getEmployee(id);
        res.json(list);
    } catch (err) {
        next(err);
    }
});

// Create a new employee
app.post('/api/employees', async (req, res) => {
    /*const newEmployee = {
        id: employees.length > 0 ? Math.max(...employees.map(emp => emp.id)) + 1 : 1,
        name: req.body.name,
        availability: req.body.availability || {},
        hourPreferences: req.body.hourPreferences || {
            minHoursPerWeek: 0,
            maxHoursPerWeek: 40,
            maxHoursPerDay: 8
        }
    };

    employees.push(newEmployee);
    res.status(201).json(newEmployee);*/
    try {
        const name = req.body.name;
        const role = req.body.role;

        console.log("name    = " + name);
        console.log("role    = " + role);

        if (name === undefined) {
            res.status(400).json({"error": "bad request: expected parameter 'name' is not defined"});
            return;
        }

        if (role === undefined) {
            res.status(400).json({"error": "bad request: expected parameter 'role' is not defined"});
            return;
        }

        let createdEmployee = {
            id: null,  // Will be initialized by the database after the insert
            name: name,
            role: role
        };

        // Insert the new assignee into the database
        createdEmployee = await db.createNewEmployee(createdEmployee);

        // Return the newly created assignee with a 201 status code
        res.status(201).json(createdEmployee);
    } catch (err) {
        console.error("Error:", err.message);
        res.status(422).json({"error": "failed to add new employee to the database"});
    }
});

// Update an employee
app.put('/api/employees/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = employees.findIndex(emp => emp.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Employee not found' });
    }

    const updatedEmployee = {
        id: id,
        name: req.body.name || employees[index].name,
        availability: req.body.availability || employees[index].availability,
        hourPreferences: req.body.hourPreferences || employees[index].hourPreferences
    };

    employees[index] = updatedEmployee;
    res.json(updatedEmployee);
});

// Delete an employee
app.delete('/api/employees/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = employees.findIndex(emp => emp.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Employee not found' });
    }

    employees.splice(index, 1);
    res.status(204).send();
});

// Get store settings
app.get('/api/store-settings', (req, res) => {
    res.json(storeSettings);
});

// Update store settings
app.put('/api/store-settings', (req, res) => {
    if (req.body.operatingHours) {
        storeSettings.operatingHours = req.body.operatingHours;
    }

    if (req.body.laborRequirements) {
        storeSettings.laborRequirements = req.body.laborRequirements;
    }

    res.json(storeSettings);
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

// Additional packages you'll need to install:
// npm install express cors body-parser
app.get('/api/employees/:id/availability', async (req, res, next) => {
    try {
        const data = await db.getEmployeeAvailability(parseInt(req.params.id));
        res.json(data);
    } catch (err) {
        next(err);
    }
});
