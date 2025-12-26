// src/app/components/student-registration/student-registration.component.ts

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { StudentService } from '../../services/student.service';
import {
  FieldsOfStudies,
  StudentRegistrationDto,
} from '../../models/Student.model';

@Component({
  selector: 'app-student-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-registration.html',
  styleUrl: './student-registration.css',
})
export class StudentRegistrationComponent {
  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);

  registrationForm: FormGroup;
  fieldsOfStudies = Object.values(FieldsOfStudies);
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor() {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      birthDate: ['', Validators.required],
      field: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(4)]],
      hasEquivalence: [null, Validators.required],
      equivalenceSemester: ['', Validators.required],
    });
  }



  isFieldInvalid(fieldName: string): boolean {
    const field = this.registrationForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      Object.keys(this.registrationForm.controls).forEach((key) => {
        this.registrationForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const studentData: StudentRegistrationDto = this.registrationForm.value;

    this.studentService.registerStudent(studentData).subscribe({
      next: (response) => {
        this.successMessage = 'Student registered successfully!';
        this.registrationForm.reset();
        this.isSubmitting = false;
      },
      error: (error) => {
        this.errorMessage = 'Error registering student. Please try again.';
        console.error('Registration error:', error);
        this.isSubmitting = false;
      },
    });
  }

  onReset(): void {
    this.registrationForm.reset();
    this.successMessage = '';
    this.errorMessage = '';
  }
}
