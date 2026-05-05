import { prisma } from "../lib/prisma";

async function main() {
  console.log("Resetting DB...");

  // Delete in dependency order (children before parents)
  await prisma.time_entry_edit.deleteMany();
  await prisma.time_entry.deleteMany();
  await prisma.shift.deleteMany();
  await prisma.leave_request.deleteMany();
  await prisma.leave_balance.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.session.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();
  await prisma.location.deleteMany();

  console.log("Seeding test data...");

  await prisma.location.create({
    data: {
      id: "250387",
      street: "123 Main Street",
      city: "Everett",
      state: "WA",
      zip_code: "98208",
    },
  });

  // ── Users ──────────────────────────────────────────────────────────────────
  await prisma.user.createMany({
    data: [
      {
        id: "ctest000000requester0000001",
        email: "requester@test.com",
        first_name: "John",
        last_name: "Doe",
        phone: "+12223334444",
        address: "123 Main St",
        position: "Engineer",
        role: "EMPLOYEE",
        employment_type: "FULL_TIME",
        status: "ACTIVE",
        hourly_rate: 20.0,
        location_id: "250387",
      },
      {
        id: "ctest000000approver0000001x",
        email: "approver@test.com",
        first_name: "Jane",
        last_name: "Smith",
        phone: "+15556667777",
        address: "456 Other St",
        position: "Manager",
        role: "MANAGER",
        employment_type: "FULL_TIME",
        status: "ACTIVE",
        hourly_rate: 30.0,
        location_id: "250387",
      },
      {
        id: "ctest000000clockedin000001x",
        email: "clockedin@test.com",
        first_name: "Sam",
        last_name: "ClockedIn",
        phone: "+13334445555",
        address: "321 Clocked St",
        position: "Engineer",
        role: "EMPLOYEE",
        employment_type: "FULL_TIME",
        status: "ACTIVE",
        hourly_rate: 20.0,
        location_id: "250387",
      },
      {
        // Dedicated user for absent entry — avoids one_active_time_entry_per_user conflict
        id: "ctest000000absent00000001x",
        email: "absent@test.com",
        first_name: "Bob",
        last_name: "Absent",
        phone: "+19998887777",
        address: "789 Absent St",
        position: "Engineer",
        role: "EMPLOYEE",
        employment_type: "FULL_TIME",
        status: "ACTIVE",
        hourly_rate: 20.0,
        location_id: "250387",
      },
    ],
  });

  // ── Leave Balances ─────────────────────────────────────────────────────────
  await prisma.leave_balance.createMany({
    data: [
      {
        id: "ctest000000balance000000001",
        user_id: "ctest000000requester0000001",
        type: "VACATION",
        total: 80,
        used: 32,
      },
      {
        id: "ctest000000balance000000002",
        user_id: "ctest000000requester0000001",
        type: "SICK_LEAVE",
        total: 40,
        used: 8,
      },
    ],
  });

  // ── Leave Requests ─────────────────────────────────────────────────────────
  await prisma.leave_request.createMany({
    data: [
      {
        id: "creq0000000vacation00pending",
        requester_id: "ctest000000requester0000001",
        location_id: "250387",
        type: "VACATION",
        start_date: new Date("2025-06-01T00:00:00Z"),
        end_date: new Date("2025-06-05T00:00:00Z"),
        hours: 16,
        reason: "Family trip",
        status: "PENDING",
        status_priority: 1,
      },
      {
        id: "creq0000000sickleav0pending",
        requester_id: "ctest000000requester0000001",
        location_id: "250387",
        type: "SICK_LEAVE",
        start_date: new Date("2025-06-10T00:00:00Z"),
        end_date: new Date("2025-06-11T00:00:00Z"),
        hours: 8,
        reason: "Not feeling well",
        status: "PENDING",
        status_priority: 1,
      },
      {
        id: "creq0000000vacation0approved",
        requester_id: "ctest000000requester0000001",
        location_id: "250387",
        type: "VACATION",
        start_date: new Date("2025-07-01T00:00:00Z"),
        end_date: new Date("2025-07-03T00:00:00Z"),
        hours: 16,
        reason: "Already approved trip",
        status: "APPROVED",
        status_priority: 2,
      },
      {
        id: "creq0000000vacation0rejected",
        requester_id: "ctest000000requester0000001",
        location_id: "250387",
        type: "VACATION",
        start_date: new Date("2025-08-01T00:00:00Z"),
        end_date: new Date("2025-08-03T00:00:00Z"),
        hours: 16,
        reason: "Already rejected trip",
        status: "REJECTED",
        status_priority: 3,
      },
    ],
  });

  // ── Shifts ─────────────────────────────────────────────────────────────────
  await prisma.shift.createMany({
    data: [
      // ── Schedule tests ──────────────────────────────────────────────────────
      {
        id: "cshift000000000000000edit01",
        user_id: "ctest000000requester0000001",
        location_id: "250387",
        start_time: new Date("2025-09-01T09:00:00Z"),
        end_time: new Date("2025-09-01T17:00:00Z"),
        notes: "Seeded for edit test",
      },
      {
        id: "cshift000000000000000del01x",
        user_id: "ctest000000requester0000001",
        location_id: "250387",
        start_time: new Date("2025-09-02T09:00:00Z"),
        end_time: new Date("2025-09-02T17:00:00Z"),
        notes: "Seeded for delete test",
      },
      {
        id: "cshift000000000000000has01x",
        user_id: "ctest000000requester0000001",
        location_id: "250387",
        start_time: new Date("2025-09-03T09:00:00Z"),
        end_time: new Date("2025-09-03T17:00:00Z"),
        notes: "Has time entry - cannot delete",
      },
      // ── Clock in/out tests ──────────────────────────────────────────────────
      {
        // Clean shift — no time entry, used for clock in happy path
        id: "cshift00000000000clockin001",
        user_id: "ctest000000requester0000001",
        location_id: "250387",
        start_time: new Date("2025-10-01T09:00:00Z"),
        end_time: new Date("2025-10-01T17:00:00Z"),
        notes: "Clock in happy path",
      },
      {
        // Has WORK entry with clock_in only — for "already clocked in" + clock out tests
        id: "cshift0000000000clockin002x",
        user_id: "ctest000000clockedin000001x",
        location_id: "250387",
        start_time: new Date("2025-10-02T09:00:00Z"),
        end_time: new Date("2025-10-02T17:00:00Z"),
        notes: "Clock in002 - already has entry",
      },
      {
        // Belongs to absent user — has ABSENT entry
        id: "cshift0000000000clockin003x",
        user_id: "ctest000000absent00000001x",
        location_id: "250387",
        start_time: new Date("2025-10-03T09:00:00Z"),
        end_time: new Date("2025-10-03T17:00:00Z"),
        notes: "Clock in003 - absent entry",
      },
      // ── Edit time entry tests ───────────────────────────────────────────────
      {
        // Has an existing WORK entry — for edit happy path
        id: "cshift00000000000edittime01",
        user_id: "ctest000000requester0000001",
        location_id: "250387",
        start_time: new Date("2025-10-04T09:00:00Z"),
        end_time: new Date("2025-10-04T17:00:00Z"),
        notes: "Edit time entry - has entry",
      },
      {
        // No time entry — edit creates a new one
        id: "cshift00000000000edittime02",
        user_id: "ctest000000requester0000001",
        location_id: "250387",
        start_time: new Date("2025-10-05T09:00:00Z"),
        end_time: new Date("2025-10-05T17:00:00Z"),
        notes: "Edit time entry - no entry",
      },
    ],
  });

  // ── Time Entries ───────────────────────────────────────────────────────────
  // Each user can only have one active (clock_out = null) entry at a time
  // due to the one_active_time_entry_per_user unique index.
  await prisma.time_entry.createMany({
    data: [
      // requester — has01x: fully clocked out, not active
      {
        id: "ctime0000000000000000entry1",
        user_id: "ctest000000requester0000001",
        shift_id: "cshift000000000000000has01x",
        clock_in: new Date("2025-09-03T09:00:00Z"),
        clock_out: new Date("2025-09-03T17:00:00Z"),
        type: "WORK",
      },
      // requester — edittime01: fully clocked out, not active
      {
        id: "ctime000000000000edit00001",
        user_id: "ctest000000requester0000001",
        shift_id: "cshift00000000000edittime01",
        clock_in: new Date("2025-10-04T09:00:00Z"),
        clock_out: new Date("2025-10-04T17:00:00Z"),
        type: "WORK",
      },
      // requester — clockin002x: clock_in set, no clock_out (one active entry)
      {
        id: "ctime000000000000clkin0001",
        user_id: "ctest000000clockedin000001x",
        shift_id: "cshift0000000000clockin002x",
        clock_in: new Date("2025-10-02T09:00:00Z"),
        type: "WORK",
      },
      // absent user — clockin003x: ABSENT, no clock_in or clock_out (one active entry)
      {
        id: "ctime000000000000absent001",
        user_id: "ctest000000absent00000001x",
        shift_id: "cshift0000000000clockin003x",
        type: "ABSENT",
      },
    ],
  });

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
