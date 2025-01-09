import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthModel } from '../../auth/auth.model';
import { AuthService } from '../../auth/auth.service';
import { ProfileService } from '../../auth/profile.service';
import { TeacherService } from '../teacher.service';

@Component({
  selector: 'app-teacher-classroom-select',
  templateUrl: './teacher-classroom-select.component.html',
  styleUrls: ['./teacher-classroom-select.component.css'],
})
export class TeacherClassroomSelectComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  isLoading = false;
  private authStatusSub: Subscription;
  userId: string;
  private userDataAll: AuthModel;
  classrooms: any;
  sem: number;
  dept: string;
  departments = [
    'Computer Engineering',
    'Information Technology',
    'Civil Engineering',
    'Mechanical Engineering',
    'Chemical Engineering',
    'Aeronotical Engineering',
  ];
  semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private teacherService: TeacherService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.isLoading = true;
    if (this.isAuthenticated) {
      this.getProfile();
    }
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isAuthenticated = authStatus;
        if (!this.isAuthenticated) {
          this.router.navigate(['/login']);
        }
        if (this.isAuthenticated) {
          this.getProfile();
        }
      });

    this.isLoading = false;
  }
  getProfile() {
    this.isLoading = true;
    this.profileService.getProfile().subscribe(
      (response) => {
        console.log(response.message);
        this.userDataAll = response.userDetails;
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }
  checkIT(classId: string) {
    if (!this.userDataAll.subjects) {
      return false;
    }
    if (this.userDataAll.subjects.includes(classId)) {
      return true;
    } else {
      return false;
    }
  }
  getClassrooms(semester: number, department: string) {
    this.isLoading = true;
    this.sem = semester;
    this.dept = department;
    this.teacherService
      .getClassroomByDS(department, semester)
      .subscribe((response) => {
        console.log(response.message);
        this.classrooms = response.classroom;
        this.isLoading = false;
      });
  }
  assignYou(classId: string) {
    this.isLoading = true;
    const data = {
      classId: classId,
      assignId: this.userId,
    };
    this.teacherService.assignFacultyClassroom(data).subscribe(
      ([responseAssign, responseUser]) => {
        console.log(responseAssign.message);
        console.log(responseUser.message);
        this.getProfile();
        this.getClassrooms(this.sem, this.dept);
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }
  unassignYou(classId: string) {
    this.isLoading = true;
    const data = {
      classId: classId,
    };
    this.teacherService.unassignFacultyClassroom(data).subscribe(
      ([responseUnassign, responseUser]) => {
        // Изменено для обработки двух ответов
        console.log(responseUnassign.message);
        console.log(responseUser.message);
        this.getProfile();
        this.getClassrooms(this.sem, this.dept);
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
