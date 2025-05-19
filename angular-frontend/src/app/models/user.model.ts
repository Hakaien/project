import { Group } from './group.model';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
  groups: Group[];
  isActive: boolean;
}

export type UserRole =
  | 'ADMIN'
  | 'PROJECT_MANAGER'
  | 'DEVELOPER'
  | 'SUPPORT'
  | 'CONSULTANT'
  | 'EXTERNAL_PROVIDER';
