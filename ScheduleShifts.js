function scheduleWeeklyShifts(employees, storeNeeds) {
    const schedule = {};

    for (const day in storeNeeds) {
        schedule[day] = {};
        const needs = storeNeeds[day];

        for (const hour in needs) {
            schedule[day][hour] = [];
        }

        const filled = {};
        for (const hour in needs) {
            filled[hour] = 0;
        }

        for (const employee in employees) {
            const availability = employees[employee][day] || [];

            for (const hour of availability) {
                if (needs[hour] !== undefined && filled[hour] < needs[hour]) {
                    schedule[day][hour].push(employee);
                    filled[hour]++;

                    break; // one shift per day per employee (optional)
                }
            }
        }
    }

    return schedule;
}

// THIS WILL BE REPLACED WITH DATA FROM EMPLOYEE TABLE
const employees = {
    Alice: {
        Monday: { start: "09:00", end: "13:00" },
        Tuesday: { start: "10:00", end: "14:00" }
    },
    Bob: {
        Monday: { start: "10:00", end: "15:00" },
        Wednesday: { start: "09:00", end: "12:00" }
    },
    Charlie: {
        Monday: { start: "08:00", end: "11:00" },
        Tuesday: { start: "12:00", end: "16:00" }
    }
};

//THIS WILL BE REPLACED WITH STORE DATA FROM DATABASE
const storeNeeds = {
    Monday: {
        "09:00": 1,
        "10:00": 2,
        "11:00": 1
    },
    Tuesday: {
        "10:00": 2,
        "11:00": 2
    }
};

// Run it
const weeklySchedule = scheduleWeeklyShifts(employees, storeNeeds);

// Display
for (const day in weeklySchedule) {
    console.log(`\n--- ${day} ---`);
    for (const hour in weeklySchedule[day]) {
        console.log(`${hour}: ${weeklySchedule[day][hour].join(", ")}`);
    }
}
