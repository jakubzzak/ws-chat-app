export type UserRecord = {
  client_id: string;
  last_active: string;
};

export interface HistoryRepository {
  getLastActiveList: () => Promise<UserRecord[]>;
  saveLastActive: (clientId: string) => Promise<void>;
}
