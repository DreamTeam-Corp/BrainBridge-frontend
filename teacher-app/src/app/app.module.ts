import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularMaterialModule } from './angular-material.module';
import { ErrorComponent } from './error/error.component';
import { Page404notfoundComponent } from './page404notfound/page404notfound.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ProfileSetupComponent } from './auth/profile/profile-setup/profile-setup.component';
import { ProfileShowComponent } from './auth/profile/profile-show/profile-show.component';
import { LoginComponent } from './auth/login/login.component';
import { TeacherClassroomComponent } from './teacher/teacher-classroom/teacher-classroom.component';
import { TeacherClassroomSelectComponent } from './teacher/teacher-classroom-select/teacher-classroom-select.component';
import { TeacherClassroomUpdateComponent } from './teacher/teacher-classroom-update/teacher-classroom-update.component';
import { TeacherDashboardComponent } from './teacher/teacher-dashboard/teacher-dashboard.component';
import { HeaderComponent } from './header/header.component';
import { SubmissionsComponent } from './submission/submissions/submissions.component';
import { SubmissionCreateComponent } from './submission/submission-create/submission-create.component';
import { SubmissionShowComponent } from './submission/submission-show/submission-show.component';
import { TestsComponent } from './test/tests/tests.component';
import { TestShowComponent } from './test/test-show/test-show.component';
import { TestCreateComponent } from './test/test-create/test-create.component';
import { GradeDialogComponent } from './submission/grade-dialog/grade-dialog.component';
import { GradeBookComponent } from './teacher/grade-book/grade-book.component';

@NgModule({
  declarations: [
    AppComponent,
    Page404notfoundComponent,
    LoginComponent,
    ProfileSetupComponent,
    ProfileShowComponent,
    TeacherClassroomComponent,
    TeacherClassroomSelectComponent,
    TeacherClassroomUpdateComponent,
    TeacherDashboardComponent,
    HeaderComponent,
    SubmissionsComponent,
    SubmissionCreateComponent,
    SubmissionShowComponent,
    TestsComponent,
    TestShowComponent,
    TestCreateComponent,
    GradeDialogComponent,
    GradeBookComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatTooltipModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    DatePipe,
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent],
})
export class AppModule {}
