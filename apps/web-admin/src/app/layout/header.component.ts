import { Component } from '@angular/core';

@Component({
  selector: 'layout-header',
  standalone: true,
  template: `
    <header class="flex h-16 items-center justify-between border-b border-white/10 bg-slate-950/90 px-6 text-slate-100 shadow-[0_10px_30px_rgba(2,6,23,0.35)] backdrop-blur">
      <div>
        <h2 class="text-lg font-semibold tracking-tight">Admin Dashboard</h2>
      </div>
      <nav class="flex items-center gap-3 text-sm text-slate-300">
        <span>Welcome Admin</span>
        <button class="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 font-medium text-rose-200 transition-colors hover:bg-rose-500/20">
          Logout
        </button>
      </nav>
    </header>
  `,
})
export class LayoutHeaderComponent {}
