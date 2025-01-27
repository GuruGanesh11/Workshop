import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { UpdateEpicData, CreateEpicData, CreateFeature, UpdateFeature } from '../interface/epic-creation';
import { getEpicList } from '../models/epic';

@Injectable({
  providedIn: 'root'
})
export class EpicService {
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
  /** Epics Api Call */
  /**
* Creates a new epic within a specific solution and context.
* 
* @param solID - The unique identifier of the solution.
* @param contextID - The unique identifier of the context.
* @param inputJson - The data for the new epic in the `CreateEpicData` format.
* @returns Observable<any> - An observable emitting the HTTP response or an error.
*/
  createEpic(solID: string, contextID: string, InputJson: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/solutions/${solID}/contexts/${contextID}/epics/`, InputJson, { headers: this.getHeader(), }).pipe(
      catchError((error) => {
        console.error('Error caught in the service:', error);
        return throwError(() => error);
      })
    );
  }

  /**
  * Fetches the list of epics for a specific solution and context.
  * @param solID - The unique identifier of the solution.
  * @param contextID - The unique identifier of the context.
  * @returns Observable<any> - An observable emitting the list of epics or an error.
  */
  getEpicList(solID: string, contextID: string): Observable<any> {
    return(of(getEpicList))
    return this.http.get(`${this.baseUrl}/solutions/${solID}/contexts/${contextID}/epics`, { headers: this.getHeader() }).pipe(
      catchError((error) => {
        console.error('Error caught in the service:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Fetches detailed data for a specific epic within a solution and context.
   * @param solID - The unique identifier of the solution.
   * @param contextID - The unique identifier of the context.
   * @param epicID - The unique identifier of the epic to fetch.
   * @returns Observable<any> - An observable emitting the epic data or an error.
   */
  getEpicDataByID(solID: string, contextID: string, epicID: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/solutions/${solID}/contexts/${contextID}/epics/${epicID}`, { headers: this.getHeader() }).pipe(
      catchError((error) => {
        console.error('Error caught in the service:', error);
        return throwError(() => error);
      })
    );
  }

  /**
 * Updates the data of a specific epic within a solution and context.
 * @param solID - The unique identifier of the solution.
 * @param contextID - The unique identifier of the context.
 * @param epicID - The unique identifier of the epic to update.
 * @param InputJason - The updated epic data in the `UpdateEpicData` format.
 * @returns Observable<any> - An observable emitting the HTTP response or an error.
 */
  updateEpicDataByID(solID: string, contextID: string, epicID: string, InputJason: UpdateEpicData): Observable<any> {
    return this.http.post(`${this.baseUrl}/solutions/${solID}/contexts/${contextID}/epics/${epicID}`, InputJason, { headers: this.getHeader() }).pipe(
      catchError((error) => {
        console.error('Error caught in the service:', error);
        return throwError(() => error);
      })
    );
  }

  /**
 * Deletes a specific epic within a solution and context.
 * 
 * @param solID - The unique identifier of the solution.
 * @param contextID - The unique identifier of the context.
 * @param epicID - The unique identifier of the epic to delete.
 * @returns Observable<any> - An observable emitting the HTTP response or an error message in case of failure.
 */
  deleteEpicDataByID(solID: string, contextID: string, epicID: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/solutions/${solID}/contexts/${contextID}/epics/${epicID}`, { headers: this.getHeader() }).pipe(
      catchError((error) => {
        console.error('Error caught in the service:', error);
        return throwError(() => error);
      })
    );
  }

  /**
* Deletes a specific document within an epic, solution, and context.
* 
* @param solID - The unique identifier of the solution.
* @param contextID - The unique identifier of the context.
* @param epicID - The unique identifier of the epic.
* @param docPath - The path of the document to delete.
* @returns Observable<any> - An observable emitting the HTTP response or an error.
*/
  deleteEpicDocByID(solID: string, contextID: string, epicID: string, docPath: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/solutions/${solID}/contexts/${contextID}/epics/${epicID}/document?document_path=${docPath}`, { headers: this.getHeader() }).pipe(
      catchError((error) => {
        console.error('Error caught in the service:', error);
        return throwError(() => error);
      })
    );
  }

  /**
 * Uploads files and an epic JSON payload as part of a multipart POST request.
 * 
 * @param formData - A FormData object containing the files and the epic JSON payload to upload.
 * @param solutionID - The unique identifier of the solution.
 * @param contextID - The unique identifier of the context.
 * @param epicID - The unique identifier of the epic.
 * @returns Observable<any> - An observable emitting progress updates, the HTTP response, or an error.
 */
  uploadEpicFiles(formData: any[], solution_id: string, contextID: string, epicID: string) {
    return this.http
      .post(`${this.baseUrl}/solutions/${solution_id}/contexts/${contextID}/epics/${epicID}/document`, formData, {
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
 * Generates a new epic within a specific solution and context.
 * 
 * @param solID - The unique identifier of the solution.
 * @param contextID - The unique identifier of the context.
 * @returns Observable<any> - An observable emitting the HTTP response or an error.
 */
  GenerateEpic(solID: string, contextID: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/solutions/${solID}/contexts/${contextID}/epics/generate`, { headers: this.getHeader() }).pipe(
      catchError((error) => {
        console.error('Error caught in the service:', error);
        return throwError(() => error);
      })
    );
  }

  /** Feature Api Call */

  /**
  * Creates a new feature within a specific solution and context.
  * 
  * @param solID - The unique identifier of the solution.
  * @param contextID - The unique identifier of the context.
  * @param InputJason - The data for the new feature in the `CreateFeature` format.
  * @returns Observable<any> - An observable emitting the HTTP response or an error.
  */
  createFeature(solID: string, contextID: string, InputJason: CreateFeature): Observable<any> {
    return this.http.post(`${this.baseUrl}/solutions/${solID}/contexts/${contextID}/epics/features`, InputJason, { headers: this.getHeader() }).pipe(
      catchError((error) => {
        console.error('Error caught in the service:', error);
        return throwError(() => error);
      })
    );
  }

  /**
 * Fetches the details of a specific epic within a solution and context.
 * 
 * @param solID - The unique identifier of the solution.
 * @param contextID - The unique identifier of the context.
 * @param epicID - The unique identifier of the epic.
 * @returns Observable<any> - An observable emitting the epic details or an error.
 */
  getFeatureList(solID: string, contextID: string, epicID: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/solutions/${solID}/contexts/${contextID}/epics/${epicID}/features`, { headers: this.getHeader() }).pipe(
      catchError((error) => {
        console.error('Error caught in the service:', error);
        return throwError(() => error);
      })
    );
  }

  /**
 * Fetches the details of a specific feature within a given epic, solution, and context.
 * 
 * @param solID - The unique identifier of the solution.
 * @param contextID - The unique identifier of the context.
 * @param epicID - The unique identifier of the epic.
 * @param featureID - The unique identifier of the feature.
 * @returns Observable<any> - An observable emitting the feature details or an error.
 */
  getFeatureListByID(solID: string, contextID: string, epicID: string, featureID: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/solutions/${solID}/contexts/${contextID}/epics/${epicID}/features/${featureID}`, { headers: this.getHeader() }).pipe(
      catchError((error) => {
        console.error('Error caught in the service:', error);
        return throwError(() => error);
      })
    );
  }

  /**
 * Updates the data of a specific feature within an epic, solution, and context.
 * 
 * @param solID - The unique identifier of the solution.
 * @param contextID - The unique identifier of the context.
 * @param epicID - The unique identifier of the epic.
 * @param featureID - The unique identifier of the feature to update.
 * @param InputJason - The updated feature data in the `UpdateFeature` format.
 * @returns Observable<any> - An observable emitting the HTTP response or an error.
 */
  updateFeatureByID(solID: string, contextID: string, epicID: string, featureID: string, InputJason: UpdateFeature): Observable<any> {
    return this.http.post(`${this.baseUrl}/solutions/${solID}/contexts/${contextID}/epics/${epicID}/features/${featureID}`, InputJason, { headers: this.getHeader() }).pipe(
      catchError((error) => {
        console.error('Error caught in the service:', error);
        return throwError(() => error);
      })
    );
  }

  /**
 * Deletes a specific feature within an epic, solution, and context.
 * 
 * @param solID - The unique identifier of the solution.
 * @param contextID - The unique identifier of the context.
 * @param epicID - The unique identifier of the epic.
 * @param featureID - The unique identifier of the feature to delete.
 * @returns Observable<any> - An observable emitting the HTTP response or an error message in case of failure.
 */
  deleteFeatureByID(solID: string, contextID: string, epicID: string, featureID: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/solutions/${solID}/contexts/${contextID}/epics/${epicID}/features/${featureID}`, { headers: this.getHeader() }).pipe(
      catchError((error) => {
        console.error('Error caught in the service:', error);
        return throwError(() => error);
      })
    );
  }

}
