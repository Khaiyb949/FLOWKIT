// Domain Entity - Pure business object (no ORM decorators)
export class AuthEntity {
  id!: string;
  email!: string;
  password!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: Partial<AuthEntity>) {
    Object.assign(this, data);
  }

  // Business logic methods
  isPasswordValid(password: string): boolean {
    // TODO: Compare with hashed password
    return true;
  }
}
