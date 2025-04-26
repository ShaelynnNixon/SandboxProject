const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite');  // Make sure this matches your actual DB

function timeToNumber(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h + m / 60;
}

function isWithin(time, start, end) {
    const t = timeToNumber(time);
    return t >= timeToNumber(start) && t < timeToNumber(end);
}

function logScheduleData(shift, employee, wasScheduled) {
    const query = `
    INSERT INTO historical_schedules (
      date,
      shift_start,
      shift_end,
      employee_id,
      employee_availability,
      employee_role,
      total_hours_assigned,
      business_need_role,
      business_need_count,
      was_scheduled
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        shift.date,
        shift.startTime,
        shift.endTime,
        employee.id,
        JSON.stringify(employee.availability || {}),
        employee.role || 'N/A',
        employee.totalHoursAssigned || 0,
        shift.requiredRole || 'General',
        shift.requiredCount || 1,
        wasScheduled ? 1 : 0
    ];

    db.run(query, values, function(err) {
        if (err) {
            console.error('Error inserting into historical_schedules:', err);
        }
    });
}

//get schedules
function getSchedule(callback) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const schedule = {};

    db.serialize(() => {
        db.all(`SELECT * FROM employees`, (err, employees) => {
            if (err) return console.error("Error fetching employees:", err);

            db.all(`SELECT * FROM availability`, (err, availability) => {
                if (err) return console.error("Error fetching availability:", err);

                db.all(`SELECT * FROM store_needs`, (err, storeNeeds) => {
                    if (err) return console.error("Error fetching store_needs:", err);

                    // Debug line: optional
                    // console.log("storeNeeds data:", storeNeeds);

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

                            for (let i = 0; i < need.needed_employees && i < availableEmps.length; i++) {
                                const employee = availableEmps[i];
                                schedule[day][hour].push(employee.name);

                                // Optional: clean up date generation if needed
                                const shiftDate = `${new Date().getFullYear()}-04-${String(i + 1).padStart(2, '0')}`;
                                db.run(
                                    `INSERT INTO schedule_shifts (employee_id, shift_date, start_time, end_time)
                                     VALUES (?, ?, ?, ?)`,
                                    [employee.id, shiftDate, hour, hour],
                                    err => {
                                        if (err) console.error('Error inserting shift:', err);
                                    }
                                );

                                availableEmps.slice(need.needed_employees).forEach(employee => {
                                    const shift = {
                                        date: shiftDate,
                                        startTime: hour,
                                        endTime: hour,
                                        requiredRole: need.role || 'General',
                                        requiredCount: need.needed_employees
                                    };
                                    logScheduleData(shift, employee, false);
                                });

                                const shift = {
                                    date: shiftDate,
                                    startTime: hour,
                                    endTime: hour,
                                    requiredRole: need.role || 'General',
                                    requiredCount: need.needed_employees
                                };
                                logScheduleData(shift, employee, true);
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
    console.log("Schedule data:", schedule);  // Debugging line

    for (const day of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']) {
        console.log(`\n--- ${day} ---`);

        if (!schedule[day] || Object.keys(schedule[day]).length === 0) {
            console.log("No shifts scheduled.");
        } else {
            const hours = Object.keys(schedule[day]).sort();
            for (const hour of hours) {
                const employees = schedule[day][hour];
                if (employees && employees.length > 0) {
                    console.log(`${hour}: ${employees.join(', ')}`);
                } else {
                    console.log(`${hour}: Unfilled`);
                }
            }
        }
    }

    db.close();
});

