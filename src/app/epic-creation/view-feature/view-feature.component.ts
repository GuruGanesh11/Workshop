import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MediaService } from '../../services/media.service';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-view-feature',
  imports: [ButtonModule,CommonModule, TagModule, InputTextareaModule, FormsModule, CheckboxModule, DialogModule, DropdownModule,MenuModule,HeaderComponent],
  templateUrl: './view-feature.component.html',
  styleUrl: './view-feature.component.scss'
})
export class ViewFeatureComponent {
  constructor(private readonly mediaService: MediaService) {}

  isEditMode = false;
  featureId: string = '';
   featureName: string = '';
   selectDescription:string='';
   uploadedMedia: Array<any> = [];
   visible: boolean = false;
   
   @Input() Formdata: any;

  //  ngOnInit() {
  //   // This will log the guruData when the component is initialized
  //   console.log('guruData:', this.guruData);
  // }
  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    // console.log(this.FormData);
    this.uploadedMedia = this.Formdata.uploadedFiles;
   console.log(this.uploadedMedia);
   
  }
   

   @ViewChild('fileInput') fileInput!: ElementRef;

   toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

   triggerFileInput() {
    this.fileInput.nativeElement.click();
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
          let fileSize = this.mediaService.getFileSize(file.size);
          let fileSizeInWords = this.mediaService.getFileSizeUnit(file.size);
          if (this.mediaService.isApiSetup) {
            let formData = new FormData();
            formData.append('File', file);
    
            this.mediaService
              .uploadMedia(formData, 'solutionId', 'contextId')
              .pipe(takeUntil(file.ngUnsubscribe))
              .subscribe(
                (res: any) => {
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
                (error: any) => {
                  console.log('file upload error');
                  console.log(error);
                }
              );
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
  

      isVisible: boolean = false;

      showDialog() {
          this.isVisible = true;
      }
      
}
