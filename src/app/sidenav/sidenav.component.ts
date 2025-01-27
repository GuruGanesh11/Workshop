import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { AuthServiceService } from '../services/auth-service.service';
import { SidebarServiceService } from '../services/sidebar-service.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {
  sidebarVisible: boolean  = false
  constructor(private readonly authServiceService: AuthServiceService, private readonly sidebarService: SidebarServiceService) {}
  
  navItems: any[] = [
    {
      icon: "fa fa-home",
      name: "Home",
      url: "/home"
    },
    // {
    //   icon: "fa fa-home",
    //   name: "Home",
    //   url: "/post-workshop"
    // },
    // {
    //   icon: "fa-home",
    //   name: "Home",
    //   url: "/home-screen"
    // },
    // {
    //   icon: "fa-gear",
    //   name: "Setting",
    //   url: "/digital-loan"
    // },
    // {
    //   icon: "fa-user",
    //   name: "Profile",
    //   url: "/feature-creation"
    // },
    // {
    //   icon: "fa-star",
    //   name: "Slider",
    //   url: "/slider"
    // },
    // {
    //   icon: "fa-gear",
    //   name: "View_Feature",
    //   url: "/view-feature"
    // },
    // {
    //   icon: "fa-gear",
    //   name: "View_Feature",
    //   url: "/feature-details"
    // }
  ];
  isSideNavOpened = false;

  ngOnInit(): void {
    this.sidebarService.sidebarVisible$.subscribe(visible => {
      this.sidebarVisible = visible;
    });

  }



  toggleSideBar() {
    this.isSideNavOpened = !this.isSideNavOpened;
  }

  setActivePAge(page: any) {
    this.authServiceService.activePage.next(page);
  }

}


