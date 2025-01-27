import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, catchError, throwError } from 'rxjs';
import { SolutionForm } from '../interface/solution-form';
import { SolutionContextForm } from '../interface/solution-context-form';
import { GenerateQuestionForm, QuestionsResponse } from '../interface/generate-question-form';
import { AddQuestionForm } from '../interface/add-question-form';
import { environment } from '../environments/environment';
import { SolutionData } from '../interface/soltion-data';
@Injectable({
  providedIn: 'root'
})
export class SolutionService {
  baseUrl: string = environment.apiUrl;
  token: string = '';
  selectedSolutionID = new BehaviorSubject<string>('');
  selectedSolutionData = new BehaviorSubject<SolutionData>({
    "created_by": "",
    "updated_by": '',
    "created_at": "",
    "updated_at": "",
    "solution_name": " ",
    "solution_description": "",
    "solution_type": "",
    "id": "",
    "solution_id": ""
});
  selectedAdditionalContextID = new BehaviorSubject<string>('');
  get selectedSolutionID$(): Observable<string> {
    return this.selectedSolutionID.asObservable();
  }

  setSelectedSolutionID(id: string): void {
    this.selectedSolutionID.next(id);
  }

  /** 
   * Getter for selectedSolutionData observable 
   */
  get selectedSolutionData$(): Observable<any> {
    return this.selectedSolutionData.asObservable();
  }

  /** 
 * Setter for selectedSolutionData observable 
 * @param data - The solution data to set
 */
  setSelectedSolutionData(data: any): void {
    this.selectedSolutionData.next(data);
  }

  constructor(private readonly http: HttpClient) {}

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
   * Fetches a new solution ID
   * @returns Observable of the new solution ID
   */
  getNewSolutionID(): Observable<any> {
    return this.http.get(`${this.baseUrl}/solutions/next`, { headers: this.getHeader() }).pipe(
      catchError((error) => {
        console.error('Error caught in the service:', error);
        return throwError(() => error);
      })
    );
  }

  getWorkbenchManual(): Observable<any> {
    return this.http.get(`${this.baseUrl}/download-user-manual`, { headers: this.getHeader() }).pipe(
      catchError((error) => {
        console.error('Error caught in the service:', error);
        return throwError(() => error);
      })
    );
  }
  
