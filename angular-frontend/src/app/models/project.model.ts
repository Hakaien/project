import { Group } from './group.model';
import { User } from './user.model';

export type ProjectStatus = 'UPCOMING' | 'IN_PROGRESS' | 'SUSPENDED' | 'COMPLETED' | 'ARCHIVED';

export interface Project {
  id: number;
  name: string;
  description?: string;
  category: string;
  tags: string[];
  groups: Group[];
  users: User[];
  projectManagers: User[];
  startDate: Date;
  plannedEndDate: Date;
  actualEndDate?: Date;
  status: ProjectStatus;
  externalLinks?: string[];
  isArchived: boolean;
}
