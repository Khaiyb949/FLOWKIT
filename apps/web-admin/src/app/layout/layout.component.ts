import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutHeaderComponent } from './header.component';
import { LayoutSidebarComponent } from './sidebar.component';

@Component({
  selector: 'layout-main',
  standalone: true,
  imports: [RouterOutlet, LayoutHeaderComponent, LayoutSidebarComponent],
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-100">
      <layout-header></layout-header>
      <div class="flex min-h-[calc(100vh-4rem)]">
        <layout-sidebar></layout-sidebar>
        <main class="flex-1 p-6 lg:p-8">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export class LayoutMainComponent {}
