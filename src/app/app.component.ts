import { Component } from '@angular/core';
import { AuthServiceService } from './services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Workbench-angular';
  errorMessage: string | null = null;
  loading: boolean = false;
  constructor(private readonly router: Router, private readonly authService: AuthServiceService, ){}
  ngOnInit(){
    const authCode = this.authService.handleAuthCode();
    console.log('Find Existing Auth Code: ', authCode)
    if (authCode) {
      this.loading = true;
      this.authService.exchangeAuthCodeForToken(authCode)
        .then((res) => {
          localStorage.setItem('authToken', res.access_token);
          localStorage.setItem('username', res.username);
          this.loading = false;
        })
        .catch((error) => {
          this.errorMessage = 'Failed to retrieve access token.';
          this.loading = false;
        });
    }
  }
}
