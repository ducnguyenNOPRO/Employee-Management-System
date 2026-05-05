import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

// ─── Seeded IDs ───────────────────────────────────────────────────────────────
const USER_ID = "ctest000000requester0000001";
const OTHER_USER_ID = "ctest000000approver0000001x";
const ABSENT_USER_ID = "ctest000000absent00000001x"; // owns the absent shift
const CLOCKED_IN_USER_ID = "ctest000000clockedin000001x";

// Clock in/out shifts
const CLEAN_SHIFT_ID = "cshift00000000000clockin001"; // no entry — clock in happy path
const CLOCKED_IN_SHIFT_ID = "cshift0000000000clockin002x"; // WORK entry, clock_in set, no clock_out
const ABSENT_SHIFT_ID = "cshift0000000000clockin003x"; // ABSENT entry, owned by ABSENT_USER_ID

// Edit time entry shifts
const EDIT_ENTRY_SHIFT_ID = "cshift00000000000edittime01"; // full WORK entry
const NO_ENTRY_SHIFT_ID = "cshift00000000000edittime02"; // no entry

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function clockIn(request: any, body: Record<string, unknown>) {
  return request.post(`${BASE_URL}/api/admin/attendance/clock-in`, {
    data: body,
  });
}

async function clockOut(request: any, body: Record<string, unknown>) {
  return request.post(`${BASE_URL}/api/admin/attendance/clock-out`, {
    data: body,
  });
}

async function editTimeEntry(
  request: any,
  userId: string,
  body: Record<string, unknown>
) {
  return request.patch(`${BASE_URL}/api/admin/attendance/${userId}`, {
    data: body,
  });
}

async function deleteTimeEntry(request: any, shift_id: string) {
  return request.delete(`${BASE_URL}/api/test/time-entry`, {
    params: { shift_id },
  });
}

async function resetTimeEntry(
  request: any,
  shift_id: string,
  data: Record<string, unknown>
) {
  return request.patch(`${BASE_URL}/api/test/time-entry`, {
    params: { shift_id },
    data,
  });
}

// ─── Valid base bodies ────────────────────────────────────────────────────────
const validClockInBody = {
  shift_id: CLEAN_SHIFT_ID,
  user_id: USER_ID,
  time: "09:00",
};

const validClockOutBody = {
  shift_id: CLOCKED_IN_SHIFT_ID,
  user_id: CLOCKED_IN_USER_ID,
  time: "17:00",
};

const validEditBody = {
  shift_id: EDIT_ENTRY_SHIFT_ID,
  clock_in: "09:00",
  clock_out: "17:00",
  reason: "Manual correction",
};

