import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor() {}

  getStats() {
    // TODO: Fetch stats from API
    return {
      totalUsers: 0,
      totalOrders: 0,
      revenue: 0,
      activeUsers: 0
    };
  }
}
