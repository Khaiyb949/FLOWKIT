import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from '../components/login-form.component';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../models/auth.model';

@Component({
  selector: 'auth-login-page',
  standalone: true,
  imports: [CommonModule, LoginFormComponent],
  template: `
    <div class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <div class="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-slate-900/70 p-8 text-center shadow-2xl shadow-black/20 backdrop-blur">
        <div class="space-y-2">
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">Secure Access</p>
          <h1 class="text-3xl font-semibold tracking-tight text-slate-50">Admin Login</h1>
        </div>
        <auth-login-form (submitted)="onLogin($event)"></auth-login-form>
      </div>
    </div>
  `,
})
export class LoginPageComponent {
  constructor(private authService: AuthService) {}

  onLogin(request: LoginRequest) {
    this.authService.login(request.email, request.password);
  }
}
