import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  accessToken: string | null = null;
  errorMessage: string | null = null;

  constructor(private readonly router: Router, private readonly authService: AuthServiceService, ){}
  
  login() {
    this.authService.login();
        
  }
}
