// Domain Entity
export class UserEntity {
  id!: string;
  email!: string;
  name!: string;
  role!: 'admin' | 'user';
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: Partial<UserEntity>) {
    Object.assign(this, data);
  }

  // Business logic methods
  hasPermission(action: string): boolean {
    if (this.role === 'admin') return true;
    // TODO: Implement permission logic
    return false;
  }
}
