import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostWorkshopComponent } from './post-workshop.component';

const routes: Routes = [
  { path: '', redirectTo: 'transcript', pathMatch: 'full' },
  { path: 'transcript/:solutionID/:contextID', component:  PostWorkshopComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PostWorkshopRoutingModule { }
