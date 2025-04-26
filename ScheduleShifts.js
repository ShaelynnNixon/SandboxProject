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
        Monday: ["09:00", "10:00"],
        Tuesday: ["10:00"]
    },
    Bob: {
        Monday: ["10:00"],
        Tuesday: ["10:00", "11:00"]
    },
    Charlie: {
        Monday: ["09:00", "11:00"],
        Tuesday: ["11:00"]
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
