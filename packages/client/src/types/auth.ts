export interface SignUpPayload {
  firstName: string;
  lastName: string;
  email: string;
  role: "employee" | "admin";
  password: string;
  passwordConfirm: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}
