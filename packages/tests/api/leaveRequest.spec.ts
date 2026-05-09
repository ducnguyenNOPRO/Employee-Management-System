import { test, expect } from "@playwright/test";
import { authHeader } from "../auth";

const BASE_URL = "http://localhost:3000";

// ─── Seeded IDs (must exist in DB before running) ────────────────────────────
const REQUESTER_ID = "ctest000000requester0000001";
const APPROVER_ID = "ctest000000approver0000001x";

const PENDING_VACATION_ID = "creq0000000vacation00pending"; // 16h VACATION  PENDING  → use for approve/reject success path
const PENDING_SICK_ID = "creq0000000sickleav0pending"; //  8h SICK_LEAVE PENDING  → burn for 409 test
const APPROVED_ID = "creq0000000vacation0approved"; // 16h VACATION  APPROVED → 409 test
const REJECTED_ID = "creq0000000vacation0rejected"; // 16h VACATION  REJECTED → 409 test

// ─── Helpers ─────────────────────────────────────────────────────────────────
async function postLeave(request: any, body: Record<string, unknown>) {
  return request.post(`${BASE_URL}/api/admin/leaves`, {
    data: body,
    headers: authHeader(),
  });
}

async function patchLeave(
  request: any,
  id: string,
  body: Record<string, unknown>
) {
  return request.patch(`${BASE_URL}/api/admin/leaves/${id}`, {
    data: body,
    headers: authHeader(),
  });
}

async function getBalance(request: any, id: string) {
  return request.get(`${BASE_URL}/api/admin/employees/${id}/balances`, {
    headers: authHeader(),
  });
}

async function deleteLeaveByReason(
  request: any,
  reason: string | null,
  requester_id: string
) {
  return request.delete(`${BASE_URL}/api/test/leaves`, {
    params: { reason, requester_id },
  });
}

// Valid base body — override individual fields per test
const validLeaveBody = {
  requester_id: REQUESTER_ID,
  type: "SICK_LEAVE", // use SICK_LEAVE so VACATION balance stays clean
  hours: 8,
  start_date: "2025-09-01",
  end_date: "2025-09-02",
  reason: "Flu",
};

