import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  ingresar() {
    this.error = '';
    this.auth.login(this.usuario, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => this.error = err.message
    });
  }
}
