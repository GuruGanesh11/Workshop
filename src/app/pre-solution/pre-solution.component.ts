import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MediaService } from '../services/media.service';
import { Subject } from 'rxjs';
import { TooltipOptions } from 'primeng/api';
import { SolutionService } from '../services/solution.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastMessageService } from '../services/toast-message.service';
@Component({
  selector: 'app-pre-solution',
  standalone: false,
  templateUrl: './pre-solution.component.html',
  styleUrl: './pre-solution.component.scss',
})
export class PreSolutionComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef;

  solutionContextForm!: FormGroup;
  additionalContextForm!: FormGroup;
  keyRole: any;
  value: string = '';
  additionalContextIsExceeded: boolean = false;
  questionGenerationPanel: boolean = false;
  uploadedMedia: Array<any> = [];
  selectedContextFiles: any = [];
  generatedQuestions = [];
  loading: boolean = false;
  contextCreateBtnEnable: boolean = true;
  selectedSolutionID = '';
  selectedAdditionalContextID: string = "";
  questionGenerated: boolean = false;
  currentFileChanges:boolean = false;
  tooltipOptions: TooltipOptions = {}
  selectedKeyRole: any = [];
  regenerateBtnControl :boolean = false;

  // check max word count

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly mediaService: MediaService,
    private readonly solutionService: SolutionService,
    private readonly fb: FormBuilder, 
    private readonly toastService: ToastMessageService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectedSolutionID = params['solutionId'];
      this.solutionService.setSelectedSolutionID(params['solutionId']);
    });

    this.solutionContextForm = this.fb.group({
      industry: ["", []],
      problemStatement: ["", [this.wordExceedsLimitValidator(1000)]],
      vision: ["", [this.wordExceedsLimitValidator(250)]],
      targetAudience: ["", [this.wordExceedsLimitValidator(100)]],
      keyRoles: [[], []],
    });

    this.additionalContextForm = this.fb.group({
      additionalContext: ['', [this.wordExceedsLimitValidator(1000)]],
      file: ['', []]
    });
    
    if(this.selectedSolutionID.length){
      this.loading = true;
      this.getSolutionByID();
      this.getContextBySolutionID();
    }

    this.keyRole = [
      { name: 'Developer' },
      { name: 'Designer' },
      { name: 'Business Analyst' },
      { name: 'Architecture ' },
    ];

    this.tooltipOptions = {
      showDelay: 150,
      tooltipEvent: 'hover',
      tooltipPosition: 'right'
    };

  }

  wordExceedsLimitValidator(limit: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const text = control.value || ''; 
      const words = text.trim().split(/\s+/).filter(Boolean);
      const count = words.length;
      return count > limit ? { wordLimitExceeded: true } : null;
    };
  }

  // max word Count
  onCheckMaxWordCount(event: Event, formControlName: string, maxCount: number): void {
    const text = (event.target as HTMLTextAreaElement).value;
    const words = text.trim().split(/\s+/);
    const wordCount = words.filter((word) => word.length > 0).length;

    if (wordCount > maxCount) {
      const truncatedWords = words.slice(0, maxCount).join(' ');
      this.solutionContextForm.controls[formControlName].setValue(truncatedWords);
    } 
  }
  
  solutionContextOnsubmit() {
    if (this.additionalContextForm.valid && this.solutionContextForm.valid && this.solutionContextForm.dirty) {
      this.loading = true;
      this.createSolutionContext();
    }
  }

  setAllFormValues(val: any) {
    let KeyRole = val.key_roles.split(', ').filter((item: any) => item !== '').map((name: any) => ({ name }));
    this.solutionContextForm.patchValue({
      industry: val.industry,
      problemStatement: val.problem_statement,
      vision: val.vision,
      targetAudience: val.target_audience,
      keyRoles: KeyRole || []
    });

    this.solutionContextForm.updateValueAndValidity();
  }

  setAdditionalContextFormValue(val:any){
    this.additionalContextForm.patchValue({
      additionalContext: val.additional_context,
      file: ''
    });

    this.additionalContextForm.updateValueAndValidity();
  }

  keyRoleSelect(e: any) {
    this.selectedKeyRole = e.value;
  }

  checkWordCount(event:any) {
    const text = (event.target as HTMLTextAreaElement).value;
    const words = text.trim().split(/\s+/);
    const wordCount = words.filter((word) => word.length > 0).length;
    this.additionalContextIsExceeded = wordCount > 10;
    if(wordCount > 1000){
      const truncatedWords = words.slice(0, 10).join(' ');
      this.additionalContextForm.controls['additionalContext'].setValue(truncatedWords);
    }
  }

  @HostListener('click', ['$event.target'])
  triggerFileInput(target: HTMLElement): void {
    if (target.id === 'triggerDiv') {
      this.fileInput.nativeElement.click();
    }  
  }

  openQuestionGeneration() {
    this.questionGenerationPanel = true;
  }

  onFileBrowse(event: Event) {
    const target = event.target as HTMLInputElement;
    this.processFiles(target.files);
    target.value = '';
  }
   processFiles(files: any) {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']; // PDF, DOCX MIME Types
    if(this.uploadedMedia.length < 3){
      for (const file of files) {
  if (!allowedTypes.includes(file.type)) {
      this.toastService.showError('error', `File type not allowed. Only PDF and DOCX are accepted.`);
      continue;
    }
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event: any) => {
  
          this.uploadedMedia.push({
            FileName: file.name,
            FileSize:
              this.mediaService.getFileSize(file.size) +
              ' ' +
              this.mediaService.getFileSizeUnit(file.size),
            FileType: file.type,
            FileUrl: event.target.result,
            FileProgressSize: 0,
            FileProgress: 0,
            ngUnsubscribe: new Subject<any>(),
          });
  
         this.startProgress(file, this.uploadedMedia.length - 1);
        };
      }
    } else {
      this.toastService.showError('error', 'You can upload Maximum of 3 document Please remove any additional files before proceeding.');
    }  
  }

  startProgress(file: any, fileIndex: any) {
    let filteredFile = this.uploadedMedia
      .filter((u, index) => index === fileIndex)
      .pop();
    if (filteredFile != null) {
      let fileSize = this.mediaService.getFileSize(file.size);
      let fileSizeInWords = this.mediaService.getFileSizeUnit(file.size);
      if (this.mediaService.isApiSetup) {
        let formData = new FormData();
        formData.append('files', file, file.name);
        this.mediaService
          .uploadMedia(formData, this.selectedSolutionID, this.selectedAdditionalContextID)
          .subscribe({
            next: (res: any) => {
              if(res.is_success){
                this.getFiles();
              }
              if (res.status === 'progress') {
                let completedPercentage = parseFloat(res.message);
                filteredFile.FileProgressSize = `${(
                  (fileSize * completedPercentage) /
                  100
                ).toFixed(2)} ${fileSizeInWords}`;
                filteredFile.FileProgress = completedPercentage;               
              } else if (res.status === 'completed') {
                filteredFile.Id = res.Id;
                filteredFile.FileProgressSize = fileSize + ' ' + fileSizeInWords;
                filteredFile.FileProgress = 100;
              } else if(res.is_success) {
                this.selectedContextFiles = res.data;
              }                   
            },
            error: (error: any) => {},

          });
      } else {
        for (
          let f = 0;
          f < fileSize + fileSize * 0.0001;
          f += fileSize * 0.01
        ) {
          filteredFile.FileProgressSize = f.toFixed(2) + ' ' + fileSizeInWords;
          let percentUploaded = Math.round((f / fileSize) * 100);
          filteredFile.FileProgress = percentUploaded;
        }
      }
    } 
  }

  removeImage(idx: number) {
    this.loading = true;
    this.solutionService.deleteFile(this.selectedSolutionID, this.selectedAdditionalContextID, this.selectedContextFiles[idx]).subscribe(
      {
        next: (res) => {
          if(res.is_success){
            this.uploadedMedia = this.uploadedMedia.filter((u, index) => index !== idx);
            this.loading = false;
            this.currentFileChanges = true;
            this.getFiles();
          }else{this.loading = false;}},
        error: (err) => {this.loading = false}
      }
    )    
  }

  // open Additional Context
  createSolutionContext() {
    let KeyRole = '';
    if (this.selectedKeyRole.length) {
      KeyRole = this.selectedKeyRole.map((ele: any) => ele?.name).join(', ');
    }
    let formValue = this.solutionContextForm.value;
    
    let inputJson = {
      "input_context": {
        "industry": formValue.industry || "",
        "problem_statement": formValue.problemStatement || "",
        "vision": formValue.vision || "",
        "target_audience": formValue.targetAudience,
        "key_roles": KeyRole || "",
        "additional_info": ""
      },
      "additional_context": {
        "files": [
          ""
        ],
        "additional_context": ""
      }
    }

    this.solutionService.createSolutionContext(inputJson, this.selectedSolutionID).subscribe(
    {
      next: (res) => {
        if (res.is_success) {
          this.selectedAdditionalContextID = res.data.id;
          this.contextCreateBtnEnable = false;
          if (res.data.id) {  
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { additionalContext: 'true' },
              queryParamsHandling: 'merge' 
            });
          this.toastService.showSuccess('success', 'Solution Data Created Successfully');
          } else {
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { additionalContext: 'false' },
              queryParamsHandling: 'merge'
            });
            
          }
          this.loading = false;
        } else {
          this.contextCreateBtnEnable = true;
          this.loading = false;
          this.toastService.showWarn('warning', 'Solution Data Not Created');
        }
      }, 
      error: (err) => {this.loading = false; }
    });
  }

  updateAdditionalContext() {
    const formValue = this.solutionContextForm.value;
    const KeyRole = formValue.keyRoles.map((ele: any) => ele.name).join(', ') || "";
    const additionalContextFormData = this.additionalContextForm.value;
    const inputJson = {
      "input_context": {
        "industry": formValue.industry,
        "problem_statement": formValue.problemStatement,
        "vision": formValue.vision,
        "target_audience": formValue.targetAudience,
        "key_roles": KeyRole || "",
        "additional_info": ""
      },
      "additional_context": {
        "files": [],
        "additional_context": additionalContextFormData.additionalContext || "",
      }
    }

    this.solutionService.updateSolutionContext(inputJson, this.selectedSolutionID, this.selectedAdditionalContextID).subscribe(
      {
        next: (res) => {
          if(res.is_success){
            this.generateQuestions(this.selectedSolutionID, this.selectedAdditionalContextID);
            this.toastService.showSuccess('success', 'Context Updated Successfully');
          }else{
            this.toastService.showWarn('Warn', 'Context Not Updated');
          }
        }, 
        error: (err) => { }
      });
  }

  getFiles(){    
    this.loading = true;
    this.solutionService.getFiles(this.selectedSolutionID)
        .subscribe(
          {
            next: (res) => {
              if(res.is_success){
              this.uploadedMedia = [];
              this.selectedContextFiles = res.data; 
              this.uploadedMedia = [];
              res.data.map((ele: string) => {
                const file = ele.split('___')[ele.split('___').length - 1].split('.')
                this.uploadedMedia.push(
                  {
                    FileName: file[0],
                    FileSize: ' ',
                    FileType: file[1],
                    FileUrl: '',
                    FileProgressSize: 100,
                    FileProgress: 100,
                    ngUnsubscribe: new Subject<any>(),
                  }
                );
              });
              this.loading = false; 
              }else{
                this.loading = false; 
              }
            },
            error: (err) => {
              this.loading = false;
            }
          }
        );    
  }

   generateAdditionalContext(){
    if(this.additionalContextForm.valid && this.solutionContextForm.valid){
      this.loading = true;
      this.currentFileChanges = false;
      this.updateAdditionalContext();
    }   
  }

  getSolutionByID() {
    let ID = this.selectedSolutionID;
    this.solutionService.getSolutionById(ID).subscribe({
      next: (res) => {
        if (res.is_success) {
          this.solutionService.setSelectedSolutionID(res.data.solution_id);
          this.solutionService.setSelectedSolutionData(res.data);
          this.loading = false;
        } else {
          this.loading = false;
          this.contextCreateBtnEnable = false;
        }
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }

  getContextBySolutionID() {
    this.solutionService.getSolutionContext(this.selectedSolutionID).subscribe(
      {
        next: (res) => {
          if (res.is_success) {
            if (res.data.data.length) {
              this.router.navigate([], {
                relativeTo: this.route,
                queryParams: { additionalContext: 'true' },
                queryParamsHandling: 'merge' 
              });
              this.contextCreateBtnEnable = false;
              const lastContextData = res.data.data[0];     
              this.selectedContextFiles = lastContextData.additional_context.files;
              this.setAllFormValues(lastContextData.input_context);
              this.setAdditionalContextFormValue(lastContextData.additional_context);
              this.selectedAdditionalContextID = lastContextData.id;
              this.getFiles();
              this.loading = false;
              this.questionGenerationPanel = true;
              this.toastService.showSuccess('success', 'Solution Data Loaded Successfully');
            } else {
              this.router.navigate([], {
                relativeTo: this.route,
                queryParams: { additionalContext: 'false' },
                queryParamsHandling: 'merge'
              });
              this.questionGenerationPanel = false;
              this.contextCreateBtnEnable = true;
              this.loading = false;
            }
          }
        },
        error: (err) => { 
          this.loading = false;
        }  
      }
    );
  }

  generateQuestions(solutionID: any, contextID: any): void {
    this.loading = true;
    let InputJson = {
      "additional_context": this.additionalContextForm.value.additionalContext || "",
    };
    this.solutionService.generateQuestions(solutionID, contextID, InputJson).subscribe({
      next: (res) => {
        if (res.is_success && res.data.questions.length) {
          this.questionGenerationPanel = true;
          this.generatedQuestions = res.data.questions.map((question: any) => ({ ...question, original_question: question.question, modified: false, tag: "", checked: false }));
          this.loading = false; 
          this.questionGenerated = true;
          this.regenerateBtnControl = true;
          this.solutionContextForm.markAsPristine();
          this.additionalContextForm.markAsPristine();
          this.currentFileChanges = false;
          this.toastService.showSuccess('success', 'Question Generated Successfully');  
        } else {
          this.questionGenerationPanel = true;
          this.questionGenerated = false;
          this.regenerateBtnControl = false;
          this.loading = false;     
          this.toastService.showWarn('warning', 'No Questions Generated');
        }
      }, 
      error: (err) => {
        this.loading = false; 
        this.questionGenerationPanel = true;
        this.questionGenerated = false;
        this.regenerateBtnControl = false;
    }});
  }

  questionChanges(event: boolean){
    this.loading = event;
  }
}