import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { SolutionService } from '../../services/solution.service';
import { Dropdown } from '../../interface/dropdown';
import { CategoryQuestions } from '../../interface/pre-solution';
import { ToastMessageService } from '../../services/toast-message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question-generation',
  standalone: false,
  templateUrl: './question-generation.component.html',
  styleUrl: './question-generation.component.scss',
})
export class QuestionGenerationComponent {
  @Input() updateNewQuestion = [];
  @Input() selectedSolutionID: string = ''
  @Input() selectedAdditionalContextID: string = ''

  @Output() questionChanges = new EventEmitter <boolean>(false);

  questionsByCategory: any = [];
  addQuestionVisible: boolean = false;
  isEditMode = false;
  deleteConfirmVisible: boolean = false;
  selectQuestionType: Dropdown | undefined;
  newQuestion: string = '';
  relevantBtnActiveInactive: boolean = false;
  questionList: any;
  functionalCategory = ['Planning', 'Analysis'].map(category => ({
    name: category.toLocaleLowerCase(),
    isSelected: true,
    type: 'functional'
  }));
  technicalCategory = [
    "Architecture",
    "Design",
    "Development",
    "Testing",
    "Deployment",
    "Maintenance"].map(category => ({
      name: category.toLocaleLowerCase(),
      isSelected: true,
      type: 'functional'
    }));
  nonTechnicalCategory = [
    "Functional Requirements",
    "Financial Considerations"
  ].map(category => ({
    name: category.toLocaleLowerCase(),
    isSelected: true,
    type: 'functional'
  }));

  questionLegendTypes = [
    ['Planning', 'Analysis'],
    [
      "Architecture",
      "Design",
      "Development",
      "Testing",
      "Deployment",
      "Maintenance"],
    [
      "Functional Requirements",
      "Financial Considerations"
    ]
  ]

  questionType = [
    {name:'Functional'},
    {name:'Technical'},
    {name:'Non Technical'}
  ];

  visibleQuestionTypes: CategoryQuestions = {}

  constructor(
    private readonly solutionService: SolutionService,
    private readonly toastService: ToastMessageService,
    private readonly route: Router
  ) { }

  ngOnInit(){
    this.questionChanges.emit(true);
    this.getAllQuestion();
  }

  ngOnChanges(Changes: SimpleChanges) {
    if(Changes['updateNewQuestion'].currentValue.length){
      this.questionChanges.emit(true);
      this.getAllQuestion();
    }
  }
  
  getAllQuestion() {
    this.questionChanges.emit(true);
    this.solutionService.getallQuestions(this.selectedSolutionID, this.selectedAdditionalContextID).subscribe({
      next: (res) => {
        if (res.is_success) {
          this.questionList = res.data.map((question: any) => ({ ...question, original_question: question.question, modified: false, tag: "", checked: false }));    
          this.questionsByCategory = this.groupQuestionsByCategory(this.questionList);
          if (Object.keys(this.visibleQuestionTypes).length) {
            Object.keys(this.visibleQuestionTypes).forEach(selectedLegend => {
              this.visibleQuestionTypes[selectedLegend] = this.questionsByCategory[selectedLegend];
            });
          } else {
            this.visibleQuestionTypes = { ...this.questionsByCategory };
          }
          this.questionChanges.emit(false);
        }else{
          this.questionChanges.emit(false);
        }
      },
      error: (err) => {
        this.questionChanges.emit(false);
        this.toastService.showError('', err.error.message);
      }
    });
  }

  groupQuestionsByCategory(data: any[]): { [key: string]: any[] } {
    return data.reduce((acc, question) => {
      const category = question.category.toLowerCase();
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(question);
      return acc;
    }, {});
  }
  

  onLegendToggle(selectedLegend: any) {
    selectedLegend.isSelected = !selectedLegend.isSelected;
    if (selectedLegend.isSelected) {
      this.visibleQuestionTypes[selectedLegend.name] = this.questionsByCategory[selectedLegend.name];
    } else {
      delete this.visibleQuestionTypes[selectedLegend.name];
    }
  }

  openAddQuestionDialog() {
    this.addQuestionVisible = true;
    this.newQuestion = '';
    this.selectQuestionType = undefined;
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }
  checkBoxChecked(){
   this.relevantBtnActiveInactive =  Object.values(this.visibleQuestionTypes).flat().some(question => question.checked); 
  }

  showDeleteConfirmDialog() {
    this.deleteConfirmVisible = true;
  }

  cancelEdit(question: any) {
    question.checked = false;
    question.question = question.original_question;
  }

  updateQuestion(question: any) {
    question.checked = false;
    question.is_edited = true;
    question.original_question = question.question;
  }

