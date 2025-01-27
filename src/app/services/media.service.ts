import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  fileSizeUnit: number = 5 * 1024 * 1024;
  public isApiSetup = true;
  token: string = '';

  constructor(private readonly http: HttpClient) {

  }

  getFileSize(fileSize: number): number {
    if (fileSize > 0) {
      if (fileSize < this.fileSizeUnit * this.fileSizeUnit) {
        fileSize = parseFloat((fileSize / this.fileSizeUnit).toFixed(2));
      } else if (
        fileSize <
        this.fileSizeUnit * this.fileSizeUnit * this.fileSizeUnit
      ) {
        fileSize = parseFloat(
          (fileSize / this.fileSizeUnit / this.fileSizeUnit).toFixed(2)
        );
      }
    }

    return fileSize;
  }

  getFileSizeUnit(fileSize: number) {
    let fileSizeInWords = '';

    if (fileSize > 0) {
      if (fileSize < this.fileSizeUnit) {
        fileSizeInWords = 'bytes';
      } else if (fileSize < this.fileSizeUnit * this.fileSizeUnit) {
        fileSizeInWords = 'KB';
      } else if (
        fileSize <
        this.fileSizeUnit * this.fileSizeUnit * this.fileSizeUnit
      ) {
        fileSizeInWords = 'MB';
      }
    }

    return fileSizeInWords;
  }

  uploadMedia(formData: any, solution_id: string, context_id: string) {
    const baseUrl = environment.apiUrl;
    this.token = localStorage.getItem('authToken') ?? '';
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${this.token}`
  })
    return this.http
      .post(`${baseUrl}/solutions/${solution_id}/files/`, formData, {
        headers,
        observe: 'events', 
        reportProgress: true, 
      })
      .pipe(
        map((event: any) => {
          // Check if the event is an UploadProgress event
          if (event.type === HttpEventType.UploadProgress) {
            const progress = event.total
              ? Math.round((100 * event.loaded) / event.total)
              : 0; // Default to 0 if total is undefined
            return { status: 'progress', message: progress };
          }

          // Handle other event types such as HttpResponse
          if (event instanceof HttpResponse) {
            return event.body;
          }

          // Return other events as a default case
          return `Unhandled event: ${event.type}`;
        })
      );
  }
}
