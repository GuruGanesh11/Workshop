import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, TooltipOptions } from 'primeng/api';
import { SolutionData } from '../../interface/soltion-data';
import { ToastMessageService } from '../../services/toast-message.service';
import { SolutionService } from '../../services/solution.service';
import { SolutionType } from '../../interface/pre-solution';
@Component({
  selector: 'app-create-solution',
  standalone: false,
  templateUrl: './create-solution.component.html',
  styleUrls: ['./create-solution.component.scss'],
  providers: [DatePipe, CurrencyPipe, ConfirmationService, MessageService, ToastMessageService]
})
export class CreateSolutionComponent implements OnInit {
  selectSolutionType: SolutionType | undefined;
  tooltipOptions: TooltipOptions = { showDelay: 150, tooltipEvent: 'hover', tooltipPosition: 'right'};
  solutionId: string = '';
  solutionName: string = '';
  unitName: string = "";
  solutionType: SolutionType[] = [{ name: 'Data Migration' }, { name: 'E-commerce' }, { name: 'Website', }];
  solutionCreationLoading: boolean = false
  userCreatedStatus: boolean = false;
  createSolutionForm!: FormGroup;
  loading: boolean = false;

  responseSolutionData: SolutionData = {
    created_by: '',
    updated_by: '',
    created_at: new Date().toString(),
    updated_at: new Date().toString(),
    solution_id: '',
    solution_name: '',
    solution_description: '',
    solution_type: '',
    id: ''
  };

  constructor(
    private readonly solServices: SolutionService, 
    private readonly route: Router,
    private readonly toastMsg: ToastMessageService,
    private readonly fb: FormBuilder
) { }

  ngOnInit() {
    this.createSolutionForm = this.fb.group({
      solutionId: [{value: '', disabled:true}, []],
      unitName: ['', [Validators.required, Validators.pattern('^[A-Za-z]*$')]],
      selectSolutionType: [[], []],
      solutionName: ['', []],
    });
    this.getSolutionID();
  }

  getSolutionID(){
    this.loading = true;
    this.solServices.getNewSolutionID().subscribe({
      next: (res) => {
        if(res.is_success){
          this.solutionId = res.data;
          this.createSolutionForm.controls['solutionId'].setValue(res.data);
          this.loading = false;
        }else{
          this.createSolutionForm.controls['solutionId'].setValue('');
          this.toastMsg.showWarn('warning', 'Solution ID not Received');
          this.loading = false;
        }
      },
      error : (err) =>{
        this.createSolutionForm.controls['solutionId'].setValue('');
        this.loading = false;
      }
    });
  } 

  createSolution() { 
    const formValue = this.createSolutionForm.value;
    this.solutionCreationLoading = true;
    if (this.createSolutionForm.valid) {
      const inputJson = {
        "solution_name": formValue.solutionName,
        "solution_description": "",
        "solution_type": formValue.selectSolutionType?.name,
        "business_unit": formValue.unitName,
        "solution_id": this.solutionId
      }
      this.loading = true;
      this.solServices.createSolution(inputJson).subscribe({
        next: (res) => {
          if (res.is_success) {
            this.userCreatedStatus = true;
            this.toastMsg.showSuccess('Success', 'Solution created successfully');
            this.responseSolutionData = res.data;
            this.solutionCreationLoading = false;
            this.loading = false;
          }else{
            this.solutionCreationLoading = false;
            this.userCreatedStatus = false;
            this.loading = false;
            this.toastMsg.showWarn("warning", "Solution created Failed");
          }
        },
        error: (err) => {        
          this.solutionCreationLoading = false;
          this.loading = false;
        }
      });

    }
  }

  openSolution(data: SolutionData){
      this.route.navigate(['/pre-solution', data.solution_id]); 
  } 

}
