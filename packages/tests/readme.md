Run these query in DB for seeded
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