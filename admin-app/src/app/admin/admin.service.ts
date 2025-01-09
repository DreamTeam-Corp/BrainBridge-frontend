import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

const BACKEND_URL1 = environment.apiUrl + '/classroom/';
const BACKEND_URL2 = environment.apiUrl + '/user/';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private classrooms: any[] = [];
  private users: any[] = [];
  private classroomsUpdated = new Subject<any[]>();
  private usersUpdated = new Subject<any[]>();

  constructor(private http: HttpClient) {}

  getClassroomsUpdateListener() {
    return this.classroomsUpdated.asObservable();
  }

  getAllClassrooms() {
    this.http
      .get<{ message: string; classrooms: any[] }>(BACKEND_URL1 + 'all')
      .subscribe(
        (response) => {
          this.classrooms = response.classrooms;
          this.classroomsUpdated.next([...this.classrooms]);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  deleteClassroom(classroomId: string) {
    this.http
      .delete<{ message: string }>(BACKEND_URL1 + classroomId)
      .subscribe(() => {
        const updatedClassrooms = this.classrooms.filter(
          (classroom) => classroom._id !== classroomId
        );
        this.classrooms = updatedClassrooms;
        this.classroomsUpdated.next([...this.classrooms]);
      });
  }

  createClassroom(classData: {
    subject_name: string;
    subject_code: number;
    department: string;
    semester: number;
  }) {
    return this.http.post<{ message: string }>(
      BACKEND_URL1 + 'create',
      classData
    );
  }

  getUsersUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  getAllUsers() {
    this.http
      .get<{ message: string; users: any[] }>(BACKEND_URL2 + 'all')
      .subscribe(
        (response) => {
          this.users = response.users;
          this.usersUpdated.next([...this.users]);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  deleteUser(userId: string) {
    this.http
      .delete<{ message: string }>(BACKEND_URL2 + userId)
      .subscribe(() => {
        const updatedUsers = this.users.filter((user) => user._id !== userId);
        this.users = updatedUsers;
        this.usersUpdated.next([...this.users]);
      });
  }

  createUser(userData: any) {
    return this.http.post<{ message: string }>(
      BACKEND_URL2 + 'signup',
      userData
    );
  }
}
