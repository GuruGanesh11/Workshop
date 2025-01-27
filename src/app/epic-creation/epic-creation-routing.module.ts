import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EpicDetailsComponent } from './epic-details/epic-details.component';
import { EpicCreationComponent } from './epic-creation.component';
import { ViewFeatureComponent } from './view-feature/view-feature.component';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  // { path: 'create', component:  EpicCreationComponent},
  { path: ':epicID/edit', component:  ViewFeatureComponent},
  { path: '', component:  EpicCreationComponent},
  { path: ':epicID/create', component:  EpicDetailsComponent},
  { path: ':epicID/edit', component:  EpicDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class EpicCreationRoutingModule { }
