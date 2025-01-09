import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { SubmissionModel } from '../submission.model';
import { SubmissionService } from '../submission.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GradeDialogComponent } from '../grade-dialog/grade-dialog.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-submission-show',
  templateUrl: './submission-show.component.html',
  styleUrls: ['./submission-show.component.css'],
})
export class SubmissionShowComponent implements OnInit, OnDestroy {
  private isAuthenticated = false;
  private authStatusSub: Subscription;
  subId: string;
  displayedColumns = ['name', 'enrollment_no', 'file', 'grade', 'upload_time'];
  dataSource: any;
  submission: SubmissionModel;
  isLoading = false;
  grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  selectedGrade: number;
  comment: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private submissionService: SubmissionService,
    private authService: AuthService,
    public dialog: MatDialog,
    private datePipe: DatePipe // добавляем DatePipe
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.getIsAuth();
    this.isLoading = true;
    if (this.isAuthenticated) {
      this.getSubmission();
    }
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isAuthenticated = authStatus;
        if (!this.isAuthenticated) {
          this.router.navigate(['/login']);
        }
        if (this.isAuthenticated) {
          this.getSubmission();
        }
      });

    this.isLoading = false;
  }
  getSubmission() {
    this.isLoading = true;
    this.route.paramMap.subscribe(
      (paramMap: ParamMap) => {
        if (paramMap.has('subId')) {
          this.subId = paramMap.get('subId');
          // console.log(this.subId);

          this.submissionService.getSubmission(this.subId).subscribe(
            (response) => {
              console.log(response.message);
              this.submission = response.submission;
              // console.log(response.submission);
              if (this.submission.uploaded.length) {
                this.dataSource = new MatTableDataSource(
                  this.submission.uploaded
                );
                // this.dataSource = this.submission.uploaded;
              }
              this.isLoading = false;
            },
            (error) => {
              console.log(error);
              this.isLoading = false;
            }
          );
        } else {
          console.log('No params');
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  deleteSubmission(classId: string) {
    this.submissionService.deleteSubmission(this.subId, classId);
    this.router.navigate(['/']);
  }

  gradeSubmission(studentId: string, grade: number, comment: string) {
    this.isLoading = true;
    this.submissionService
      .gradeSubmission(this.subId, studentId, grade, comment)
      .subscribe(
        (response) => {
          console.log(response.message);
          this.getSubmission();
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
        }
      );
  }

  openGradeDialog(element: any) {
    const dialogRef = this.dialog.open(GradeDialogComponent, {
      width: '400px',
      data: {
        grade: element.grade,
        comment: element.comment,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.gradeSubmission(element.id, result.grade, result.comment);
      }
    });
  }

  // Добавляем метод для форматирования времени
  formatUploadTime(date: string): string {
    const uploadDate = new Date(date);
    uploadDate.setHours(uploadDate.getHours());
    return this.datePipe.transform(uploadDate, 'MMM d, HH:mm:ss') || '';
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
