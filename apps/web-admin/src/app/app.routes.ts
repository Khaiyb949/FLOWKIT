import { Route } from '@angular/router';
import { LayoutMainComponent } from './layout/layout.component';
import { LoginPageComponent } from './features/auth/pages/login-page.component';
import { DashboardPageComponent } from './features/dashboard/pages/dashboard-page.component';
import { UserListPageComponent } from './features/user/pages/user-list-page.component';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: LoginPageComponent,
      },
    ],
  },
  {
    path: '',
    component: LayoutMainComponent,
    // canActivate: [authGuard], // ⭐ Uncomment when auth guard is ready
    children: [
      {
        path: 'dashboard',
        component: DashboardPageComponent,
      },
      {
        path: 'users',
        component: UserListPageComponent,
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
