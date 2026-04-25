// Shape locked at S-F7-α per spec 71 §4 lines 182-210. Byte-for-byte; do not drift.

export interface UserSession {
  id: string;
  email: string;
  role: 'participant' | 'admin' | 'support';
  twoFactorVerified: boolean;
  createdAt: Date;
  lastActiveAt: Date;
  deviceFingerprint: string;
}

export interface AuthGate {
  requireUser(): Promise<UserSession>;
  redirectIfAuthed(to: string): Promise<void>;
  currentSession(): Promise<UserSession | null>;
}
