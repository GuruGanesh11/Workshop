import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { UpdateAdditionalContext, UpdateQuestion } from '../interface/post-workshop';

@Injectable({
  providedIn: 'root'
})
export class PostWorkshopService {
  token: string = '';
  baseUrl: string = environment.apiUrl;

  constructor(private readonly http: HttpClient) { }

  getHeader() {
    this.token = localStorage.getItem('authToken') ?? '';
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${this.token}`,
      'Access-Control-Allow-Origin': '*'
    });
    return headers;
  }

  /**
* Retrieves all workshop questions for a specific solution and context.
* @param solID - The unique identifier of the solution.
* @param contextID - The unique identifier of the context.
* @returns Observable<any> - An observable emitting the list of workshop questions or an error.
*/
  getAllWorkshopQuestion(solID: string, contextID: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/solutions/${solID}/contexts/${contextID}/workshop/questions`, { headers: this.getHeader() }).pipe(
      catchError((error) => {
        console.error('Error caught in the service:', error);
        return throwError(() => error);
      })
    );
  }

  /**
* Retrieves all workshop questions for a specific solution and context.
* @param solID - The unique identifier of the solution.
* @param contextID - The unique identifier of the context.
* @returns Observable<any> - An observable emitting the list of workshop questions or an error.
*/
getAllWorkshopFiles(solID: string, contextID: string): Observable<any> {
  return this.http.get(`${this.baseUrl}/solutions/${solID}/contexts/${contextID}/workshop/info`, { headers: this.getHeader() }).pipe(
    catchError((error) => {
      console.error('Error caught in the service:', error);
      return throwError(() => error);
    })
  );
}

  /**
* Updates workshop questions for a specific solution and context.
* @param solID - The unique identifier of the solution.
* @param contextID - The unique identifier of the context.
* @param InputJson - An array of questions to update, adhering to the UpdateQuestion format.
* @returns Observable<any> - An observable emitting the HTTP response or an error.
*/
  updateWorkshopQuestion(solID: string, contextID: string, InputJson: UpdateQuestion[]): Observable<any> {
    return this.http.put(`${this.baseUrl}/solutions/${solID}/contexts/${contextID}/workshop/questions`, InputJson, { headers: this.getHeader() }).pipe(
      catchError((error) => {
        console.error('Error caught in the service:', error);
        return throwError(() => error);
      })
    );
  }

   /**
* Updates workshop questions for a specific solution and context.
* @param solID - The unique identifier of the solution.
* @param contextID - The unique identifier of the context.
* @param InputJson - An array of questions to update, adhering to the UpdateQuestion format.
* @returns Observable<any> - An observable emitting the HTTP response or an error.
*/
updateWorkshopAdditionalContext(solID: string, contextID: string, InputJson: UpdateAdditionalContext): Observable<any> {
  return this.http.put(`${this.baseUrl}/solutions/${solID}/contexts/${contextID}/workshop/`, InputJson, { headers: this.getHeader() }).pipe(
    catchError((error) => {
      console.error('Error caught in the service:', error);
      return throwError(() => error);
    })
  );
}

    /**
* Uploads workshop files as part of a multipart POST request.
* Equivalent to the following curl command:
* 
* curl -X 'POST' \
*  'https://{baseUrl}/solutions/{solution_id}/contexts/{contextID}/workshop/transcripts' \
*  -H 'accept: application/json' \
*  -H 'Content-Type: multipart/form-data' \
*  -F 'files=@file1.pdf;type=application/pdf' \
*  -F 'files=@file2.pdf;type=application/pdf'
* 
* @param formData - An array of files to upload as part of the workshop transcripts.
* @param solution_id - The unique identifier of the solution.
* @param contextID - The unique identifier of the context.
* @returns Observable<any> - An observable emitting the HTTP response, progress updates, or an error.
*/
uploadWorkshopFiles(formData: any, solution_id: string, contextID: string) {
  return this.http
    .post(`${this.baseUrl}/solutions/${solution_id}/contexts/${contextID}/workshop/transcripts/upload`, formData, {
      headers: this.getHeader(),
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


  /**
 * Fetches the list of epics for a specific solution and context.
 * @param solID - The unique identifier of the solution.
 * @param contextID - The unique identifier of the context.
 * @returns Observable<any> - An observable emitting the list of epics or an error.
 */
  deleteWorkshopFile(solID: string, contextID: string, fileName: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/solutions/${solID}/contexts/${contextID}/workshop/transcripts?file_path=${fileName}`, { 
      headers: this.getHeader()
    }).pipe(
      catchError((error) => {
        console.error('Error caught in the service:', error);
        return throwError(() => error);
      })
    );
  }

   /**
* Updates workshop questions for a specific solution and context.
* @param solID - The unique identifier of the solution.
* @param contextID - The unique identifier of the context.
* @param InputJson - An array of questions to update, adhering to the UpdateQuestion format.
* @returns Observable<any> - An observable emitting the HTTP response or an error.
*/
updateQuestionValidationStatus(solID: string, contextID: string, InputJson: Array<UpdateQuestion>, validationStatus: boolean): Observable<any> {
  return this.http.put(`${this.baseUrl}/solutions/${solID}/contexts/${contextID}/workshop/questions/validation-status?is_validated=${validationStatus}`, InputJson, { headers: this.getHeader() }).pipe(
    catchError((error) => {
      console.error('Error caught in the service:', error);
      return throwError(() => error);
    })
  );
}

/**
* Retrieves all workshop questions for a specific solution and context.
* @param solID - The unique identifier of the solution.
* @param contextID - The unique identifier of the context.
* @returns Observable<any> - An observable emitting the list of workshop questions or an error.
*/
generateWorkshopAnswers(solID: string, contextID: string, InputJson: UpdateAdditionalContext): Observable<any> {
  return this.http.post(`${this.baseUrl}/solutions/${solID}/contexts/${contextID}/workshop/generate-answers`, InputJson, { headers: this.getHeader() }).pipe(
    catchError((error) => {
      console.error('Error caught in the service:', error);
      return throwError(() => error);
    })
  );
}

}
