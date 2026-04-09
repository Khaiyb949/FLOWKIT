import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

  // TODO: Implement authentication logic
  login(email: string, password: string) {
    // API call
  }

  logout() {
    // Logout logic
  }

  isAuthenticated(): boolean {
    // Check if user is authenticated
    return false;
  }
}
