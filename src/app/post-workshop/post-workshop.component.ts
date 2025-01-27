import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { PostWorkshopService } from '../services/post-workshop.service';
import { ToastMessageService } from '../services/toast-message.service';
import { SolutionService } from '../services/solution.service';
import { Question, MediaFile, UserInputSheet } from '../interface/post-workshop';
import { TooltipOptions } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-workshop',
  templateUrl: './post-workshop.component.html',
  styleUrl: './post-workshop.component.scss',
  standalone: false
})
export class PostWorkshopComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  additionalContextForm!: FormGroup;
  uploadedMedia: MediaFile[] = [];
  questionValidationIsVisible: boolean = false;
  closeVisible: boolean = false;
  inputReceived: boolean = false;
  selectedQuestion: Question = {
    "question": "",
    "category": "",
    "is_relevant": true,
    "question_id": "",
    "is_edited": false,
    "is_deleted": false,
    "is_manual": false,
    "is_input_received": false,
    "is_validated": true,
    "answer": ""
  };
  validateQuestion: Array<Question> = [];
  questionSheet: Array<Question> = [];
  checked: boolean = false;
  solutionID: string = '';
  additionalContextID: string = '';
  formSubmitted: boolean = false;
  selectedValidatedQuestion: Question | null = null;
  loading: boolean = false;
  tooltipOptions: TooltipOptions = {}

  // Use the defined interface for the userInputSheets
  userInputSheets: UserInputSheet[] = [
    { id: 1, name: 'User Input sheet 1', fileUploaded: false, media: [], required: true, deleted: false },
    { id: 2, name: 'User input sheet 2', fileUploaded: false, media: [], required: false, deleted: false },
    { id: 3, name: 'User input sheet 3', fileUploaded: false, media: [], required: false, deleted: false },
    { id: 4, name: 'User Type 1', fileUploaded: false, media: [], required: false, deleted: false },
    { id: 5, name: 'User Type 2', fileUploaded: false, media: [], required: false, deleted: false },
    { id: 6, name: 'User Type 3', fileUploaded: false, media: [], required: false, deleted: false },
    { id: 7, name: 'User Type 4', fileUploaded: false, media: [], required: false, deleted: false },
    { id: 8, name: 'User Type 5', fileUploaded: false, media: [], required: false, deleted: false },
  ];

  constructor(private readonly route: ActivatedRoute ,private readonly postWorkShop: PostWorkshopService, private readonly solServices: SolutionService, private readonly toastServices: ToastMessageService, private readonly fb: FormBuilder) { }

  ngOnInit() {
    this.solutionID = this.route.snapshot.paramMap.get('solutionID') ?? '';
    this.additionalContextID = this.route.snapshot.paramMap.get('contextID') ?? '';

    this.additionalContextForm = this.fb.group({
      additionalContext: ['', []]
    });

    this.tooltipOptions = {
      showDelay: 150,
      tooltipEvent: 'hover',
      tooltipPosition: 'right'
    };
    this.getWorkshopFiles();
    this.getWorkShopQuestion();
  }

  onFileBrowse(event: Event, index: number) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      this.loading = true;
      this.processFiles(target.files, index);
    }
  }

  checkFileUploaded(): boolean {
    return this.userInputSheets
      .filter(sheet => sheet.id !== 1)
      .some(sheet => sheet.fileUploaded === true);
  }
  processFiles(files: FileList, index: number) {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.userInputSheets[index].fileUploaded = true;
        this.userInputSheets[index].deleted = false;
        this.startProgress(file, index)
      };
    });
  }

  startProgress(file: any, fileIndex: number) {
    const fieldName = this.userInputSheets[fileIndex].name
    if (file != null) {
      let formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('transcript_type', fieldName);
      this.postWorkShop.uploadWorkshopFiles(formData, this.solutionID, this.additionalContextID).subscribe({
        next: (res) => {
          if (res.is_success) {
            this.formSubmitted = false;
            this.loading = false;
            this.toastServices.showSuccess('Success', 'Workshop transcripts uploaded');
            this.getWorkshopFiles();
          } else {
            this.loading = false;
          }
        },
        error: (err) => {
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  deleteFile(id: number, index: number) {
    this.loading = true;
    this.userInputSheets.forEach((item: any) => {
      if (item.id === id) {
        this.loading = true;
        this.postWorkShop.deleteWorkshopFile(this.solutionID, this.additionalContextID, item.media[0]).subscribe({
          next: (res) => {
            if (res.is_success) { 
              this.userInputSheets[index].media = [];
              this.userInputSheets[index].fileUploaded = false;
              this.userInputSheets[index].deleted = this.formSubmitted;
              this.formSubmitted = false;
              this.loading = false;
            } else {
              this.loading = false;
            }
          },
          error: (err) => {
            this.loading = false;
          }
        });
      }
    });
  }

  getFileName(filePath: string): string {
    const index = filePath.lastIndexOf('___');
    if (index === -1) {
      return filePath;
    }
    return filePath.substring(index + 3);
  }

  getWorkshopFiles() {
    this.loading = true
    this.postWorkShop.getAllWorkshopFiles(this.solutionID, this.additionalContextID).subscribe({
      next: (res) => {
        if (res.is_success) {
          res.data['transcripts'].map((field: any) => {
            const index = this.userInputSheets.findIndex(item => item.name == field.transcript_type);
            if (index != -1) {
              this.userInputSheets[index].media = [field.file_path];
              this.userInputSheets[index].fileUploaded = true;
              this.userInputSheets[index].deleted = false;
            } else {
              const fieldItem = { id: 8, name: field.transcript_type, fileUploaded: false, media: [field.file_path], required: false, deleted: false }
              this.userInputSheets.push(fieldItem);
            }
            this.loading = false;
          });

          this.additionalContextForm.patchValue({
            additionalContext: res.data['workshop_context'].additional_context
          });
          this.additionalContextForm.updateValueAndValidity();

        } else {
          this.loading = false;
        }
      }, error: (err) => {
        this.loading = false;
      }
    });
  }


  getReceivedQuestions(): Question[] {
    return this.questionSheet.filter((q) => q.is_input_received && !q.is_validated);
  }

  getNotReceivedQuestions(): Question[] {
    return this.questionSheet.filter((q) => !q.is_input_received && !q.is_validated);
  }

  showModal(inputLabel: string, question: Question) {
    if (inputLabel === 'inputs-received' && question.selected) {
      this.selectedQuestion = question;
      this.questionValidationIsVisible = true;
      this.inputReceived = true;
    } else if (question.selected) {
      this.selectedQuestion = question;
      this.questionValidationIsVisible = true;
      this.inputReceived = false;
    } else {
      this.questionValidationIsVisible = true;
    }
  }

  wordExceedsLimitValidator(limit: number): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const text = control.value || ''; 
        const words = text.trim().split(/\s+/).filter(Boolean);
        const count = words.length;
        return count > limit ? { wordLimitExceeded: true } : null;
      };
    }

  removeValidated(que: Question) {
    this.selectedValidatedQuestion = que;
    this.closeVisible = true;
  }

  additionalContextUpdate() {
    this.loading = true;
    this.generateAnswer();
  }

  generateAnswer() {
    this.loading = true
    const InputJson = {
      "additional_context": this.additionalContextForm.value.additionalContext || ''
    }
    this.postWorkShop.generateWorkshopAnswers(this.solutionID, this.additionalContextID, InputJson).subscribe({
      next: (res) => {
        if (res.is_success) {
          this.formSubmitted = true;
          this.additionalContextForm.markAsPristine();
          this.loading = false;
          this.toastServices.showSuccess('Success', 'Answer Generated Successfully');
          this.getWorkShopQuestion();
        } else {
          this.loading = false;
        }
      }, error: (err) => {
        this.loading = false;
      }
    });
  }

  getWorkShopQuestion() {
    this.loading = true;
    this.postWorkShop.getAllWorkshopQuestion(this.solutionID, this.additionalContextID).subscribe({
      next: (res) => {
        if (res.is_success) {
          this.questionSheet = res.data.filter((qus: any) => !qus.is_validated).map((question: any) => ({ ...question, selected: false }));
          this.validateQuestion = res.data.filter((qus: any) => qus.is_validated).map((question: any) => ({ ...question, selected: false }));
          this.loading = false;
          this.toastServices.showSuccess('Success', 'Question get Successfully!');
        } else {
          this.questionSheet = [];
          this.loading = false;
        }
      }, error: (err) => {
        this.loading = false;
      }
    });
  }

  updateBulkQuestionValidation(que: Question, validationStatus: boolean) {
    this.loading = true;
    const inputJson = [
      {
        "answer": que.answer,
        "question_id": que.question_id
      }
    ]
    this.postWorkShop.updateQuestionValidationStatus(this.solutionID, this.additionalContextID, inputJson, validationStatus).subscribe({
      next: (res) => {
        if (res.is_success) {
          this.questionValidationIsVisible = false;
          this.loading = false;
          this.toastServices.showSuccess('Success', 'Questions validation status updated successfully!');
          this.getWorkShopQuestion();
        } else {
          this.loading = false;
        }
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }

  updateValidationCancel(qus: Question) {
    this.questionInputApprovedCancel(qus);
  }

  questionInputApprovedCancel(que: Question): void {
    que.selected = false;
    const index = this.questionSheet.findIndex(q => q.question_id === que.question_id);
    if (index !== -1) {
      this.questionSheet[index] = que;
      this.selectedQuestion = {
        "question": "",
        "category": "",
        "is_relevant": true,
        "question_id": "",
        "is_edited": false,
        "is_deleted": false,
        "is_manual": false,
        "is_input_received": false,
        "is_validated": true,
        "answer": ""
      };
    }
    this.questionValidationIsVisible = false;
  }

  questionInputApproved(que: Question): void {
    this.loading = true;
    const inputJson = [
      {
        "answer": this.selectedQuestion.answer,
        "question_id": this.selectedQuestion.question_id
      }
    ]
    this.postWorkShop.updateWorkshopQuestion(this.solutionID, this.additionalContextID, inputJson).subscribe({
      next: (res) => {
        if (res.is_success) {
          this.questionValidationIsVisible = false;
          this.toastServices.showSuccess('Success', res.data);
          this.getWorkShopQuestion();
        } else {
          this.loading = false;
        }
      }, error: (err) => { this.loading = false; }
    });
  }

  questionBackToSheet(ques: Question) {
    this.updateBulkQuestionValidation(ques, false);
  }
}


