import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared_modules/shared_modules';
import { HeaderComponent } from '../header/header.component';
import { EpicCreationComponent } from './epic-creation.component';
import { EpicCreationRoutingModule } from './epic-creation-routing.module';
import { EpicDetailsComponent } from './epic-details/epic-details.component';

@NgModule({
  declarations: [
    EpicCreationComponent,
    EpicDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    HeaderComponent,
    EpicCreationRoutingModule
  ]
})
export class EpicCreationModule { }
