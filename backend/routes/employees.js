let express = require('express');
let router = express.Router();
const db = require("./../db");


/**
 * http://localhost:3000/employees
 * GET /employees
 *
 * @return a list of employees as JSON
 */
router.get("/employees", async (req, res) => {
    try {
        const employees = await db.getAllEmployees();  // <- this function
        res.status(200).json(employees);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to get employees" });
    }
});


/**
 * POST /employees
 * with the following form parameters:
 *    firstname
 *    lastname
 *    role
 * The parameters passed in the body of the POST request are used to create a new assignee.
 * The new ticket is inserted into the assignees table in the database.
 *
 * @return the created assignee (which was inserted into the database), as JSON
 */
router.post("/employees", async function (req, res) {
    try {
        // Extract the assignee data from the request body
        const name = req.body.name;
        const role = req.body.role;

        // Logging the received parameters
        console.log("name   = " + name);
        console.log("role   = " + role)

        // Validate that required parameters are provided
        if (name === undefined) {
            res.status(400).json({"error": "bad request: expected parameter 'name' is not defined"});
            return;
        }

        if (role === undefined) {
            res.status(400).json({"error": "bad request: expected parameter 'role' is not defined"});
            return;
        }

        // Create the assignee object that will be inserted into the database
        let createdEmployee = {
            id: null,  // Will be initialized by the database after the insert
            name: name,
            role: role
        };

        // Insert the new assignee into the database
        createdEmployee = await db.createNewEmployee(createdEmployee);

        // Return the newly created assignee with a 201 status code
        res.status(201).json(createdEmployee);
    }
    catch (err) {
        console.error("Error:", err.message);
        res.status(422).json({"error": "failed to add new employee to the database"});
    }
});

module.exports = router;