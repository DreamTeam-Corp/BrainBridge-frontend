import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';

const BACKEND_URL = environment.apiUrl + '/classroom/';
@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private http: HttpClient) {}

  getClassroomById(classId: string) {
    return this.http.get<{ message: string; classroom: any }>(
      BACKEND_URL + '/getclassroom/' + classId
    );
  }
  getClassroomByDS(department: string, semester: number) {
    return this.http.get<{ message: string; classroom: any }>(
      BACKEND_URL + '/classroomstudent/' + department + '/' + semester
    );
  }
  getNotification(classId: string) {
    return this.http.get<{
      message: string;
      subject_name: string;
      notification: [{ date: Date; content: string }];
      faculty: string;
    }>(BACKEND_URL + 'getnotification/' + classId);
  }
  getLecture(classId: string) {
    return this.http.get<{
      message: string;
      lecture: { subject_name: string; timing: any; join: string };
    }>(BACKEND_URL + 'getlecture/' + classId);
  }
  enrollClassroom(enrollData: {
    subject_name: string;
    subject_code: number;
    name: string;
    studentId: string;
    enrollment_no: number;
  }) {
    return this.http
      .put<{ message: string; classId: string }>(
        BACKEND_URL + 'enrollstudent',
        enrollData
      )
      .pipe(
        tap((response) => {
          const sData = { subject: response.classId };
          return this.http
            .put<{ message: string }>(
              environment.apiUrl + '/user/addsubject/' + enrollData.studentId,
              sData
            )
            .subscribe();
        })
      );
  }
  unenrollClassroom(
    classId: string,
    studentData: { name: string; _id: string; enrollment_no: number }
  ) {
    return this.http
      .put<{ message: string; classId: string }>(
        BACKEND_URL + 'unenrollstudent/' + classId,
        studentData
      )
      .pipe(
        tap((response) => {
          const sData = { subject: response.classId };
          return this.http
            .put<{ message: string }>(
              environment.apiUrl + '/user/clearsubject/' + studentData._id,
              sData
            )
            .subscribe();
        })
      );
  }
  unenrollAllClassrooms(userId: string) {
    this.http
      .put<{ message: string }>(
        environment.apiUrl + '/user/clearallsubject/' + userId,
        null
      )
      .subscribe((response) => {
        console.log(response.message);
        return;
      });
  }

  joinLecture(
    classId: string,
    studentData: {
      studentId: string;
      name: string;
      enrollment_no: number;
    }
  ) {
    return this.http.put<{ message: string }>(
      BACKEND_URL + 'joinlecture/' + classId,
      studentData
    );
  }

  checkJoinStatus(classId: string, studentId: string) {
    return this.http.get<{ joined: boolean }>(
      BACKEND_URL + 'checkjoin/' + classId + '/' + studentId
    );
  }
}
