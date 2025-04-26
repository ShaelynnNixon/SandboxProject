INSERT INTO employees (name, role) VALUES
                                       ('Alice Johnson', 'Barista'),
                                       ('Bob Smith', 'Shift Lead'),
                                       ('Charlie Evans', 'Barista');

-- Insert availability
INSERT INTO availability (employee_id, day_of_week, start_time, end_time) VALUES
                                                                              (1, 'Monday', '09:00', '13:00'),
                                                                              (1, 'Tuesday', '10:00', '14:00'),
                                                                              (2, 'Monday', '10:00', '15:00'),
                                                                              (2, 'Wednesday', '09:00', '12:00'),
                                                                              (3, 'Monday', '08:00', '11:00'),
                                                                              (3, 'Tuesday', '12:00', '16:00');

-- Insert store needs
INSERT INTO store_needs (day_of_week, hour, needed_employees) VALUES
                                                                  ('Monday', '09:00', 1),
                                                                  ('Monday', '10:00', 2),
                                                                  ('Monday', '11:00', 2),
                                                                  ('Monday', '12:00', 1),
                                                                  ('Tuesday', '10:00', 2),
                                                                  ('Tuesday', '11:00', 1),
                                                                  ('Tuesday', '12:00', 2),
                                                                  ('Tuesday', '13:00', 1);

-- Insert some example shifts
INSERT INTO shifts (employee_id, shift_date, start_time, end_time) VALUES
                                                                       (1, '2025-04-28', '09:00', '12:00'),
                                                                       (2, '2025-04-28', '10:00', '13:00'),
                                                                       (3, '2025-04-28', '08:00', '11:00');