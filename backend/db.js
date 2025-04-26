const {format} = require("node:util");
const sqlite3 = require('sqlite3').verbose();

// Do not change this name. The 'cs208_project.sqlite' will be created in the same folder as db.js
const SQLITE_FILE_NAME = "./db.sqlite";

let db;

// Create a connection to the SQLite database file specified in SQLITE_FILE_NAME
db = new sqlite3.Database("./" + SQLITE_FILE_NAME, function(err)
{
    if (err)
    {
        return console.error(err.message);
    }

    // Enable enforcement of foreign keys constraints in the SQLite database every time we start the application
    db.get("PRAGMA foreign_keys = ON;");

    console.log(`Connected to the '${SQLITE_FILE_NAME}' SQLite database for development.`);
});


function printTableHeader(listOfColumnNames)
{
    let buffer = "| ";
    for (const columnName of listOfColumnNames)
    {
        buffer += columnName + " | ";
    }
    console.log(buffer);
    console.log("-".repeat(80));
}


function getAllEmployees()
{
    return new Promise(function(resolve, reject)
    {
        db.serialize(function()
        {
            const sql =
                `SELECT id, name, role
                 FROM employees;`;

            let listOfEmployees = [];

            printTableHeader(["id", "name", "role"]);

            const callbackToProcessEachRow = function(err, row)
            {
                if (err)
                {
                    reject(err);
                }

                // extract the values from the current row
                const id = row.id;
                const name = row.name;
                const role = row.role;

                // print the results of the current row
                console.log(format("| %d | %s | %s |", id, name, role));

                const employeeForCurrentRow = {
                    id: id,
                    name: name,
                    role: role
                };

                listOfEmployees.push(employeeForCurrentRow);
            };

            const callbackAfterAllRowsAreProcessed = function()
            {
                resolve(listOfEmployees);
            };

            db.each(sql, callbackToProcessEachRow, callbackAfterAllRowsAreProcessed);
        });
    });
}

function getEmployee(id) {
    return new Promise(function (resolve, reject) {
        const sql = `SELECT * FROM employees WHERE id = ?;`;

        db.get(sql, [id], function (err, row) {
            if (err) {
                reject(err);
            } else if (!row){
                resolve({success: false, message: `No employee found with id: ${id}`});
            } else {
                resolve({success: true, employee: row});
            }
        });
    });
}

function createNewEmployee(createdEmployee){
    return new Promise(function (resolve, reject) {
        const sql = `
          INSERT INTO employees (name, role)
          VALUES (?, ?);
      `;

        const {
            name,
            role
        } = createdEmployee;

        db.run(sql, [name, role], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    name,
                    role
                });
            }
        });
    });
}

function deleteEmployeeById(id) {
    return new Promise(function (resolve, reject) {
        const sql = `DELETE
                     FROM employees
                     WHERE id = ?;`;

        db.run(sql, [id], function (err) {
            if (err) {
                reject(err);
            } else if (this.changes === 0) {
                // No rows deleted — ID not found
                resolve({success: false, message: `No employee found with id: ${id}`});
            } else {
                resolve({success: true, message: `Employee ${id} deleted.`});
            }
        });
    });
}

function updateEmployee(employeeToUpdate) {
    return new Promise(function (resolve, reject) {
        const { id, name, role } = employeeToUpdate;

        if (!id) {
            return reject(new Error("Missing required fields"));
        }

        const sql = `
            UPDATE employees
            SET name = ?, role = ?
            WHERE id = ?;
        `;

        db.run(sql, [name, role, id], function (err) {
            if (err) {
                reject(err);
            } else if (this.changes === 0) {
                resolve({ success: false, message: `No employee found with id: ${id}` });
            } else {
                resolve({ success: true, message: `Employee ${id} updated.` });
            }
        });
    });
}

function getEmployeeAvailability(employee_id)
{
    return new Promise(function(resolve, reject)
    {
        db.serialize(function()
        {
            const sql =
                `SELECT day_of_week, start_time, end_time
                 FROM availability
                 WHERE employee_id = ${employee_id};`;

            let availability = [];

            printTableHeader(["day_of_week", "start_time, end_time"]);

            const callbackToProcessEachRow = function(err, row)
            {
                if (err)
                {
                    reject(err);
                }

                // extract the values from the current row
                const day_of_week = row.day_of_week;
                const start_time = row.start_time;
                const end_time = row.end_time;

                // print the results of the current row
                console.log(format("| %s | %s | %s |", day_of_week, start_time, end_time));

                const availabilityForCurrentRow = {
                    day_of_week: day_of_week,
                    start_time: start_time,
                    end_time: end_time
                };

                availability.push(availabilityForCurrentRow);
            };

            const callbackAfterAllRowsAreProcessed = function()
            {
                resolve(availability);
            };

            db.each(sql, callbackToProcessEachRow, callbackAfterAllRowsAreProcessed);
        });
    });
}

