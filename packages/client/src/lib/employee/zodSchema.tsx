import z from "zod";

export const editableSchema = z
  .object({
    email: z.email("Invalid email address"),
    phone: z.string().regex(/^\+1\d{10}$/, "Must be +1 followed by 10 digits"),
    emergency_contact: z
      .string()
      .trim()
      .transform((v) => (v === "" ? null : v))
      .nullable(),
    emergency_phone: z
      .string()
      .trim()
      .transform((v) => (v === "" ? null : v))
      .pipe(
        z
          .string()
          .regex(/^\+1\d{10}$/, "Must be +1 followed by 10 digits")
          .nullable()
      ),
  })
  .partial(); // partial so each field validates independently

export type EditProfilePayload = z.infer<typeof editableSchema>;
