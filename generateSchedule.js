const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite');  // Correct database name

function timeToNumber(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h + m / 60;
}

function isWithin(time, start, end) {
    const t = timeToNumber(time);
    return t >= timeToNumber(start) && t < timeToNumber(end);
}

function getSchedule(callback) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const schedule = {};

    db.serialize(() => {
        db.all(`SELECT *
                FROM employees`, (err, employees) => {
            db.all(`SELECT *
                    FROM availability`, (err, availability) => {
                db.all(`SELECT *
                        FROM store_needs`, (err, storeNeeds) => {
                    if (err) {
                        console.error("Error fetching store_needs:", err);
                        return;
                    }

                    console.log("storeNeeds data:", storeNeeds);  // Debugging line

                    // Check if storeNeeds is empty
                    if (!storeNeeds || storeNeeds.length === 0) {
                        console.error("No store needs data found!");
                        return;
                    }

                    // Continue if we have store needs data
                    for (const day of days) {
                        schedule[day] = {};
                        const dayNeeds = storeNeeds.filter(n => n.day_of_week === day);

                        for (const need of dayNeeds) {
                            const hour = need.hour;
                            schedule[day][hour] = [];

                            const availableEmps = employees.filter(emp => {
                                const empAvail = availability.find(a =>
                                    a.employee_id === emp.id &&
                                    a.day_of_week === day &&
                                    isWithin(hour, a.start_time, a.end_time)
                                );
                                return !!empAvail;
                            });

                            // Fill shifts up to needed_employees
                            for (let i = 0; i < need.needed_employees && i < availableEmps.length; i++) {
                                schedule[day][hour].push(availableEmps[i].name);

                                // Insert shift into schedule_shifts table
                                const employee = availableEmps[i];
                                const shiftDate = `${new Date().getFullYear()}-04-${dayNeeds[0].hour.split(":")[0]}`; // Make shift date based on current year and day/hour
                                db.run(
                                    `INSERT INTO schedule_shifts (employee_id, shift_date, start_time, end_time)
                                     VALUES (?, ?, ?, ?)`,
                                    [employee.id, shiftDate, hour, hour],  // Simplified: using same start and end time for now
                                    function (err) {
                                        if (err) {
                                            console.error('Error inserting shift:', err);
                                        }
                                    }
                                );
                            }
                        }
                    }

                    callback(schedule);
                });
            });
        });
    });
}

getSchedule(schedule => {
    for (const day in schedule) {
        console.log(`\n--- ${day} ---`);
        for (const hour in schedule[day]) {
            console.log(`${hour}: ${schedule[day][hour].join(', ') || 'Unfilled'}`);
        }
    }
    db.close();
});
