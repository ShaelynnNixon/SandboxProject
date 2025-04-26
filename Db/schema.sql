DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS availability;
DROP TABLE IF EXISTS store_needs;
DROP TABLE IF EXISTS shifts;
DROP TABLE IF EXISTS schedule_shifts;
DROP TABLE IF EXISTS historical_schedules;

CREATE TABLE employees
(
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT
);

-- Weekly availability per employee
CREATE TABLE availability
(
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    day_of_week TEXT CHECK (day_of_week IN (
                                            'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
        )),
    start_time  TEXT    NOT NULL, -- Format: 'HH:MM'
    end_time    TEXT    NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees (id)
);

-- Weekly recurring store needs
CREATE TABLE store_needs
(
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    day_of_week      TEXT CHECK (day_of_week IN (
                                                 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
                                                 'Sunday'
        )),
    hour             TEXT    NOT NULL, -- Format: 'HH:MM'
    needed_employees INTEGER NOT NULL
);

-- Concrete shift assignments (by date)
CREATE TABLE shifts
(
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    shift_date  TEXT    NOT NULL, -- Format: 'YYYY-MM-DD'
    start_time  TEXT    NOT NULL,
    end_time    TEXT    NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees (id)
);

CREATE TABLE schedule_shifts
(
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    shift_date  TEXT    NOT NULL, -- Format: 'YYYY-MM-DD'
    start_time  TEXT    NOT NULL,
    end_time    TEXT    NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees (id)
);

CREATE TABLE historical_schedules
(
    id                    INTEGER PRIMARY KEY AUTOINCREMENT,
    date                  TEXT    NOT NULL, -- Format: 'YYYY-MM-DD'
    shift_start           TEXT    NOT NULL, -- Format: 'HH:MM'
    shift_end             TEXT    NOT NULL, -- Format: 'HH:MM'
    employee_id           INTEGER NOT NULL,
    employee_availability TEXT,             -- JSON string, can be NULL
    employee_role         TEXT    NOT NULL,
    total_hours_assigned  INTEGER NOT NULL,
    business_need_role    TEXT    NOT NULL,
    business_need_count   INTEGER NOT NULL,
    was_scheduled         INTEGER NOT NULL, -- 1 for scheduled, 0 for not scheduled
    FOREIGN KEY (employee_id) REFERENCES employees (id)
);