// ─── POST /api/admin/leaves ───────────────────────────────────────────────────
test.describe("POST /api/admin/leaves", () => {
  // ── Success path ──────────────────────────────────────────────────────────────

  test.describe("201 - creates a leave request with valid body", () => {
    // Flow: POST → assert 201 + balance → afterEach deletes row + decrements used
    test.afterEach(async ({ request }) => {
      await deleteLeaveByReason(request, "Flu", REQUESTER_ID);
      // used: 16 → 8 (back to baseline)
    });

    test("creates request and increments used balance", async ({ request }) => {
      const res = await postLeave(request, validLeaveBody);

      expect(res.status()).toBe(201);
      const body = await res.json();
      expect(body.message).toBe("Request created successfully");

      // Balance check — used: 8 → 16, remaining: 40 → 24
      const resB = await getBalance(request, REQUESTER_ID);
      expect(resB.status()).toBe(200);
      const bodyB = await resB.json();
      const sickLeave = bodyB.balances.find(
        (b: any) => b.type === "SICK_LEAVE"
      );
      expect(sickLeave).toBeDefined();
      expect(sickLeave.remaining).toBe(24);
    });
  });

  test.describe("201 - accepts null reason", () => {
    // Uses a unique reason string so cleanup is unambiguous
    const nullReasonBody = {
      ...validLeaveBody,
      reason: null,
      start_date: "2025-10-01",
      end_date: "2025-10-02",
    };

    test.afterEach(async ({ request }) => {
      await deleteLeaveByReason(request, "null", REQUESTER_ID);
      // used: 16 → 8 (back to baseline)
    });

    test("creates request with null reason and increments used balance", async ({
      request,
    }) => {
      const res = await postLeave(request, nullReasonBody);

      expect(res.status()).toBe(201);

      // Balance check — used: 8 → 16, remaining: 40 → 24
      const resB = await getBalance(request, REQUESTER_ID);
      expect(resB.status()).toBe(200);
      const bodyB = await resB.json();
      const sickLeave = bodyB.balances.find(
        (b: any) => b.type === "SICK_LEAVE"
      );
      expect(sickLeave).toBeDefined();
      expect(sickLeave.remaining).toBe(24);
    });
  });

  // ── Validation errors (400) ──────────────────────────────────────────────────
  test("400 - missing requester_id", async ({ request }) => {
    const { requester_id, ...body } = validLeaveBody;
    const res = await postLeave(request, body);

    expect(res.status()).toBe(400);
  });

  test("400 - invalid requester_id (not a cuid)", async ({ request }) => {
    const res = await postLeave(request, {
      ...validLeaveBody,
      requester_id: "not-a-cuid",
    });

    expect(res.status()).toBe(400);
  });

  test("400 - missing type", async ({ request }) => {
    const { type, ...body } = validLeaveBody;
    const res = await postLeave(request, body);

    expect(res.status()).toBe(400);
  });

  test("400 - invalid type value", async ({ request }) => {
    const res = await postLeave(request, {
      ...validLeaveBody,
      type: "PERSONAL_DAY",
    });

    expect(res.status()).toBe(400);
  });

  test("400 - missing hours", async ({ request }) => {
    const { hours, ...body } = validLeaveBody;
    const res = await postLeave(request, body);

    expect(res.status()).toBe(400);
  });

  test("400 - hours exceeds maximum (160)", async ({ request }) => {
    const res = await postLeave(request, {
      ...validLeaveBody,
      hours: 161,
    });

    expect(res.status()).toBe(400);
  });

  test("400 - hours is negative", async ({ request }) => {
    const res = await postLeave(request, {
      ...validLeaveBody,
      hours: -1,
    });

    expect(res.status()).toBe(400);
  });

  test("400 - missing start_date", async ({ request }) => {
    const { start_date, ...body } = validLeaveBody;
    const res = await postLeave(request, body);

    expect(res.status()).toBe(400);
  });

  test("400 - missing end_date", async ({ request }) => {
    const { end_date, ...body } = validLeaveBody;
    const res = await postLeave(request, body);

    expect(res.status()).toBe(400);
  });

  test("400 - invalid date format", async ({ request }) => {
    const res = await postLeave(request, {
      ...validLeaveBody,
      start_date: "not-a-date",
    });

    expect(res.status()).toBe(400);
  });

  test("400 - reason exceeds 40 characters", async ({ request }) => {
    const res = await postLeave(request, {
      ...validLeaveBody,
      reason: "a".repeat(41),
    });

    expect(res.status()).toBe(400);
  });

  // ── Business logic errors ────────────────────────────────────────────────────
  test("404 - requester has no leave balance record", async ({ request }) => {
    const res = await postLeave(request, {
      ...validLeaveBody,
      requester_id: "cnonexistent0user000000001", // valid cuid format, no balance row
    });

    // No balance row → 404 from the FOR UPDATE query
    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body.message).toBe(
      "Balances record for user cnonexistent0user000000001 not found"
    );
  });

  test("422 - requested hours exceed available balance", async ({
    request,
  }) => {
    // SICK_LEAVE total=40, used=0 → remaining=40. Request 41 hours.
    const res = await postLeave(request, {
      ...validLeaveBody,
      hours: 41,
    });

    expect(res.status()).toBe(422);
    const body = await res.json();
    expect(body.message).toBe("Requested leave exceeds available balance");
  });
});

