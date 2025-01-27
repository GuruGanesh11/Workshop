import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  isSideNavOpened = new BehaviorSubject(false);
  navList = new BehaviorSubject([]);
  activePage = new BehaviorSubject({
    icon: 'fa-home',
    name: 'Home',
  });

  // private clientId = '057a3487-9f78-4a2c-9115-813cf8a366df'; // Azure AD Application ID
  // private tenantId = '88967783-f7e1-448e-bbcf-8b5e2776c0d8'; // Azure AD Tenant ID
  // private redirectUri = 'http://localhost:4200/home'; // Redirect URI
  // private scope = 'api://057a3487-9f78-4a2c-9115-813cf8a366df/scope_workbench'; // Scope for Microsoft Graph API

  private readonly authorizationEndpoint = `https://login.microsoftonline.com/${environment.adConfig.tenantId}/oauth2/v2.0/authorize`;
  // private getTokenUrl = 'https://be-app-san-wkb-nb-dev-e2hmfzh8hvbgd7g4.southafricanorth-01.azurewebsites.net/api/v1/auth/get_token'; // Backend endpoint for token exchange

  constructor(private readonly http: HttpClient) {}

  login() {
    const authUrl = `${this.authorizationEndpoint}?client_id=${environment.adConfig.clientId}&response_type=code&redirect_uri=${encodeURIComponent(environment.adConfig.redirectUri)}&response_mode=query&scope=${encodeURIComponent(environment.adConfig.readScopeUrl)}`;
    window.location.href = authUrl;
  }

  async exchangeAuthCodeForToken(authCode: string): Promise<any> {
    try {
      const url = `${environment.adConfig.getTokenUrl}?authorization_code=${encodeURIComponent(authCode)}`;
      const response: any = await firstValueFrom(this.http.get(url));
      if (!response?.data?.access_token) {
        throw new Error('Invalid response structure: Missing access_token');
      }
      return response.data;
    } catch (error: unknown) {  
      throw new Error('Failed to exchange authorization code for token');
    }
  }

  handleAuthCode() {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');
    if (authCode) {
      return authCode;
    }
    return null;
  }

  getNavList() {
    return this.http.get('assets/jsons/sideNavList.json');
  }

  setNavList(navList: any) {
    this.navList.next(navList);
  }

  setActivePage(page: any) {
    this.activePage.next(page);
  }
}
