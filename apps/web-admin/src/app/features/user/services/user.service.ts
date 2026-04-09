import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() {}

  getUsers() {
    // TODO: Fetch users from API
    return [];
  }

  getUserById(id: string) {
    // TODO: Fetch user by ID from API
    return null;
  }
}
