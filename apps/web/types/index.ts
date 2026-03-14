export interface UserRegistrationType {
  name: string;
  email: string;
  password: string;
}

export interface UserLoginType {
  email: string;
  password: string;
}

export interface UserUpdateType {
  name?: string;
  email?: string;
  password?: string;
}

export interface TaskCreateType {
  title: string;
  description?: string;
}

export interface TaskUpdateType {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  userId: number;
  createdAt: string;
}
