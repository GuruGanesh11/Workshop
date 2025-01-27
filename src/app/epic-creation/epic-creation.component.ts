import { Component, ElementRef, ViewChild } from '@angular/core';
import { MediaService } from '../services/media.service';
import { Dropdown } from '../interface/dropdown';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../interface/epic-creation';
import { EpicService } from '../services/epic.service';
import { ActivatedRoute } from '@angular/router';
import { ToastMessageService } from '../services/toast-message.service';
import { ConfirmPopup } from 'primeng/confirmpopup';

@Component({
  selector: 'app-epic-creation',
  templateUrl: './epic-creation.component.html',
  styleUrl: './epic-creation.component.scss',
  standalone: false
})

export class EpicCreationComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  loading: boolean = false;
  featureId: string = '';
  featureName: string = '';
  selectDescription: string = '';
  data: any;
  filteredCars!: Product[];
  generateVisible: boolean = false;
  visible: boolean = false;
  products: Product[] = [];
  responsiveOptions: any[] | undefined;
  buttonDisabled: boolean = true;
  responseHeader: string = '';
  responseBody: string= '';
  successIcon: boolean = false;
  selectSolutionType: Dropdown | undefined;
  uploadedMedia: Array<any> = [];
  solutionType: Dropdown[] = [];
  items: MenuItem[] = []; 
  solutionID: string = '';
  additionalContextID: string = '';
  selectedFileName: any = []

  constructor(private readonly mediaService: MediaService, private readonly epicService: EpicService, private readonly route: ActivatedRoute, private readonly toastService: ToastMessageService, private confirmationService: ConfirmationService, private messageService: MessageService) {}
  @ViewChild(ConfirmPopup) confirmPopup!: ConfirmPopup;

  ngOnInit() {
    this.solutionID = this.route.snapshot.paramMap.get('solutionID') ?? '';
    this.additionalContextID = this.route.snapshot.paramMap.get('contextID') ?? '';
    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
      }
    ];

    this.solutionType = [
      { name: 'Selenium' },
      { name: 'JUnit' },
      { name: 'Appium'},
    ];
    this.getEpicList();
  }

  confirm(event: Event) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Save your current process?',
        accept: () => {
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
}

  
  showDialog() {
    this.visible = true;
  }

  productButtonDisabled(id: number) {
    this.buttonDisabled = false;
  }

  showGenerate(response: string) {
    if( response === 'success'){
      this.responseHeader = 'Successfully Generated!';
      this.responseBody = 'User stories and test cases generated successfully';
      this.successIcon = true;
    } else {
        this.responseHeader = 'Error Generated!';
        this.responseBody = 'User stories and test cases generated Error!';
        this.successIcon = false;
    }
      this.generateVisible = true;
  }

  createSolution(createSolutionForm: any) {
    console.log("selectDescription:", this.selectDescription);
    if (createSolutionForm.valid) {
      // Access all the form data
      const formData = {
        featureId: this.featureId,
        featureName: this.featureName,
        description: this.selectDescription,
        uploadedFiles: this.uploadedMedia // Assuming this holds the file data
      };

      // Handle form submission, e.g., send data to the server'
      this.data = formData;
      console.log('Form Data:', this.data);
    } else {
      console.log('Form is invalid');
    }
  }


  onConfirm() {
    // You can process the form data here
    console.log('Feature ID:', this.featureId);
    console.log('Feature Name:', this.featureName);
    console.log('Description:', this.selectDescription);

    // Optionally, you can show these values in another section of the UI
    // For example, setting them to another variable that displays the values
    // after confirmation.
    this.showConfirmedData();
  }

  // Method to show the confirmed data (this could be a separate section in the HTML)
  showConfirmedData() {
    // You can define a variable to hold the confirmed data
    const confirmedData = {
      featureId: this.featureId,
      featureName: this.featureName,
      selectDescription: this.selectDescription
    };

    console.log('Confirmed Data:', confirmedData);
    
    // You could display this data in another section, or use it as needed.
  }


triggerFileInput() {
  this.fileInput.nativeElement.click();
}

onFileChange(event: any) {
  const file = event.target.files[0];
  if (file) {
    console.log('File selected:', file.name);
  }
}

onFileBrowse(event: Event) {
  const target = event.target as HTMLInputElement;
  this.processFiles(target.files);
}

processFiles(files:any) {
    for (const file of files) {
      var reader = new FileReader();
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
          FileProgessSize: 0,
          FileProgress: 0,
          ngUnsubscribe: new Subject<any>(),
        });

        this.startProgress(file, this.uploadedMedia.length - 1);
      };
    }
  }

  async startProgress(file: any, index: any) {
      let filteredFile = this.uploadedMedia
        .filter((u, index) => index === index)
        .pop();
  
      if (filteredFile != null) {
        this.selectedFileName.push(file.name);
        let fileSize = this.mediaService.getFileSize(file.size);
        let fileSizeInWords = this.mediaService.getFileSizeUnit(file.size);
        if (this.mediaService.isApiSetup) {
          let formData = new FormData();
          formData.append('documents', file);
  
          // this.mediaService
          //   .uploadMedia(formData, 'solutionId', 'contextId')
          //   .pipe(takeUntil(file.ngUnsubscribe))
          //   .subscribe(
          //     (res: any) => {
          //       if (res.status === 'progress') {
          //         let completedPercentage = parseFloat(res.message);
          //         filteredFile.FileProgessSize = `${(
          //           (fileSize * completedPercentage) /
          //           100
          //         ).toFixed(2)} ${fileSizeInWords}`;
          //         filteredFile.FileProgress = completedPercentage;
          //       } else if (res.status === 'completed') {
          //         filteredFile.Id = res.Id;
  
          //         filteredFile.FileProgessSize = fileSize + ' ' + fileSizeInWords;
          //         filteredFile.FileProgress = 100;
          //       }
          //     },
          //     (error: any) => {
          //       console.log('file upload error');
          //       console.log(error);
          //     }
          //   );
        } else {
          for (
            var f = 0;
            f < fileSize + fileSize * 0.0001;
            f += fileSize * 0.01
          ) {
            filteredFile.FileProgessSize = f.toFixed(2) + ' ' + fileSizeInWords;
            var percentUploaded = Math.round((f / fileSize) * 100);
            filteredFile.FileProgress = percentUploaded;
            await this.fakeWaiter(Math.floor(Math.random() * 35) + 1);
          }
        }
      }
    }
  
    fakeWaiter(ms: number) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }
  
    removeImage(idx: number) {
      this.uploadedMedia = this.uploadedMedia.filter((u, index) => index !== idx);
    }

getEpicList(){
  this.loading = true;
  this.epicService.getEpicList(this.solutionID, this.additionalContextID).subscribe({
    next: (res) => {
      if(res.is_success){
        this.products = res.data.map((item: any) => ({
          id: item.epic_id,
          name: item.title,
          description: item.description,
          image: 'bamboo-watch.jpg',
          checked: false
        }));
        this.loading = false;
        this.toastService.showSuccess('Success', 'Epic Data Get Successfully!');
      }else {
        this.products = [];
        this.loading = false;
      }
    },
    error: (err) => {
      this.products = [];
      this.loading = false;
    }
  });
}

createEpic(){

  const inputJson = {
    'documents': this.selectedFileName .join(','),
    'epic': {"title":"update File","description":"Get epic"}
  };
  this.epicService.createEpic(this.solutionID, this.additionalContextID, inputJson).subscribe({
    next: (res) => {
      if(res.is_success){
        
      }
    },
  });
}


}
