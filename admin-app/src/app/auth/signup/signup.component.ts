import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  departments = [
    'Computer Engineering',
    'Information Technology',
    'Civil Engineering',
    'Mechanical Engineering',
    'Chemical Engineering',
    'Aeronotical Engineering',
  ];
  semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  form: FormGroup;
  isLoading = false;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required],
      }),
      utype: new FormControl(null, {
        validators: [Validators.required],
      }),
      department: new FormControl(null),
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(6)],
      }),
      semester: new FormControl(null),
      dateofjoining: new FormControl(null),
    });
  }
  valid() {
    return this.form.value.utype == 'Student';
  }
  validAdmin() {
    return this.form.value.utype == 'Admin';
  }

  onSignup() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;

    const authData = {
      name: this.form.value.name,
      utype: this.form.value.utype,
      department: this.form.value.department,
      email: this.form.value.email,
      password: this.form.value.password,
      semester: this.form.value.semester || null,
      dateofjoining: this.form.value.dateofjoining || null,
    };

    // Теперь этот метод вернет Observable и subscribe будет работать
    this.authService.createUser(authData).subscribe(
      (response) => {
        this.isLoading = false;
        this.router.navigate(['/'], { queryParams: { tab: '1' } });
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }

  // Удаляем или комментируем метод onSaveData
  // onSaveData() {
  //   if (this.form.invalid) {
  //     return;
  //   }
  //   this.isLoading = true;
  //   const authData = {
  //     name: this.form.value.name,
  //     utype: this.form.value.utype,
  //     department: this.form.value.department,
  //     email: this.form.value.email,
  //     password: this.form.value.password,
  //     semester: this.form.value.semester || null,
  //     dateofjoining: this.form.value.dateofjoining || null,
  //   };
  //   console.log(authData);

  //   this.authService.createUser(authData);
  //   this.form.reset();
  //   this.isLoading = false;
  // }

  ngOnDestroy() {
    // Add any necessary cleanup code here
  }
}
