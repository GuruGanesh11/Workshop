import { provideRouter, RouterModule, Routes, withComponentInputBinding } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeScreenComponent },
  {
    path: 'pre-solution',
    loadChildren: () => import('./pre-solution/pre-solution.module').then(m => m.PreSolutionModule)
  },
  { path: 'post-workshop',
    loadChildren: () => import('./post-workshop/post-workshop.module').then(m => m.PostWorkshopModule)
  },
  { path: ':solutionID/:contextID/epic',
    loadChildren: () => import('./epic-creation/epic-creation.module').then(m => m.EpicCreationModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [
    provideRouter(routes, withComponentInputBinding())],
  exports: [RouterModule]
})
export class AppRoutingModule { }
