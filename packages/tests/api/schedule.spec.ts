import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

// ─── Seeded IDs ───────────────────────────────────────────────────────────────
const USER_ID = "ctest000000requester0000001";
const EDIT_SHIFT_ID = "cshift000000000000000edit01"; // reset via resetShift after edit test
const DELETE_SHIFT_ID = "cshift000000000000000del01x"; // re-seed after delete test
const HAS_ENTRY_SHIFT_ID = "cshift000000000000000has01x"; // has time entry — cannot delete

// ─── Seeded shift data for re-seeding after delete ───────────────────────────
const DELETE_SHIFT_SEED = {
  id: DELETE_SHIFT_ID,
  user_id: USER_ID,
  location_id: "250387",
  start_time: "2025-09-02T09:00:00.000Z",
  end_time: "2025-09-02T17:00:00.000Z",
  notes: "Seeded for delete test",
};

// ─── Original values for resetting edit shift after test ─────────────────────
const EDIT_SHIFT_ORIGINAL = {
  start_time: "2025-09-01T09:00:00.000Z",
  end_time: "2025-09-01T17:00:00.000Z",
  notes: "Seeded for edit test",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function getSchedules(request: any, from: string, to: string) {
  return request.get(`${BASE_URL}/api/admin/schedules`, {
    params: { from, to },
  });
}

async function publishSchedules(request: any, body: Record<string, unknown>) {
  return request.post(`${BASE_URL}/api/admin/schedules`, { data: body });
}

async function resetShift(
  request: any,
  id: string,
  data: Record<string, unknown>
) {
  return request.patch(`${BASE_URL}/api/test/reset-shift/${id}`, { data });
}

async function seedShift(request: any, data: Record<string, unknown>) {
  return request.post(`${BASE_URL}/api/test/seed-shift`, { data });
}

async function deleteShiftByNotes(request: any, notes: string) {
  return request.delete(`${BASE_URL}/api/test/shift`, {
    params: { notes },
  });
}

// ─── Valid date range covering seeded shifts ──────────────────────────────────
const FROM = "2025-09-01T00:00:00.000Z";
const TO = "2025-09-30T23:59:59.000Z";

// ─── Base publish body ────────────────────────────────────────────────────────
const emptyPublishBody = {
  add: {},
  edit: {},
  delete: [],
};

// ─── GET /api/admin/schedules ─────────────────────────────────────────────────
test.describe("GET /api/admin/schedules", () => {
  test("200 - returns schedules for valid from/to range", async ({
    request,
  }) => {
    const res = await getSchedules(request, FROM, TO);

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("schedules");
    expect(Array.isArray(body.schedules)).toBe(true);
  });

  test("400 - missing from", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/admin/schedules`, {
      params: { to: TO },
    });
    expect(res.status()).toBe(400);
  });

  test("400 - missing to", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/admin/schedules`, {
      params: { from: FROM },
    });
    expect(res.status()).toBe(400);
  });

  test("400 - invalid datetime format for from", async ({ request }) => {
    const res = await getSchedules(request, "not-a-date", TO);
    expect(res.status()).toBe(400);
  });

  test("400 - from is after to", async ({ request }) => {
    const res = await getSchedules(request, TO, FROM); // swapped
    expect(res.status()).toBe(400);
  });
});

