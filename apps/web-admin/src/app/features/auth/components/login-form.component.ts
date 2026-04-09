import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginRequest } from '../models/auth.model';

@Component({
  selector: 'auth-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()" class="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
      <input
        type="email"
        name="email"
        [(ngModel)]="email"
        placeholder="Email"
        required
        class="h-11 rounded-md border border-white/10 bg-slate-950 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
      />
      <input
        type="password"
        name="password"
        [(ngModel)]="password"
        placeholder="Password"
        required
        class="h-11 rounded-md border border-white/10 bg-slate-950 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
      />
      <button type="submit" class="inline-flex h-11 items-center justify-center rounded-md bg-amber-400 px-4 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-300">
        Login
      </button>
    </form>
  `,
})
export class LoginFormComponent {
  @Output() submitted = new EventEmitter<LoginRequest>();
  
  email: string = '';
  password: string = '';

  onSubmit() {
    this.submitted.emit({ email: this.email, password: this.password });
  }
}