// ─── POST clock-in ────────────────────────────────────────────────────────────
test.describe("POST /api/admin/attendance/clock-in", () => {
  // ── Happy paths ──────────────────────────────────────────────────────────────
  test.describe("201 - clock in on clean shift", () => {
    test.afterEach(async ({ request }) => {
      await deleteTimeEntry(request, CLEAN_SHIFT_ID);
    });

    test("creates a new time entry and returns 201", async ({ request }) => {
      const res = await clockIn(request, validClockInBody);

      expect(res.status()).toBe(201);
      const body = await res.json();
      expect(body.message).toBe("Clock in successfully");
    });
  });

  test.describe("200 - clock in over an absent entry", () => {
    test.afterEach(async ({ request }) => {
      await resetTimeEntry(request, ABSENT_SHIFT_ID, {
        type: "ABSENT",
        clock_in: null,
        clock_out: null,
      });
    });

    test("updates ABSENT entry to WORK and returns 200", async ({
      request,
    }) => {
      const res = await clockIn(request, {
        shift_id: ABSENT_SHIFT_ID,
        user_id: ABSENT_USER_ID,
        time: "09:00",
      });

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.message).toBe("Clock in successfully");
    });
  });

  // ── Validation errors (400) ──────────────────────────────────────────────────
  test("400 - missing shift_id", async ({ request }) => {
    const { shift_id, ...body } = validClockInBody;
    const res = await clockIn(request, body);
    expect(res.status()).toBe(400);
  });

  test("400 - invalid shift_id (not a cuid)", async ({ request }) => {
    const res = await clockIn(request, {
      ...validClockInBody,
      shift_id: "not-a-cuid",
    });
    expect(res.status()).toBe(400);
  });

  test("400 - missing user_id", async ({ request }) => {
    const { user_id, ...body } = validClockInBody;
    const res = await clockIn(request, body);
    expect(res.status()).toBe(400);
  });

  test("400 - invalid user_id (not a cuid)", async ({ request }) => {
    const res = await clockIn(request, {
      ...validClockInBody,
      user_id: "not-a-cuid",
    });
    expect(res.status()).toBe(400);
  });

  test("400 - missing time", async ({ request }) => {
    const { time, ...body } = validClockInBody;
    const res = await clockIn(request, body);
    expect(res.status()).toBe(400);
  });

  test("400 - invalid time format", async ({ request }) => {
    const res = await clockIn(request, { ...validClockInBody, time: "9:00am" });
    expect(res.status()).toBe(400);
  });

  // ── Business logic errors ────────────────────────────────────────────────────
  test("404 - shift not found", async ({ request }) => {
    const res = await clockIn(request, {
      ...validClockInBody,
      shift_id: "cnonexistent0shift00000001",
    });
    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body.message).toBe("Shift not found");
  });

  test("400 - user is not assigned to this shift", async ({ request }) => {
    const res = await clockIn(request, {
      ...validClockInBody,
      user_id: OTHER_USER_ID,
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toBe("User is not assigned to this shift");
  });

  test("400 - too early to clock in (>2h before shift start)", async ({
    request,
  }) => {
    // shift starts 09:00, 2h tolerance = earliest allowed 07:00
    const res = await clockIn(request, { ...validClockInBody, time: "06:59" });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toBe("Too early to clock in");
  });

  test("400 - already clocked in", async ({ request }) => {
    const res = await clockIn(request, {
      ...validClockInBody,
      user_id: CLOCKED_IN_USER_ID,
      shift_id: CLOCKED_IN_SHIFT_ID,
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toBe("Already clocked in");
  });
});

// ─── POST clock-out ───────────────────────────────────────────────────────────
test.describe("POST /api/admin/attendance/clock-out", () => {
  // ── Happy path ───────────────────────────────────────────────────────────────
  test.describe("200 - clock out successfully", () => {
    test.afterEach(async ({ request }) => {
      await resetTimeEntry(request, CLOCKED_IN_SHIFT_ID, {
        clock_out: null,
      });
    });

    test("sets clock_out and returns 200", async ({ request }) => {
      const res = await clockOut(request, validClockOutBody);

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.message).toBe("Clock out succesfully");
    });
  });

  // ── Validation errors (400) ──────────────────────────────────────────────────
  test("400 - missing shift_id", async ({ request }) => {
    const { shift_id, ...body } = validClockOutBody;
    const res = await clockOut(request, body);
    expect(res.status()).toBe(400);
  });

  test("400 - invalid time format", async ({ request }) => {
    const res = await clockOut(request, { ...validClockOutBody, time: "5pm" });
    expect(res.status()).toBe(400);
  });

  // ── Business logic errors ────────────────────────────────────────────────────
  test("404 - shift not found", async ({ request }) => {
    const res = await clockOut(request, {
      ...validClockOutBody,
      shift_id: "cnonexistent0shift00000001",
    });
    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body.message).toBe("Shift not found");
  });

  test("400 - user is not assigned to this shift", async ({ request }) => {
    const res = await clockOut(request, {
      ...validClockOutBody,
      user_id: OTHER_USER_ID,
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toBe("Employee is not assigned to this shift");
  });

  test("400 - too late to clock out (>2h after shift end)", async ({
    request,
  }) => {
    // shift ends 17:00, 2h tolerance = latest allowed 19:00
    const res = await clockOut(request, {
      ...validClockOutBody,
      time: "19:01",
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toBe("Too late to clock out");
  });

  test("404 - no time entry found (never clocked in)", async ({ request }) => {
    const res = await clockOut(request, {
      ...validClockOutBody,
      shift_id: CLEAN_SHIFT_ID,
      user_id: USER_ID,
    });
    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body.message).toBe(
      "No time entry record found. Pleaase clock in first"
    );
  });

  test("400 - cannot clock out while absent", async ({ request }) => {
    const res = await clockOut(request, {
      shift_id: ABSENT_SHIFT_ID,
      user_id: ABSENT_USER_ID,
      time: "17:00",
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toBe(
      "Cannot clock out while absent. Please clock in first"
    );
  });

  test("400 - already clocked out", async ({ request }) => {
    // has01x entry has both clock_in and clock_out set
    const res = await clockOut(request, {
      shift_id: "cshift000000000000000has01x",
      user_id: USER_ID,
      time: "17:00",
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toBe("Already clocked out");
  });

  test("400 - clock out time must be after clock in time", async ({
    request,
  }) => {
    // clock_in is 09:00, so 08:59 is before it
    const res = await clockOut(request, {
      ...validClockOutBody,
      time: "08:59",
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toBe(
      "Clock out time must be greater then clock in time"
    );
  });
});

// ─── PATCH /api/admin/attendance/:userId (editTimeEntry) ─────────────────────
test.describe("PATCH /api/admin/attendance/:userId", () => {
  // ── Happy paths ──────────────────────────────────────────────────────────────
  test.describe("200 - edits an existing time entry", () => {
    test.afterEach(async ({ request }) => {
      await resetTimeEntry(request, EDIT_ENTRY_SHIFT_ID, {
        clock_in: new Date("2025-10-04T09:00:00.000Z"),
        clock_out: new Date("2025-10-04T17:00:00.000Z"),
        type: "WORK",
      });
    });

    test("updates clock_in and clock_out and returns 200", async ({
      request,
    }) => {
      const res = await editTimeEntry(request, USER_ID, {
        ...validEditBody,
        clock_in: "10:00",
        clock_out: "18:00",
      });

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.message).toBe("Update time entry successfully");
    });
  });

  test.describe("201 - creates a new entry when none exists", () => {
    test.afterEach(async ({ request }) => {
      await deleteTimeEntry(request, NO_ENTRY_SHIFT_ID);
    });

    test("creates time entry and returns 201", async ({ request }) => {
      const res = await editTimeEntry(request, USER_ID, {
        shift_id: NO_ENTRY_SHIFT_ID,
        clock_in: "09:00",
        clock_out: "17:00",
        reason: "Manual entry",
      });

      expect(res.status()).toBe(201);
      const body = await res.json();
      expect(body.message).toBe("New time entry added successfully");
    });
  });

  // ── Validation errors (400) ──────────────────────────────────────────────────
  test("400 - missing shift_id", async ({ request }) => {
    const { shift_id, ...body } = validEditBody;
    const res = await editTimeEntry(request, USER_ID, body);
    expect(res.status()).toBe(400);
  });

  test("400 - missing clock_in", async ({ request }) => {
    const { clock_in, ...body } = validEditBody;
    const res = await editTimeEntry(request, USER_ID, body);
    expect(res.status()).toBe(400);
  });

  test("400 - missing clock_out", async ({ request }) => {
    const { clock_out, ...body } = validEditBody;
    const res = await editTimeEntry(request, USER_ID, body);
    expect(res.status()).toBe(400);
  });

  test("400 - invalid clock_in format", async ({ request }) => {
    const res = await editTimeEntry(request, USER_ID, {
      ...validEditBody,
      clock_in: "9am",
    });
    expect(res.status()).toBe(400);
  });

  test("400 - missing reason", async ({ request }) => {
    const { reason, ...body } = validEditBody;
    const res = await editTimeEntry(request, USER_ID, body);
    expect(res.status()).toBe(400);
  });

  test("400 - reason exceeds 120 characters", async ({ request }) => {
    const res = await editTimeEntry(request, USER_ID, {
      ...validEditBody,
      reason: "a".repeat(121),
    });
    expect(res.status()).toBe(400);
  });

  test("400 - invalid user_id in URL param (not a cuid)", async ({
    request,
  }) => {
    const res = await editTimeEntry(request, "not-a-cuid", validEditBody);
    expect(res.status()).toBe(400);
  });

  // ── Business logic errors ────────────────────────────────────────────────────
  test("404 - shift not found", async ({ request }) => {
    const res = await editTimeEntry(request, USER_ID, {
      ...validEditBody,
      shift_id: "cnonexistent0shift00000001",
    });
    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body.message).toBe("Shift not found");
  });

  test("400 - user is not assigned to this shift", async ({ request }) => {
    const res = await editTimeEntry(request, OTHER_USER_ID, validEditBody);
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toBe("Employee is not assigned to this shift");
  });

  test("400 - clock_in is after clock_out (invalid time range)", async ({
    request,
  }) => {
    const res = await editTimeEntry(request, USER_ID, {
      ...validEditBody,
      clock_in: "17:00",
      clock_out: "09:00",
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toBe("Invalid time range");
  });

  test("400 - clock_in too early (>2h before shift start)", async ({
    request,
  }) => {
    // shift starts 09:00, min allowed 07:00
    const res = await editTimeEntry(request, USER_ID, {
      ...validEditBody,
      clock_in: "06:59",
      clock_out: "17:00",
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toBe("Clock-in too early");
  });

  test("400 - clock_out too late (>2h after shift end)", async ({
    request,
  }) => {
    // shift ends 17:00, max allowed 19:00
    const res = await editTimeEntry(request, USER_ID, {
      ...validEditBody,
      clock_in: "09:00",
      clock_out: "19:01",
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toBe("Clock-out too late");
  });
});
