import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthFeatureService {
  constructor() {}

  // Feature-specific auth logic
  validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