// ─── PATCH /api/admin/leaves/:id ─────────────────────────────────────────────
test.describe("PATCH /api/admin/leaves/:id", () => {
  // ── Success path ──────────────────────────────────────────────────────────────
  test.describe("200 - approves a pending request", () => {
    test.afterEach(async ({ request }) => {
      // Reset PENDING_VACATION_ID back to PENDING so re-runs work
      await request.patch(
        `${BASE_URL}/api/test/reset-leave/${PENDING_VACATION_ID}`
      );
    });

    test("approves and returns 200", async ({ request }) => {
      const res = await patchLeave(request, PENDING_VACATION_ID, {
        approver_id: APPROVER_ID,
        status: "APPROVED",
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.message).toBe("Decision updated successfully");
    });
  });

  test.describe("200 - rejects a pending request", () => {
    test.afterEach(async ({ request }) => {
      // Reset PENDING_SICK_ID back to PENDING and re-increment used (rejection decrements it)
      await request.patch(
        `${BASE_URL}/api/test/reset-leave/${PENDING_SICK_ID}`
      );
    });

    test("rejects and returns 200, decrements used balance", async ({
      request,
    }) => {
      const res = await patchLeave(request, PENDING_SICK_ID, {
        approver_id: APPROVER_ID,
        status: "REJECTED",
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.message).toBe("Decision updated successfully");

      // Rejection should return the 8h back to available balance
      // SICK_LEAVE seeded: total=40, used=8 (from the PENDING row) → after reject used=0 → remaining=40
      const resB = await getBalance(request, REQUESTER_ID);
      expect(resB.status()).toBe(200);
      const bodyB = await resB.json();
      const sickLeave = bodyB.balances.find(
        (b: any) => b.type === "SICK_LEAVE"
      );
      expect(sickLeave).toBeDefined();
      expect(sickLeave.remaining).toBe(40);
    });
  });

  // ── Validation errors (400) ──────────────────────────────────────────────────
  test("400 - invalid ID format in URL param", async ({ request }) => {
    const res = await patchLeave(request, "not-a-valid-id", {
      approver_id: APPROVER_ID,
      status: "APPROVED",
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toBe("Missing or Invalid ID format");
  });

  test("400 - missing approver_id", async ({ request }) => {
    const res = await patchLeave(request, PENDING_VACATION_ID, {
      status: "APPROVED",
    });

    expect(res.status()).toBe(400);
  });

  test("400 - invalid approver_id (not a cuid)", async ({ request }) => {
    const res = await patchLeave(request, PENDING_VACATION_ID, {
      approver_id: "not-a-cuid",
      status: "APPROVED",
    });

    expect(res.status()).toBe(400);
  });

  test("400 - missing status", async ({ request }) => {
    const res = await patchLeave(request, PENDING_VACATION_ID, {
      approver_id: APPROVER_ID,
    });

    expect(res.status()).toBe(400);
  });

  test("400 - invalid status value (PENDING is not allowed)", async ({
    request,
  }) => {
    const res = await patchLeave(request, PENDING_VACATION_ID, {
      approver_id: APPROVER_ID,
      status: "PENDING", // editLeaveSchema only allows APPROVED | REJECTED
    });

    expect(res.status()).toBe(400);
  });

  test("400 - invalid status value (random string)", async ({ request }) => {
    const res = await patchLeave(request, PENDING_VACATION_ID, {
      approver_id: APPROVER_ID,
      status: "MAYBE",
    });

    expect(res.status()).toBe(400);
  });

  // ── Not found (404) ──────────────────────────────────────────────────────────
  test("404 - leave request does not exist", async ({ request }) => {
    const res = await patchLeave(request, "cnonexistent0leave00000001", {
      approver_id: APPROVER_ID,
      status: "APPROVED",
    });

    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body.message).toBe("Request not found");
  });

  // ── Conflict (409) ───────────────────────────────────────────────────────────
  test("409 - cannot update an already approved request", async ({
    request,
  }) => {
    const res = await patchLeave(request, APPROVED_ID, {
      approver_id: APPROVER_ID,
      status: "REJECTED",
    });

    expect(res.status()).toBe(409);
    const body = await res.json();
    expect(body.message).toBe("Request is no longer pending");
  });

  test("409 - cannot update an already rejected request", async ({
    request,
  }) => {
    const res = await patchLeave(request, REJECTED_ID, {
      approver_id: APPROVER_ID,
      status: "APPROVED",
    });

    expect(res.status()).toBe(409);
    const body = await res.json();
    expect(body.message).toBe("Request is no longer pending");
  });
});
