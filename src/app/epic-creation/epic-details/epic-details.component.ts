import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { Dropdown } from '../../interface/dropdown';
import { MediaService } from '../../services/media.service';

interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  image: string;
  price: number;
  epics: string;
  quantity: number;
  inventoryStatus: string;
  rating: number;
  checked: boolean;
  epicSid1:string;
  epicSid2:string;
  epicsDetail1:string;
  epicsDetails2:string;
  homePagePic: string;
  loginScreen:string;
  homepage:string;
  integration:string;
  integrationDetail:string;
}
@Component({
  selector: 'app-epic-details',
  templateUrl: './epic-details.component.html',
  styleUrl: './epic-details.component.scss',
  standalone: false
})

export class EpicDetailsComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

    userStories: Dropdown[] | undefined;
    selectUserStory: Dropdown | undefined;
    featureId: string = '';
    featureName: string = '';
    selectDescription: string = '';
    data: any;
    filteredCars!: Product[];
    generateVisible: boolean = false;
    epicVisible: boolean = false;
    selectedComponent: string = '';
    visible: boolean = false;
    products: Product[] = [];
    responsiveOptions: any[] | undefined;
    buttonDisabled: boolean = true;
    responseHeader: string = '';
    responseBody: string= '';
    successIcon: boolean = false;
    uploadedMedia: Array<any> = [];
    solutionType: Dropdown[] = [
      { name: 'Selenium'},
      { name: 'JUnit' },
      { name: 'pyTest' },
    ];
    selectSolutionType: Dropdown | undefined;
      items: MenuItem[] = []; 
      userItem: MenuItem[] | undefined;
      home: MenuItem | undefined;
      
    constructor(private readonly mediaService: MediaService) {}
  
    ngOnInit() {
      this.products = [
        {
          id: 'FET-002',
          code: 'f230fh0g3',
          name: 'Online Loan Application',
          description: 'Allows customers to apply for loans through a user-friendly web or mobile portal. The form captures personal details, income information, and loan requirements, eliminating the need for physical paperwork. Ensures that the LMS adheres to regulatory requirements such as Know Your Customer (KYC) and Anti-Money Laundering (AML).',
          image: 'bamboo-watch.jpg',
          price: 65,
          epics: 'Epics',
          epicSid1:'EC001',
          epicSid2:'EC002',
          epicsDetail1:'1.Navigate to the home page\n2.Click on apply for loan',
          epicsDetails2: 'Click on apply for loan',
          homePagePic: 'Homepage menu epic',
          loginScreen:'LoginScreen',
          homepage:'Homepage',
          integration:'Credit Scoring Integration',
          integrationDetail:'Automatically fetches the applicant’s credit score from credit bureaus (e.g., CIBIL, Experian) to assess creditworthiness. This helps loan officers make informed approval decisions. Automatically fetches the applicant’s credit score from credit bureaus (e.g., CIBIL, Experian) to assess creditworthiness. This helps loan officers make informed approval decisions. Automatically fetches the applicant’s credit score from credit bureaus (e.g., CIBIL, Experian) ',
          quantity: 24,
          inventoryStatus: 'INSTOCK',
          rating: 5,
          checked:false
        }
      ]
  
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

      this.userItem = [
        { 
          icon: 'pi pi-home',
          route: '/installation' 
        }, 

        { 
          label: 'Components' ,
          inventoryStatus: 'INSTOCK'
        }, 

        { 
          label: 'Form' 
        }, 

        { 
          label: 'InputText',
          route: '/inputtext' 
        }
      ];
      this.userStories = [
        { name: 'New York' },
        { name: 'Rome' },
        { name: 'London' },
        { name: 'Istanbul' },
        { name: 'Paris' }
    ];      
    }

    showDialog() {
      this.visible = true;
    }
  
    productButtonDisabled(id: string) {
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

    epicDetails() {
      this.epicVisible = true;
    }

    onBreadcrumbClick(item: any) {
      this.selectedComponent = item.label; 
  }
    
    createSolution(createSolutionForm: any) {
      console.log("selectDescription:", this.selectDescription);
      if (createSolutionForm.valid) {
        const formData = {
          featureId: this.featureId,
          featureName: this.featureName,
          description: this.selectDescription,
          uploadedFiles: this.uploadedMedia
        };
  
        // Handle form submission, e.g., send data to the server'
        this.data = formData;
        console.log('Form Data:', this.data);
      } else {
        console.log('Form is invalid');
      }
    }
  
  
    onConfirm() {
      console.log('Feature ID:', this.featureId);
      console.log('Feature Name:', this.featureName);
      console.log('Description:', this.selectDescription);
      this.showConfirmedData();
    }
  
    showConfirmedData() {
      const confirmedData = {
        featureId: this.featureId,
        featureName: this.featureName,
        selectDescription: this.selectDescription
      };
      return confirmedData;
    }
  
  resetForm() {
    console.log('Reset Data');
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
            FileProgessSize: 0,
            FileProgress: 0,
            ngUnsubscribe: new Subject<any>(),
          });
  
          this.startProgress(file, this.uploadedMedia.length - 1);
        };
      }
    }
  
    async startProgress(file: any, fileIndex: any) {
        let filteredFile = this.uploadedMedia
          .filter((u, index) => index === fileIndex)
          .pop();
    
        if (filteredFile != null) {
          let fileSize = this.mediaService.getFileSize(file.size);
          let fileSizeInWords = this.mediaService.getFileSizeUnit(file.size);
          if (this.mediaService.isApiSetup) {
            let formData = new FormData();
            formData.append('File', file);
    
            this.mediaService
              .uploadMedia(formData, 'solutionId', 'contextId')
              .pipe(takeUntil(file.ngUnsubscribe))
              .subscribe({
                next: (res: any) => {
                  if (res.status === 'progress') {
                    let completedPercentage = parseFloat(res.message);
                    filteredFile.FileProgessSize = `${(
                      (fileSize * completedPercentage) /
                      100
                    ).toFixed(2)} ${fileSizeInWords}`;
                    filteredFile.FileProgress = completedPercentage;
                  } else if (res.status === 'completed') {
                    filteredFile.Id = res.Id;
    
                    filteredFile.FileProgessSize = fileSize + ' ' + fileSizeInWords;
                    filteredFile.FileProgress = 100;
                  }
                },
                error: (error: any) => {
                  console.log('file upload error');
                  console.log(error);
                }
                
              });
          } else {
            for (
              let f = 0;
              f < fileSize + fileSize * 0.0001;
              f += fileSize * 0.01
            ) {
              filteredFile.FileProgessSize = f.toFixed(2) + ' ' + fileSizeInWords;
              let percentUploaded = Math.round((f / fileSize) * 100);
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
}
