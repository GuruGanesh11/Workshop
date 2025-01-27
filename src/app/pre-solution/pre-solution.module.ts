import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionGenerationComponent } from './question-generation/question-generation.component';
import { PreSolutionComponent } from './pre-solution.component';
import { HeaderComponent } from '../header/header.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastMessageService } from '../services/toast-message.service';
import { FormsModule } from '@angular/forms';
import { PreSolutionRoutingModule } from './pre-solution-routing.module';
import { SharedModule } from '../shared_modules/shared_modules';
import { CreateSolutionComponent } from './create-solution/create-solution.component';
import { ViewSolutionComponent } from './view-solution/view-solution.component';

@NgModule({
  declarations: [PreSolutionComponent, QuestionGenerationComponent, CreateSolutionComponent, ViewSolutionComponent],
  imports: [
    PreSolutionRoutingModule,
    FormsModule,
    CommonModule,
    SharedModule,
    HeaderComponent
  ],
  exports: [],
  providers: [ConfirmationService, MessageService, ToastMessageService]
})
export class PreSolutionModule { }
