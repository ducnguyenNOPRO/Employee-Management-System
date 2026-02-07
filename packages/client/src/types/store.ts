import type { SignInPayload, SignUpPayload } from "./auth";

export interface AuthState<AuthUser> {
  accessToken: string | null;
  user: AuthUser | null; // Either Admin or User type
  loading: boolean;

  clearState: () => void;
  setAccessToken: (token: string) => void;

  signUp: (payload: SignUpPayload) => Promise<void>;
  signIn: (payload: SignInPayload) => Promise<void>;
  signOut: () => Promise<void>;
  fetchMe: () => Promise<void>;
  refresh: () => Promise<void>;
}
