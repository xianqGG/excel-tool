export interface IItem {
  uid: string;
  expire?: number;
  tip?: string;
  remark?: string;
}

export interface IServerConfig {
  enable: boolean;
  announcement: string;
  ids: IItem[];
}
