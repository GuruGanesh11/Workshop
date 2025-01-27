import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';
import { StepperEvent } from '../../interface/stepper';

@Component({
  selector: 'app-stepper',
  imports: [TimelineModule, CommonModule],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss'
})
export class StepperComponent {
  @Input() stepperData: StepperEvent[] = [];
  events: any;
  eventsVertical: any;
  ngOnInit() {
    this.events = [
      { title: 'Pre-Solution Preparation', description: '', completed: 'done'},
      { title: 'Inputs for Design Workshop', description: '', completed: 'progress' },
      { title: 'Features Generation', description: '', completed: 'pending' },
    ];

    this.eventsVertical = [{ title: 'User Story with Acceptance Criteria & Test Case Generation', description: '', completed: 'pending' },
      { title: 'Design Canvas Creation', description: '', completed: 'pending'}];
  }

}
