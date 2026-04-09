// Presentation: DTOs
export class CreateUserDto {
  email!: string;
  name!: string;
  role!: 'admin' | 'user';
}

export class UpdateUserDto {
  email?: string;
  name?: string;
  role?: 'admin' | 'user';
}

export class UserResponseDto {
  id!: string;
  email!: string;
  name!: string;
  role!: 'admin' | 'user';
}