function getShifts()
{
    return new Promise(function(resolve, reject)
    {
        db.serialize(function()
        {
            const sql =
                `SELECT id, employee_id, shift_date, start_time, end_time
                 FROM shifts;`;

            let listOfShifts = [];

            printTableHeader(["id", "employee_id", "shift_date", "start_time", "end_time"]);

            const callbackToProcessEachRow = function(err, row)
            {
                if (err)
                {
                    reject(err);
                }

                // extract the values from the current row
                const id = row.id;
                const employee_id = row.employee_id;
                const shift_date = row.shift_date;
                const start_time = row.start_time;
                const end_time = row.end_time;

                // print the results of the current row
                console.log(format("| %d | %s | %s | %s | %s |", id, employee_id, shift_date, start_time, end_time));

                const shiftForCurrentRow = {
                    id: id,
                    employee_id: employee_id,
                    shift_date: shift_date,
                    start_time: start_time,
                    end_time: end_time
                };

                listOfShifts.push(shiftForCurrentRow);
            };

            const callbackAfterAllRowsAreProcessed = function()
            {
                resolve(listOfShifts);
            };

            db.each(sql, callbackToProcessEachRow, callbackAfterAllRowsAreProcessed);
        });
    });
}

function getStoreNeeds()
{
    return new Promise(function(resolve, reject)
    {
        db.serialize(function()
        {
            const sql =
                `SELECT id, day_of_week, hour, needed_employees
                 FROM store_needs;`;

            let storeNeeds = [];

            printTableHeader(["id", "day_of_week", "hour", "needed_employees"]);

            const callbackToProcessEachRow = function(err, row)
            {
                if (err)
                {
                    reject(err);
                }

                // extract the values from the current row
                const id = row.id;
                const day_of_week = row.day_of_week;
                const hour = row.hour;
                const needed_employees = row.needed_employees;

                // print the results of the current row
                console.log(format("| %d | %s | %s | %s |", id, day_of_week, hour, needed_employees));

                const storeNeedsForCurrentRow = {
                    id: id,
                    day_of_week: day_of_week,
                    hour: hour,
                    needed_employees: needed_employees
                };

                storeNeeds.push(storeNeedsForCurrentRow);
            };

            const callbackAfterAllRowsAreProcessed = function()
            {
                resolve(storeNeeds);
            };

            db.each(sql, callbackToProcessEachRow, callbackAfterAllRowsAreProcessed);
        });
    });
}
function addEmployeeAvailability(availability) {
    return new Promise(function(resolve, reject) {
        const sql = `
            INSERT INTO availability (employee_id, day_of_week, start_time, end_time)
            VALUES (?, ?, ?, ?);
        `;

        const {
            employee_id,
            day_of_week,
            start_time,
            end_time
        } = availability;

        // Validate input
        if (!employee_id || !day_of_week || !start_time || !end_time) {
            reject(new Error("Missing required fields for availability"));
            return;
        }

        // Validate day_of_week is one of the allowed values
        const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        if (!validDays.includes(day_of_week)) {
            reject(new Error(`Invalid day_of_week. Must be one of: ${validDays.join(', ')}`));
            return;
        }

        // Validate time format (HH:MM)
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
            reject(new Error("Invalid time format. Must be in HH:MM format"));
            return;
        }

        db.run(sql, [employee_id, day_of_week, start_time, end_time], function(err) {
            if (err) {
                console.error("Error in addEmployeeAvailability:", err.message);
                reject(err);
            } else {
                // Return the created availability with its ID
                resolve({
                    id: this.lastID,
                    employee_id,
                    day_of_week,
                    start_time,
                    end_time
                });
            }
        });
    });
}

// these functions will be available from other files that import this module
module.exports = {
    getAllEmployees,
    getEmployee,
    createNewEmployee,
    updateEmployee,
    deleteEmployeeById,
    getEmployeeAvailability,
    addEmployeeAvailability,
    getShifts,
    getStoreNeeds
};