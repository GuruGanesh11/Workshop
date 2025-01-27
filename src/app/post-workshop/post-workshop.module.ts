import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostWorkshopComponent } from './post-workshop.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared_modules/shared_modules';
import { HeaderComponent } from '../header/header.component';
import { PostWorkshopRoutingModule } from './post-workshop-routing.module';



@NgModule({
  declarations: [
    PostWorkshopComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    HeaderComponent,
    PostWorkshopRoutingModule
  ]
})
export class PostWorkshopModule { }
