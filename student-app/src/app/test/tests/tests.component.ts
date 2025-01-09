import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { AuthModel } from './../../auth/auth.model';
import { TestModel } from '../test.model';
import { AuthService } from './../../auth/auth.service';
import { TestService } from './../test.service';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/auth/profile.service';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css'],
})
export class TestsComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;
  private isAuthenticated = false;
  isLoading = false;
  private userDataAll: AuthModel;
  tests: Array<TestModel[]> = [];
  tests1: Array<TestModel[]> = [];

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router,
    private testService: TestService
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.getIsAuth();
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
    // this.isLoading = false;
  }
  getProfile() {
    this.isLoading = true;
    this.profileService.getProfile().subscribe(
      (response) => {
        console.log(response.message);
        this.userDataAll = response.userDetails;
        this.getTests();
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }
  getTests() {
    this.isLoading = true;
    this.tests = [];
    this.tests1 = [];

    if (this.userDataAll.subjects) {
      const requests = this.userDataAll.subjects.map((data) =>
        this.testService.getTestClassid(data)
      );

      forkJoin(requests).subscribe({
        next: (responses) => {
          responses.forEach((response) => {
            if (response.test.length) {
              const testData = response.test;

              // Разделяем тесты на текущие и выполненные
              const currentTests = testData.filter((test) => {
                // Проверяем, есть ли ответ текущего пользователя в тесте
                const userResponse = test.test_responses?.find(
                  (response) => response.s_id === this.authService.getUserId()
                );
                // Тест считается текущим, если нет ответа пользователя и срок не истек
                return !userResponse && this.validShow(test.due_date);
              });

              const pastTests = testData.filter((test) => {
                // Проверяем, есть ли ответ текущего пользователя или истек срок
                const userResponse = test.test_responses?.find(
                  (response) => response.s_id === this.authService.getUserId()
                );
                return userResponse || !this.validShow(test.due_date);
              });

              if (currentTests.length > 0) {
                this.tests.push(currentTests);
              }
              if (pastTests.length > 0) {
                this.tests1.push(pastTests);
              }
            }
          });
          this.isLoading = false;
        },
        error: (error) => {
          console.log(error);
          this.isLoading = false;
        },
      });
    } else {
      this.isLoading = false;
    }
  }
  validShow(due_date: Date) {
    const now = new Date();
    const due = new Date(due_date);
    // Упрощаем сравнение и учитываем текущее время
    return due > now;
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
