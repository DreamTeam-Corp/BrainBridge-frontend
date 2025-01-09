import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-grade-dialog',
  templateUrl: './grade-dialog.component.html',
  styleUrls: ['./grade-dialog.component.css'],
})
export class GradeDialogComponent {
  grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  selectedGrade: number | null = null; // изменяем тип и начальное значение
  comment: string = '';

  constructor(
    public dialogRef: MatDialogRef<GradeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selectedGrade = data.grade || null; // добавляем проверку на null
    this.comment = data.comment || '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close({
      grade: this.selectedGrade,
      comment: this.comment,
    });
  }
}
