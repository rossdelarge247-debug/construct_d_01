import type { WorkspaceStore } from './types';
import { MODE } from '@/lib/auth';
import { devStore } from './dev-store';

export type { WorkspaceStore } from './types';

const NOT_IMPLEMENTED = 'S-F8 not implemented — prod store requires S-F7-δ';

const prodStore: WorkspaceStore = {
  async read() {
    throw new Error(NOT_IMPLEMENTED);
  },
  async write() {
    throw new Error(NOT_IMPLEMENTED);
  },
  subscribe() {
    throw new Error(NOT_IMPLEMENTED);
  },
};

export function getStore(): WorkspaceStore {
  return MODE === 'prod' ? prodStore : devStore;
}
