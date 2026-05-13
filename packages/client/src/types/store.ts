import type { SignInPayload, RegisterPayload } from "../lib/zodSchema";
import type { MutableUserFields } from "./user";

export interface AuthState<AuthUser> {
  accessToken: string | null;
  user: AuthUser | null; // Either Admin or User type
  loading: boolean;

  clearState: () => void;
  setAccessToken: (token: string) => void;
  updateUser: (data: MutableUserFields) => void;

  signUp: (payload: RegisterPayload) => Promise<void>;
  signIn: (payload: SignInPayload) => Promise<string>;
  signOut: () => Promise<void>;
  fetchMe: () => Promise<void>;
  refresh: () => Promise<void>;
}
