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
    ],
  });

  // ── Time Entry (attached to the non-deletable shift) ───────────────────────
  await prisma.time_entry.create({
    data: {
      id: "ctime0000000000000000entry1",
      user_id: "ctest000000requester0000001",
      shift_id: "cshift000000000000000has01x",
      clock_in: new Date("2025-09-03T09:00:00Z"),
      clock_out: new Date("2025-09-03T17:00:00Z"),
      type: "WORK",
    },
  });

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