// ─── POST /api/admin/schedules ────────────────────────────────────────────────
test.describe("POST /api/admin/schedules", () => {
  // ── Add ───────────────────────────────────────────────────────────────────────
  test.describe("200 - adds a new shift", () => {
    test.afterEach(async ({ request }) => {
      // Shift gets a DB-generated ID — delete by notes instead
      await deleteShiftByNotes(request, "Test add shift");
    });

    test("adds shift and returns 200", async ({ request }) => {
      const res = await publishSchedules(request, {
        ...emptyPublishBody,
        add: {
          "local-temp-id-001": {
            id: "local-temp-id-001",
            user_id: USER_ID,
            start_time: "2025-11-01T09:00:00.000Z",
            end_time: "2025-11-01T17:00:00.000Z",
            notes: "Test add shift",
          },
        },
      });

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.message).toBe("Schedules published successfull");
    });
  });

  test("400 - missing user_id in add", async ({ request }) => {
    const res = await publishSchedules(request, {
      ...emptyPublishBody,
      add: {
        "local-001": {
          id: "local-001",
          start_time: "2025-11-01T09:00:00.000Z",
          end_time: "2025-11-01T17:00:00.000Z",
          notes: null,
        },
      },
    });
    expect(res.status()).toBe(400);
  });

  test("400 - invalid user_id (not a cuid)", async ({ request }) => {
    const res = await publishSchedules(request, {
      ...emptyPublishBody,
      add: {
        "local-001": {
          id: "local-001",
          user_id: "not-a-cuid",
          start_time: "2025-11-01T09:00:00.000Z",
          end_time: "2025-11-01T17:00:00.000Z",
          notes: null,
        },
      },
    });
    expect(res.status()).toBe(400);
  });

  test("400 - missing start_time in add", async ({ request }) => {
    const res = await publishSchedules(request, {
      ...emptyPublishBody,
      add: {
        "local-001": {
          id: "local-001",
          user_id: USER_ID,
          end_time: "2025-11-01T17:00:00.000Z",
          notes: null,
        },
      },
    });
    expect(res.status()).toBe(400);
  });

  test("400 - invalid start_time format", async ({ request }) => {
    const res = await publishSchedules(request, {
      ...emptyPublishBody,
      add: {
        "local-001": {
          id: "local-001",
          user_id: USER_ID,
          start_time: "not-a-date",
          end_time: "2025-11-01T17:00:00.000Z",
          notes: null,
        },
      },
    });
    expect(res.status()).toBe(400);
  });

  test("400 - missing add/edit/delete keys entirely", async ({ request }) => {
    const res = await publishSchedules(request, {});
    expect(res.status()).toBe(400);
  });

  test("400 - non-existent user_id in add (FK violation)", async ({
    request,
  }) => {
    const res = await publishSchedules(request, {
      ...emptyPublishBody,
      add: {
        "local-001": {
          id: "local-001",
          user_id: "cnonexistent0user000000001",
          start_time: "2025-11-01T09:00:00.000Z",
          end_time: "2025-11-01T17:00:00.000Z",
          notes: null,
        },
      },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toBe(
      "Invalid user. One or more employees could not be found."
    );
  });

  // ── Edit ──────────────────────────────────────────────────────────────────────
  test.describe("200 - edits an existing shift", () => {
    test.afterEach(async ({ request }) => {
      await resetShift(request, EDIT_SHIFT_ID, EDIT_SHIFT_ORIGINAL);
    });

    test("edits shift and returns 200", async ({ request }) => {
      const res = await publishSchedules(request, {
        ...emptyPublishBody,
        edit: {
          [EDIT_SHIFT_ID]: {
            id: EDIT_SHIFT_ID,
            user_id: USER_ID,
            start_time: "2025-09-01T10:00:00.000Z", // changed
            end_time: "2025-09-01T18:00:00.000Z", // changed
            notes: "Edited notes",
          },
        },
      });

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.message).toBe("Schedules published successfull");
    });
  });

  test("404 - edit targets a shift that does not exist", async ({
    request,
  }) => {
    const res = await publishSchedules(request, {
      ...emptyPublishBody,
      edit: {
        cnonexistent0shift00000001: {
          id: "cnonexistent0shift00000001",
          user_id: USER_ID,
          start_time: "2025-11-01T09:00:00.000Z",
          end_time: "2025-11-01T17:00:00.000Z",
          notes: null,
        },
      },
    });
    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body.message).toBe(
      "One or more shifts not found. They may have already been deleted."
    );
  });

  // ── Delete ────────────────────────────────────────────────────────────────────
  test.describe("200 - deletes an existing shift", () => {
    test.afterEach(async ({ request }) => {
      await seedShift(request, DELETE_SHIFT_SEED);
    });

    test("deletes shift and returns 200", async ({ request }) => {
      const res = await publishSchedules(request, {
        ...emptyPublishBody,
        delete: [DELETE_SHIFT_ID],
      });

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.message).toBe("Schedules published successfull");
    });
  });

  test("404 - delete targets a shift that does not exist", async ({
    request,
  }) => {
    const res = await publishSchedules(request, {
      ...emptyPublishBody,
      delete: ["cnonexistent0shift00000001"],
    });
    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body.message).toBe(
      "One or more shifts not found. They may have already been deleted."
    );
  });

  test("409 - cannot delete a shift that has time entries", async ({
    request,
  }) => {
    const res = await publishSchedules(request, {
      ...emptyPublishBody,
      delete: [HAS_ENTRY_SHIFT_ID],
    });
    expect(res.status()).toBe(409);
    const body = await res.json();
    expect(body.message).toBe("Cannot delete a shift that has time entries.");
  });

  // ── Combined ──────────────────────────────────────────────────────────────────
  test.describe("200 - add, edit, delete all in one request", () => {
    test.afterEach(async ({ request }) => {
      await resetShift(request, EDIT_SHIFT_ID, EDIT_SHIFT_ORIGINAL);
      await seedShift(request, DELETE_SHIFT_SEED);
      await deleteShiftByNotes(request, "Combined test add");
    });

    test("handles add + edit + delete atomically", async ({ request }) => {
      const res = await publishSchedules(request, {
        add: {
          "local-combined-001": {
            id: "local-combined-001",
            user_id: USER_ID,
            start_time: "2025-12-01T09:00:00.000Z",
            end_time: "2025-12-01T17:00:00.000Z",
            notes: "Combined test add",
          },
        },
        edit: {
          [EDIT_SHIFT_ID]: {
            id: EDIT_SHIFT_ID,
            user_id: USER_ID,
            start_time: "2025-09-01T10:00:00.000Z",
            end_time: "2025-09-01T18:00:00.000Z",
            notes: "Combined test edit",
          },
        },
        delete: [DELETE_SHIFT_ID],
      });

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.message).toBe("Schedules published successfull");
    });
  });
});
