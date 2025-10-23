import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  user: string | null = '';

  constructor(private auth: AuthService, private router: Router) {
    this.user = this.auth.getUser();
  }

  irClientes() {
    this.router.navigate(['/clientes']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
