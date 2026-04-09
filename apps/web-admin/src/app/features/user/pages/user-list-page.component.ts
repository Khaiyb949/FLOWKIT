import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'user-list-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur">
      <h1 class="text-3xl font-semibold tracking-tight text-slate-50">Users</h1>
      <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-300">User list will be displayed here.</p>
    </div>
  `,
})
export class UserListPageComponent {}
