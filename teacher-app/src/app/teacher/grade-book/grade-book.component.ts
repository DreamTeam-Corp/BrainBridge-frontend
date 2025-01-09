import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeacherService } from '../teacher.service';
import { SubmissionService } from '../../submission/submission.service';
import { TestService } from '../../test/test.service';
import { forkJoin } from 'rxjs';
import { Student, Submission, Test } from './grade-book.interfaces';

@Component({
  selector: 'app-grade-book',
  templateUrl: './grade-book.component.html',
  styleUrls: ['./grade-book.component.css'],
})
export class GradeBookComponent implements OnInit {
  isLoading = false;
  classId: string;
  students: Student[] = [];
  submissionsList: Submission[] = [];
  testsList: Test[] = [];
  displayedColumns: string[] = [
    'name',
    'enrollment_no',
    'submissions',
    'tests',
    'average',
  ];
  grades: {
    [key: string]: {
      submissions: Array<{
        name: string;
        grade: number | null;
        comment: string;
      }>;
      tests: Array<{
        name: string;
        grade: number | null;
      }>;
    };
  } = {};

  constructor(
    private route: ActivatedRoute,
    private teacherService: TeacherService,
    private submissionService: SubmissionService,
    private testService: TestService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.route.params.subscribe((params) => {
      this.classId = params['classId'];
      this.loadGradeBook();
    });
  }

  loadGradeBook() {
    this.teacherService
      .getClassroomById(this.classId)
      .subscribe((classData) => {
        this.students = classData.classroom.student_enrolled;

        forkJoin({
          submissions: this.submissionService.getSubmissions(this.classId),
          tests: this.testService.getTests(this.classId),
        }).subscribe(({ submissions, tests }) => {
          this.submissionsList = submissions.submission;
          this.testsList = tests.test;
          this.prepareGrades();
          this.isLoading = false;
          this.updateDisplayedColumns();
        });
      });
  }

  updateDisplayedColumns() {
    this.displayedColumns = [
      'name',
      'enrollment_no',
      ...this.submissionsList.map((sub) => 'sub_' + sub._id),
      ...this.testsList.map((test) => 'test_' + test._id),
      'average',
    ];
  }

  prepareGrades() {
    this.students.forEach((student) => {
      this.grades[student._id] = {
        submissions: this.getSubmissionGrades(student._id),
        tests: this.getTestGrades(student._id),
      };
    });
  }

  getSubmissionGrades(studentId: string) {
    return this.submissionsList.map((sub) => ({
      name: sub.submission_name,
      grade: this.findStudentGrade(sub.uploaded, studentId),
      comment: this.findStudentComment(sub.uploaded, studentId),
    }));
  }

  getTestGrades(studentId: string) {
    return this.testsList.map((test) => ({
      name: test.test_name,
      grade: this.findStudentTestGrade(test.test_responses, studentId),
    }));
  }

  private findStudentGrade(uploaded: any[], studentId: string): number {
    const submission = uploaded?.find((u) => u.id === studentId);
    return submission?.grade || null;
  }

  private findStudentComment(uploaded: any[], studentId: string): string {
    const submission = uploaded?.find((u) => u.id === studentId);
    return submission?.comment || '';
  }

  private findStudentTestGrade(responses: any[], studentId: string): number {
    const response = responses?.find((r) => r.s_id === studentId);
    return response?.marks || null;
  }

  findSubmissionGrade(uploaded: any[], studentId: string): string {
    const submission = uploaded?.find((u) => u.id === studentId);
    return submission?.grade !== undefined
      ? submission.grade.toString()
      : 'N/A';
  }

  findTestGrade(responses: any[], studentId: string): string {
    const response = responses?.find((r) => r.s_id === studentId);
    return response?.marks !== undefined ? response.marks.toString() : 'N/A';
  }

  calculateAverage(studentId: string): number {
    const studentGrades = this.grades[studentId];
    if (!studentGrades) return 0;

    const allGrades = [
      ...studentGrades.submissions.map((s) => s.grade),
      ...studentGrades.tests.map((t) => t.grade),
    ].filter((grade) => grade !== null);

    if (allGrades.length === 0) return 0;
    return (
      Math.round(
        (allGrades.reduce((a, b) => a + b, 0) / allGrades.length) * 10
      ) / 10
    );
  }

  getGradeClass(grade: any): string {
    if (grade === 'N/A') return 'grade-na';
    const numGrade = Number(grade);
    if (numGrade < 4) return 'grade-low';
    if (numGrade < 7) return 'grade-medium';
    if (numGrade < 9) return 'grade-good';
    return 'grade-excellent';
  }
}