  downloadQuestion() {
    this.questionChanges.emit(true);
    this.solutionService.downloadQuestion(this.selectedSolutionID, this.selectedAdditionalContextID).subscribe({
      next: (res) => {
        if(res){
        const fileName = 'download.docx';
        this.saveFile(res, fileName);
        this.questionChanges.emit(false);
        this.toastService.showSuccess('success', 'Downloaded successfully');
        }else{
          this.questionChanges.emit(false);
        }
      },
      error: err => {
        this.questionChanges.emit(false);
      }
    }
    );
  }

  deleteQuestions() {
    this.questionChanges.emit(true);
    const selectedToBeDeleted = Object.values(this.visibleQuestionTypes).flat().filter(question => question.checked)
      .map(question => question.question_id) || [];
      if(selectedToBeDeleted.length){
        this.solutionService.bulkDeleteQuestion(this.selectedSolutionID, this.selectedAdditionalContextID, selectedToBeDeleted).subscribe((res) => {
          if (res.is_success) {
            this.deleteConfirmVisible = false;
            this.getAllQuestion();
            this.toastService.showSuccess('success', 'Question deleted successfully');
          }else{
            this.questionChanges.emit(false);
          }
        });
      }else{
        this.questionChanges.emit(false);
        this.toastService.showError('error', 'Please select the question to delete');
      }
    
  }

  AddQuestion() {
    this.questionChanges.emit(true);
    this.addQuestionVisible = true;
    if(this.newQuestion.length && this.selectQuestionType){
      const InputJson = {
        "question": this.newQuestion,
        "category": this.selectQuestionType?.name ?? ''
      }
      this.solutionService.addQuestion(this.selectedSolutionID, this.selectedAdditionalContextID, InputJson).subscribe({
        next: (res) => {
          if (res.is_success) {
            this.addQuestionVisible = false;
            this.questionChanges.emit(false);
            this.toastService.showSuccess('success', 'Question created successfully');
            this.getAllQuestion();
          }else{
            this.addQuestionVisible = true;
            this.questionChanges.emit(false);
            this.toastService.showWarn('Warning','Question already exists');
          }
        },
        error: (err) => {
          this.addQuestionVisible = false;
          this.questionChanges.emit(false);
        }
      });
    }
    
  }

  /* editQuestion(question: QuestionDataFormat) {
    const InputJson = {
      "question": question.question,
      "category": question.category,
      "is_relevant": true
    }
    this.solutionService.editQuestion(this.selectedSolutionID, this.selectedAdditionalContextID, question.question_id, InputJson).subscribe(
      (res) => {
      }, err => console.log(err)
    );
  } */

  saveQuestions() {
    this.questionChanges.emit(true);
    this.bulkEditQuestion();
  }

  bulkEditQuestion() {
    const questionsToSave = (Object.values(this.visibleQuestionTypes).flat())
    .map(({question, category, is_relevant, question_id}) => ({question, category, is_relevant, question_id}));
    this.solutionService.bulkEditQuestion(this.selectedSolutionID, this.selectedAdditionalContextID, questionsToSave).subscribe({
      next: (res) => {
        if(res.is_success){
          this.isEditMode = false;
          Object.values(this.visibleQuestionTypes).flat().forEach(question => {
            question.checked = false;
          });
          this.questionChanges.emit(false);
          this.toastService.showSuccess('success', 'Saved Successfully');
          this.getAllQuestion();
          this.route.navigate(['post-workshop/transcript', this.selectedSolutionID, this.selectedAdditionalContextID]);
        }else{
          this.toastService.showWarn('Warn', 'Question Saved is failed');
          this.questionChanges.emit(false);
        }
        
      },
      error: (err) => { this.questionChanges.emit(false); }
    }
    );
  }

  markQuestion(is_relevant: boolean) {
   Object.keys(this.visibleQuestionTypes).forEach(category => {
      this.visibleQuestionTypes[category] = this.visibleQuestionTypes[category].map(question => {
        if (question.checked) {
          question.checked = false;
          question.is_relevant = is_relevant;
          question.tag = is_relevant ? 'Relevant' : 'Irrelevant';
        }
        return question;
      });
    });
  }

  /*bulkChangeRelevant(flag: string) {
    const InputJson = [
      {
        "is_relevant": flag == 'Relevant' ? true : false,
        "question_id": "d6108edc-b4c3-4e33-96ff-02838ebb1b51"
      }
    ]
    this.solutionService.changeRelevant(this.selectedSolutionID, this.selectedAdditionalContextID, InputJson).subscribe(
      (res) => {
      },
      (err) => { console.log(err) }
    );
  } */

    saveFile(blob: Blob, fileName: string) {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
  
      // Clean up
      window.URL.revokeObjectURL(url);
    }

    extractFileName(contentDisposition: string | null): string | null {
      if (!contentDisposition) return null;
      const match = RegExp(/filename="?(.+)"?/).exec(contentDisposition);
      return match ? match[1] : null;
    }

}