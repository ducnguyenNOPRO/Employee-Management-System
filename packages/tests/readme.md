Run these query in DB for seeded
## For /leaves
INSERT INTO "user" (id, email, first_name, last_name, phone, address, position, role, employment_type, status, hourly_rate, location_id)
VALUES (
  'ctest000000requester0000001',
  'requester@test.com',
  'John', 'Doe',
  '+12223334444',
  '123 Main St',
  'Engineer',
  'EMPLOYEE',
  'FULL_TIME',
  'ACTIVE',
  20.00,
  '250837'
);

-- 3. Approver
INSERT INTO "user" (id, email, first_name, last_name, phone, address, position, role, employment_type, status, hourly_rate, location_id)
VALUES (
  'ctest000000approver0000001x',
  'approver@test.com',
  'Jane', 'Smith',
  '+15556667777',
  '456 Other St',
  'Manager',
  'MANAGER',
  'FULL_TIME',
  'ACTIVE',
  30.00,
  '250837'
);

-- 4. Leave balances (one per type)
INSERT INTO leave_balance (id, user_id, type, total, used)
VALUES
  ('ctest000000balance000000001', 'ctest000000requester0000001', 'VACATION', 80, 32),
  ('ctest000000balance000000002', 'ctest000000requester0000001', 'SICK_LEAVE', 40, 8);

  -- PENDING VACATION (happy path approve/reject)
INSERT INTO leave_request (id, requester_id, location_id, type, start_date, end_date, hours, reason, status, status_priority, created_at, updated_at)
VALUES (
  'creq0000000vacation00pending',
  'ctest000000requester0000001',
  '250387',
  'VACATION',
  '2025-06-01 00:00:00',
  '2025-06-05 00:00:00',
  16,
  'Family trip',
  'PENDING',
  1,
  NOW(),
  NOW()
);

-- PENDING SICK_LEAVE (burn for 409 test)
INSERT INTO leave_request (id, requester_id, location_id, type, start_date, end_date, hours, reason, status, status_priority, created_at, updated_at)
VALUES (
  'creq0000000sickleav0pending',
  'ctest000000requester0000001',
  '250387',
  'SICK_LEAVE',
  '2025-06-10 00:00:00',
  '2025-06-11 00:00:00',
  8,
  'Not feeling well',
  'PENDING',
  1,
  NOW(),
  NOW()
);

-- APPROVED (for 409 test)
INSERT INTO leave_request (id, requester_id, location_id, type, start_date, end_date, hours, reason, status, status_priority, created_at, updated_at)
VALUES (
  'creq0000000vacation0approved',
  'ctest000000requester0000001',
  '250387',
  'VACATION',
  '2025-07-01 00:00:00',
  '2025-07-03 00:00:00',
  16,
  'Already approved trip',
  'APPROVED',
  2,
  NOW(),
  NOW()
);

-- REJECTED (for 409 test)
INSERT INTO leave_request (id, requester_id, location_id, type, start_date, end_date, hours, reason, status, status_priority, created_at, updated_at)
VALUES (
  'creq0000000vacation0rejected',
  'ctest000000requester0000001',
  '250387',
  'VACATION',
  '2025-08-01 00:00:00',
  '2025-08-03 00:00:00',
  16,
  'Already rejected trip',
  'REJECTED',
  3,
  NOW(),
  NOW()
);

## For /schedules
-- Shift to EDIT in tests
INSERT INTO shift (id, user_id, location_id, start_time, end_time, notes, created_at, updated_at)
VALUES (
  'cshift000000000000000edit01',
  'ctest000000requester0000001',
  '250387',
  '2025-09-01 09:00:00',
  '2025-09-01 17:00:00',
  'Seeded for edit test',
  NOW(),
  NOW()
);

-- Shift to DELETE in tests (no time_entries so it can be deleted)
INSERT INTO shift (id, user_id, location_id, start_time, end_time, notes, created_at, updated_at)
VALUES (
  'cshift000000000000000del01x',
  'ctest000000requester0000001',
  '250387',
  '2025-09-02 09:00:00',
  '2025-09-02 17:00:00',
  'Seeded for delete test',
  NOW(),
  NOW()
);

-- Shift that has a time entry (cannot be deleted)
INSERT INTO shift (id, user_id, location_id, start_time, end_time, notes, created_at, updated_at)
VALUES (
  'cshift000000000000000has01x',
  'ctest000000requester0000001',
  '250387',
  '2025-09-03 09:00:00',
  '2025-09-03 17:00:00',
  'Has time entry - cannot delete',
  NOW(),
  NOW()
);

-- Time entry attached to it
INSERT INTO time_entry (id, user_id, shift_id, clock_in, clock_out, type, created_at, updated_at)
VALUES (
  'ctime0000000000000000entry1',
  'ctest000000requester0000001',
  'cshift000000000000000has01x',
  '2025-09-03 09:00:00',
  '2025-09-03 17:00:00',
  'WORK',
  NOW(),
  NOW()
);