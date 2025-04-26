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

// these functions will be available from other files that import this module
module.exports = {
    getAllEmployees,
    createNewEmployee
};