  downloadManual(url: string): Observable<any>{
    return this.http.get(url, { headers: this.getHeader() }).pipe(
      catchError((error) => {
        console.error('Error caught in the service:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Fetches solutions based on search criteria, pagination, and sorting
   * @param searchTerm - Search term for filtering results
   * @param page - Page number for pagination
   * @param pageSize - Number of results per page
   * @returns Observable of solutions
   */
  getSolution(searchTerm: string, page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('search_term', searchTerm)
      .set('page', page)
      .set('page_size', pageSize)
      .set('sort_field', 'updated_at')
      .set('sort_order', 'dsc');
    return this.http.get(`${this.baseUrl}/solutions/`, { params, headers: this.getHeader() }).pipe(
      catchError((error) => {
        console.error('Error caught in getSolution:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Creates a new solution
   * @param inputData - The solution data to create
   * @returns Observable of the created solution
   */
  createSolution(inputData: SolutionForm): Observable<any> {
    return this.http.post(`${this.baseUrl}/solutions/`, inputData, { headers:this.getHeader() }).pipe(
      catchError((error) => {
        console.error('Error caught in createSolution:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Fetches a solution by its ID
   * @param solID - The ID of the solution to fetch
   * @returns Observable of the solution
   */
  getSolutionById(solID: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/solutions/${solID}`, { headers: this.getHeader() }).pipe(
      catchError((error) => {
        console.error('Error caught in the service:', error);
        return throwError(() => error);
      })
    );
  }


  /**
   * Creates a new solution context
   * @param inputData - The solution context data to create
   * @param ID - The solution ID for the context
   * @returns Observable of the created context
   */
  createSolutionContext(inputData: SolutionContextForm, ID: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/solutions/${ID}/contexts/`, inputData, { headers: this.getHeader() }).pipe(
      catchError((error) => {
        console.error('Error caught in createSolutionContext:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Fetches a solution context by ID
   * @param ID - The ID of the solution context
   * @returns Observable of the context data
   */
  getSolutionContext(ID: string): Observable<any> {
    const params = new HttpParams()
      .set('search_term', "")
      .set('page', 1)
      .set('page_size', 1)
      .set('sort_field', 'updated_at')
      .set('sort_order', 'dsc');

    return this.http.get(`${this.baseUrl}/solutions/${ID}/contexts/`, { params, headers: this.getHeader() }).pipe(
      catchError((error) => {
        console.error('Error caught in getSolutionContext:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Updates a solution context
   * @param inputData - The new solution context data
   * @param ID - The solution ID
   * @param ContextID - The context ID to update
   * @returns Observable of the updated context
   */
  updateSolutionContext(inputData: SolutionContextForm, ID: string, ContextID: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/solutions/${ID}/contexts/${ContextID}`, inputData, { headers: this.getHeader() }).pipe(
      catchError((error) => {
        console.error('Error caught in updateSolutionContext:', error);
        return throwError(() => error);
      })
    );
  }


  /**
   * Fetches all questions for a given solution context
   * @param solID - The solution ID
   * @param conID - The context ID
   * @returns Observable of questions
   */
  getallQuestions(solID: string, conID: string): Observable<QuestionsResponse> {
    return this.http.get<QuestionsResponse>(`${this.baseUrl}/solutions/${solID}/contexts/${conID}/questions`, {
      headers: this.getHeader()
    }).pipe(
      catchError((error) => {
        console.error('Error caught in getallQuestions:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Generates questions based on provided input data
   * @param solID - The solution ID
   * @param conID - The context ID
   * @param InputJson - The data to generate questions
   * @returns Observable of generated questions
   */
  generateQuestions(solID: string, conID: any, InputJson: GenerateQuestionForm): Observable<any> {
    return this.http.post(`${this.baseUrl}/solutions/${solID}/contexts/${conID}/questions/generate`, InputJson, { headers: this.getHeader() }).pipe(
      catchError((error) => {
        console.error('Error caught in generateQuestions:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Adds a new question to a solution context
   * @param solID - The solution ID
   * @param conID - The context ID
   * @param inputJson - The data for the new question
   * @returns Observable of the added question
   */
  addQuestion(solID: string, conID: string, inputJson: AddQuestionForm): Observable<any> {
    return this.http.post(`${this.baseUrl}/solutions/${solID}/contexts/${conID}/questions/`, inputJson, { headers: this.getHeader() }).pipe(
      catchError((error) => {
        console.error('Error caught in addQuestion:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Deletes a question by its ID
   * @param solID - The solution ID
   * @param conID - The context ID
   * @param QuesID - The question ID to delete
   * @returns Observable of the delete operation
   */
  deleteQuestion(solID: string, conID: string, QuesID: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/solutions/${solID}/contexts/${conID}/questions/${QuesID}`, { headers: this.getHeader() }).pipe(
      catchError((error) => {
        console.error('Error caught in deleteQuestion:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Deletes multiple questions based on IDs
   * @param solID - The solution ID
   * @param conID - The context ID
   * @param questionIDs - The array of question IDs to delete
   * @returns Observable of the delete operation
   */
  bulkDeleteQuestion(solID: string, conID: string, questionIDs: Array<string>): Observable<any> {
    return this.http.delete(`${this.baseUrl}/solutions/${solID}/contexts/${conID}/questions`, { headers: this.getHeader(), body: questionIDs }).pipe(
      catchError((error) => {
        console.error('Error caught in bulkDeleteQuestion:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Edits an existing question
   * @param solID - The solution ID
   * @param conID - The context ID
   * @param QuesID - The question ID to edit
   * @param InputJson - The new data for the question
   * @returns Observable of the updated question
   */
  editQuestion(solID: string, conID: string, QuesID: any, InputJson: AddQuestionForm): Observable<any> {
    return this.http.put(`${this.baseUrl}/solutions/${solID}/contexts/${conID}/questions/${QuesID}`, InputJson, { headers: this.getHeader() }).pipe(
      catchError((error) => {
        console.error('Error caught in editQuestion:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Edits multiple questions at once
   * @param solID - The solution ID
   * @param conID - The context ID
   * @param InputJson - The new data for multiple questions
   * @returns Observable of the update operation
   */
  bulkEditQuestion(solID: string, conID: string, InputJson: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/solutions/${solID}/contexts/${conID}/questions`, InputJson, { headers: this.getHeader() }).pipe(
      catchError((error) => {
        console.error('Error caught in bulkEditQuestion:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Deletes a file associated with a solution context
   * @param solID - The solution ID
   * @param conID - The context ID
   * @param fileName - The name of the file to delete
   * @returns Observable of the delete operation
   */
  deleteFile(solID: string, conID: string, filePath: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/solutions/${solID}/files/?file_name=${filePath}`, { headers: this.getHeader() }).pipe(
      catchError((error) => {
        console.error('Error caught in deleteFile:', error);
        return throwError(() => error);
      })
    );
  }

  // Change Bulk Relevant Change
  // changeRelevant(solID: string, conID: string, InputJson:any): Observable<any> {
  //   return this.http.put(`${this.baseUrl}/solutions/${solID}/contexts/${conID}/questions-relevancy`, InputJson, { headers: this.headers });
  // }

  /**
   * Downloads questions for a given solution context
   * @param solID - The solution ID
   * @param conID - The context ID
   * @returns Observable of the blob data for downloading
   */
  downloadQuestion(solID: string, conID: string): Observable<any> {
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });
    return this.http.get(`${this.baseUrl}/solutions/${solID}/contexts/${conID}/questions/download`, { headers: headers, responseType: 'blob' }).pipe(
      catchError((error) => {
        console.error('Error caught in downloadQuestion:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Retrieves all files associated with a solution context
   * @param solID - The solution ID
   * @param conID - The context ID
   * @returns Observable of file data
   */
  getFiles(solID: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/solutions/${solID}/files/`, { headers: this.getHeader() }).pipe(
      catchError((error) => {
        console.error('Error caught in getFiles:', error);
        return throwError(() => error);
      })
    );
  }

}
