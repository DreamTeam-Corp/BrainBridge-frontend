import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SubmissionModel } from './submission.model';

const BACKEND_URL = environment.apiUrl + '/submission/';
@Injectable({
  providedIn: 'root',
})
export class SubmissionService {
  constructor(private http: HttpClient) {}

  getSubmission(subId: string) {
    return this.http.get<{
      message: string;
      submission: SubmissionModel;
    }>(BACKEND_URL + 'getsubmission/' + subId);
  }
  getFullSubmission(subId: string) {
    return this.http.get<{ message: string; submission: [any] }>(
      BACKEND_URL + 'getsubmissionf/' + subId
    );
  }
  getSubmissions(classId: string) {
    return this.http.get<{ message: string; submission: SubmissionModel[] }>(
      BACKEND_URL + 'getsubmissionids/' + classId
    );
  }
  uploadSubmission(subData: FormData, subId: string) {
    return this.http
      .put<{ message: string }>(
        BACKEND_URL + 'uploadsubmission/' + subId,
        subData
      )
      .subscribe(
        (response) => {
          console.log(response.message);
          // Можно добавить дополнительную логику успешной загрузки
        },
        (error) => {
          console.log('Error uploading file:', error);
          if (error.error && error.error.message) {
            console.log('Server error message:', error.error.message);
          }
        }
      );
  }
  deleteUpload(
    subId: string,
    subData: {
      name: string;
      enrollment_no: number;
      file: string;
      upload_time: Date;
    }
  ) {
    this.http
      .put<{ message: string }>(
        BACKEND_URL + 'deletesubmission/' + subId,
        subData
      )
      .subscribe(
        (response) => {
          console.log(response.message);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
