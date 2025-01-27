import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreSolutionComponent } from './pre-solution.component';
import { CreateSolutionComponent } from './create-solution/create-solution.component';
import { ViewSolutionComponent } from './view-solution/view-solution.component';

const routes: Routes = [
  { path: '', redirectTo: '/create-solution', pathMatch: 'full' },
  { path: 'create-solution', component: CreateSolutionComponent },
  { path: 'view-solution', component: ViewSolutionComponent },
  { path: ':solutionId', component: PreSolutionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreSolutionRoutingModule { }
