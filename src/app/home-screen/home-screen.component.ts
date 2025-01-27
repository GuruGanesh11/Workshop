import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SolutionService } from '../services/solution.service';
import { ToastMessageService } from '../services/toast-message.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [RouterModule,ButtonModule, CommonModule],
  templateUrl: './home-screen.component.html',
  styleUrl: './home-screen.component.scss'
})
export class HomeScreenComponent {
  loading: boolean = false;
  authUserName: string;
  constructor(private readonly router: Router, private readonly solutionService: SolutionService, private readonly toastService: ToastMessageService) {
    this.authUserName = localStorage.getItem('username') ?? '';
   }

  logoutAccount(){
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  downloadWorkbenchManual(){
    this.loading = true;
    this.solutionService.getWorkbenchManual().subscribe({
      next: (res) => {
        if(res.is_success){
        this.downloadFile(res.data.url);
        this.loading = false;
        } else {
          this.loading = false;
          this.toastService.showWarn('warning', 'User Manual Not Found');
        }
      },
      error: err => {
        this.loading = false;     
      }
    }
    );
  }

  downloadFile(url: string) {  
   const link = document.createElement('a');
   link.href = url;
   link.target = "_blank";
   link.download = 'user-manual.pdf';
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
  }
}
