export interface Notification {
  id: number;
  message: string;
  type: 'INFO' | 'WARNING' | 'ERROR';
  createdAt: Date;
  read: boolean;
}
