import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'layout-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="w-64 shrink-0 border-r border-white/10 bg-slate-900/70 p-4 backdrop-blur">
      <nav class="flex flex-col gap-2">
        <a routerLink="/dashboard" routerLinkActive="bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20" class="rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white">
          Dashboard
        </a>
        <a routerLink="/users" routerLinkActive="bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20" class="rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white">
          Users
        </a>
        <a routerLink="/settings" routerLinkActive="bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20" class="rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white">
          Settings
        </a>
      </nav>
    </aside>
  `,
})
export class LayoutSidebarComponent {}
