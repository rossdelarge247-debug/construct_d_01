// Shape locked at S-F7-α per spec 71 §4 lines 193-200. Byte-for-byte; do not drift.

export interface WorkspaceStore {
  read<T>(userId: string, scope: string): Promise<T | null>;
  write<T>(userId: string, scope: string, data: T): Promise<void>;
  subscribe<T>(userId: string, scope: string, callback: (data: T) => void): () => void;
}
