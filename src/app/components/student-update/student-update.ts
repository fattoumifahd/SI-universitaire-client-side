
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StudentService, StudentDto } from '../../services/student.service';
import { FieldsOfStudies } from '../../models/Student.model';

@Component({
  selector: 'app-student-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './student-update.html',
  styleUrl: './student-update.css'
})
export class StudentUpdateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  updateForm: FormGroup;
  fieldsOfStudies = Object.values(FieldsOfStudies);
  studentId: number | null = null;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor() {
    this.updateForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      birthDate: ['', Validators.required],
      field: ['', Validators.required],
      currentSemester: [1, [Validators.required, Validators.min(1), Validators.max(12)]],
      validatedSemesters: [''],
      username: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.studentId = +id;
      this.loadStudent(this.studentId);
    }
  }

  loadStudent(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.studentService.getStudent(id).subscribe({
      next: (student) => {
        this.updateForm.patchValue({
          firstName: student.firstName,
          lastName: student.lastName,
          birthDate: student.birthDate,
          field: student.field,
          currentSemester: student.currentSemester,
          validatedSemesters: student.validatedSemesters?.join(', ') || '',
          username: student.username
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load student data';
        console.error('Error loading student:', error);
        this.isLoading = false;
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.updateForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  parseValidatedSemesters(value: string): number[] {
    if (!value || value.trim() === '') return [];
    return value
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n) && n > 0);
  }

  onSubmit(): void {
    if (this.updateForm.invalid) {
      Object.keys(this.updateForm.controls).forEach(key => {
        this.updateForm.get(key)?.markAsTouched();
      });
      return;
    }

    if (!this.studentId) {
      this.errorMessage = 'Student ID is missing';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.updateForm.value;
    const studentData: StudentDto = {
      ...formValue,
      validatedSemesters: this.parseValidatedSemesters(formValue.validatedSemesters)
    };

    this.studentService.updateStudent(this.studentId, studentData).subscribe({
      next: (response) => {
        this.successMessage = 'Student updated successfully!';
        this.isSubmitting = false;
        setTimeout(() => {
          this.router.navigate(['/student', this.studentId]);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = 'Error updating student. Please try again.';
        console.error('Update error:', error);
        this.isSubmitting = false;
      }
    });
  }

  onCancel(): void {
    if (this.studentId) {
      this.router.navigate(['/student', this.studentId]);
    } else {
      this.router.navigate(['/students']);
    }
  }
}
