/**
 * @file 多用户管理
 * @description 提供多用户协作支持，包括用户管理、权限控制和活动跟踪
 * @module collaboration/multi-user
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  joinedAt: Date;
  lastActive: Date;
  isOnline: boolean;
}

export interface UserActivity {
  userId: string;
  userName: string;
  action: string;
  target: string;
  timestamp: Date;
  details?: Record<string, unknown>;
}

export interface UserSession {
  userId: string;
  userName: string;
  socketId?: string;
  connectedAt: Date;
  lastHeartbeat: Date;
}

export type Permission = 'read' | 'write' | 'delete' | 'admin';

export class MultiUserManager {
  private users: Map<string, User> = new Map();
  private sessions: Map<string, UserSession> = new Map();
  private activities: UserActivity[] = [];
  private maxActivities = 100;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const usersData = localStorage.getItem('yyc3_users');
      if (usersData) {
        const users = JSON.parse(usersData) as User[];
        users.forEach((user) => {
          this.users.set(user.id, user);
        });
      }
    } catch (error) {
      console.error('Failed to load users from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const users = Array.from(this.users.values());
      localStorage.setItem('yyc3_users', JSON.stringify(users));
    } catch (error) {
      console.error('Failed to save users to storage:', error);
    }
  }

  private addActivity(activity: UserActivity): void {
    this.activities.push(activity);
    if (this.activities.length > this.maxActivities) {
      this.activities.shift();
    }
  }

  addUser(user: Omit<User, 'id' | 'joinedAt' | 'lastActive' | 'isOnline'>): User {
    const newUser: User = {
      ...user,
      id: this.generateUserId(),
      joinedAt: new Date(),
      lastActive: new Date(),
      isOnline: false,
    };

    this.users.set(newUser.id, newUser);
    this.saveToStorage();

    this.addActivity({
      userId: newUser.id,
      userName: newUser.name,
      action: 'joined',
      target: 'workspace',
      timestamp: new Date(),
    });

    return newUser;
  }

  removeUser(userId: string): boolean {
    const user = this.users.get(userId);
    if (!user) return false;

    this.users.delete(userId);
    this.sessions.delete(userId);
    this.saveToStorage();

    this.addActivity({
      userId,
      userName: user.name,
      action: 'left',
      target: 'workspace',
      timestamp: new Date(),
    });

    return true;
  }

  updateUser(userId: string, updates: Partial<User>): User | null {
    const user = this.users.get(userId);
    if (!user) return null;

    const updatedUser = {
      ...user,
      ...updates,
      lastActive: new Date(),
    };

    this.users.set(userId, updatedUser);
    this.saveToStorage();

    this.addActivity({
      userId,
      userName: user.name,
      action: 'updated',
      target: 'profile',
      timestamp: new Date(),
      details: updates,
    });

    return updatedUser;
  }

  getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  getOnlineUsers(): User[] {
    return this.getAllUsers().filter((user) => user.isOnline);
  }

  getUserByEmail(email: string): User | undefined {
    return this.getAllUsers().find((user) => user.email === email);
  }

  hasPermission(userId: string, permission: Permission): boolean {
    const user = this.getUser(userId);
    if (!user) return false;

    const rolePermissions: Record<User['role'], Permission[]> = {
      owner: ['read', 'write', 'delete', 'admin'],
      admin: ['read', 'write', 'delete', 'admin'],
      editor: ['read', 'write'],
      viewer: ['read'],
    };

    return rolePermissions[user.role].includes(permission);
  }

  canUserEdit(userId: string): boolean {
    return this.hasPermission(userId, 'write');
  }

  canUserDelete(userId: string): boolean {
    return this.hasPermission(userId, 'delete');
  }

  canUserAdmin(userId: string): boolean {
    return this.hasPermission(userId, 'admin');
  }

  joinSession(userId: string, socketId?: string): UserSession {
    const user = this.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const session: UserSession = {
      userId,
      userName: user.name,
      socketId,
      connectedAt: new Date(),
      lastHeartbeat: new Date(),
    };

    this.sessions.set(userId, session);

    this.updateUser(userId, { isOnline: true });

    this.addActivity({
      userId,
      userName: user.name,
      action: 'connected',
      target: 'session',
      timestamp: new Date(),
    });

    return session;
  }

  leaveSession(userId: string): boolean {
    const user = this.getUser(userId);
    if (!user) return false;

    this.sessions.delete(userId);

    this.updateUser(userId, { isOnline: false });

    this.addActivity({
      userId,
      userName: user.name,
      action: 'disconnected',
      target: 'session',
      timestamp: new Date(),
    });

    return true;
  }

  updateHeartbeat(userId: string): void {
    const session = this.sessions.get(userId);
    if (session) {
      session.lastHeartbeat = new Date();
    }
  }

  getSession(userId: string): UserSession | undefined {
    return this.sessions.get(userId);
  }

  getAllSessions(): UserSession[] {
    return Array.from(this.sessions.values());
  }

  getActiveSessionCount(): number {
    return this.sessions.size;
  }

  cleanupInactiveSessions(timeoutMs: number = 300000): number {
    const now = new Date();
    const inactiveUsers: string[] = [];

    this.sessions.forEach((session, userId) => {
      const inactiveTime = now.getTime() - session.lastHeartbeat.getTime();
      if (inactiveTime > timeoutMs) {
        inactiveUsers.push(userId);
      }
    });

    inactiveUsers.forEach((userId) => {
      this.leaveSession(userId);
    });

    return inactiveUsers.length;
  }

  getActivities(limit: number = 50): UserActivity[] {
    return this.activities.slice(-limit).reverse();
  }

  getUserActivities(userId: string, limit: number = 50): UserActivity[] {
    return this.activities
      .filter((activity) => activity.userId === userId)
      .slice(-limit)
      .reverse();
  }

  recordActivity(activity: Omit<UserActivity, 'timestamp'>): void {
    this.addActivity({
      ...activity,
      timestamp: new Date(),
    });
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  exportUsers(): string {
    const users = this.getAllUsers();
    return JSON.stringify(users, null, 2);
  }

  importUsers(usersJson: string): void {
    try {
      const users = JSON.parse(usersJson) as User[];
      this.users.clear();
      users.forEach((user) => {
        this.users.set(user.id, user);
      });
      this.saveToStorage();
    } catch (error) {
      console.error('Failed to import users:', error);
      throw new Error('Invalid users data');
    }
  }

  exportActivities(): string {
    return JSON.stringify(this.activities, null, 2);
  }

  clearActivities(): void {
    this.activities = [];
  }

  getStats() {
    return {
      totalUsers: this.users.size,
      onlineUsers: this.getOnlineUsers().length,
      activeSessions: this.sessions.size,
      totalActivities: this.activities.length,
      roles: {
        owner: this.getAllUsers().filter((u) => u.role === 'owner').length,
        admin: this.getAllUsers().filter((u) => u.role === 'admin').length,
        editor: this.getAllUsers().filter((u) => u.role === 'editor').length,
        viewer: this.getAllUsers().filter((u) => u.role === 'viewer').length,
      },
    };
  }
}

export const createMultiUserManager = (): MultiUserManager => {
  return new MultiUserManager();
};

export const multiUserManager = createMultiUserManager();
