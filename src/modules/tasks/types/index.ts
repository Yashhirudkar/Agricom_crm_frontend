/**
 * Frontend Type Definitions for Task Module
 * Mapped to Backend DTOs and Sequelize Models
 */

export type TaskStatusType = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' | 'ARCHIVED';
export type TaskHealthState = 'HEALTHY' | 'AT_RISK' | 'DELAYED' | 'BLOCKED' | 'COMPLETED';

export interface TaskStatus {
  id: number;
  name: string;
  colorCode: string;
  isCompleted: boolean;
  order: number;
}

export interface TaskPriority {
  id: number;
  name: string;
  colorCode: string;
  order: number;
}

export interface Task {
  id: number;
  taskCode: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  estimatedMinutes: number | null;
  actualMinutes: number;
  completionPercentage: number;
  isArchived: boolean;
  statusId: number;
  priorityId: number | null;
  parentTaskId: number | null;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  status?: TaskStatus;
  priority?: TaskPriority;
  assignees?: any[];
  watchers?: any[];
  
  // Enriched fields from Response
  dueStatus?: 'COMPLETED' | 'OVERDUE' | 'DUE_TODAY' | 'FUTURE' | 'NO_DUE_DATE';
  dueLabel?: string;
  overdueDays?: number;
  completionDelayDays?: number;
  healthStatus?: TaskHealthState;
}

export interface TaskComment {
  id: number;
  content: string;
  taskId: number;
  parentCommentId: number | null;
  createdAt: string;
  employee?: {
    id: number;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
}

export interface TaskChecklist {
  id: number;
  title: string;
  isCompleted: boolean;
  orderIndex: number;
  taskId: number;
}

export interface TaskDependency {
  id: number;
  taskId: number;
  dependsOnTaskId: number;
  dependencyType: 'BLOCKED_BY' | 'RELATES_TO' | 'DUPLICATES';
  dependsOnTask?: Task;
}
