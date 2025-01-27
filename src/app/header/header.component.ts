import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SolutionService } from '../services/solution.service';
import { SolutionData } from '../interface/soltion-data';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared_modules/shared_modules';
import { StepperComponent } from './stepper/stepper.component';
import { StepperEvent } from '../interface/stepper';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule, StepperComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent {
  stepperEvents: StepperEvent[] = [];
  solutionData: SolutionData = {
    "created_by": "",
    "updated_by": '',
    "created_at": "",
    "updated_at": "",
    "solution_name": " ",
    "solution_description": "",
    "solution_type": "",
    "id": "",
    "solution_id": ""
};

  constructor(private readonly solServices: SolutionService,public readonly messageService: MessageService){}

  ngOnInit(){
    this.solServices.selectedSolutionData$.subscribe((data: any) => { this.solutionData = data; });
    this.stepperEvents = [
      { title: 'Pre-Solution Preparation', description: '', completed: 'progress'},
      { title: 'Inputs for Design Workshop', description: '', completed: 'pending'},
      { title: 'Features Generation', description: '', completed: 'pending'},
      { title: 'User Story with Acceptance Criteria & Test Case Generation', description: '', completed: 'pending'},
      { title: 'Design Canvas Creation', description: '', completed: 'pending' }
    ];

}
   

}
