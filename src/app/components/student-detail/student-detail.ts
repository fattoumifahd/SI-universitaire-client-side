// src/app/components/student-detail/student-detail.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { GradeService } from './../../services/grade';
import { Student, StudentGradeDTO } from '../../models/Student.model';
import { CoursBean } from '../../models/Cours.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './student-detail.html',
  styleUrl: './student-detail.css'
})
export class StudentDetailComponent implements OnInit {
  private studentService = inject(StudentService);
  private gradeService = inject(GradeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  student: Student | null = null;
  grades: StudentGradeDTO[] = [];
  isLoading = false;
  isLoadingGrades = false;
  errorMessage = '';
  successMessage = '';
  showDeleteModal = false;
  showGradeForm = false;
  isSubmittingGrade = false;
  gradeForm: FormGroup;
  editingGradeId: number | null = null;
  studentCourses : CoursBean[] = [];
  isLoadingCours = false;
  student_id : number  = 0 ;
  constructor() {
    this.gradeForm = this.fb.group({
      courseId: ['', [Validators.required, Validators.min(1)]],
      continuousAssessment: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
      finalExam: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
      academicYear: [new Date().getFullYear(), [Validators.required, Validators.min(2000), Validators.max(2100)]],
      // semesterNumber: [this.student?.currentSemester, [Validators.required]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.student_id = Number(id);
    if (id) {
      this.loadStudent(+id);
      this.loadGrades(+id);
    }
  }

  loadStudent(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.studentService.getStudent(id).subscribe({
      next: (data) => {
        console.log(data);
        this.student = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load student details';
        console.error('Error loading student:', error);
        this.isLoading = false;
      }
    });
    this.getStudentCours(this.student_id);
  }


  loadGrades(studentId: number): void {
    this.isLoadingGrades = true;

    this.gradeService.getGradesByStudentId(studentId).subscribe({
      next: (data) => {
        this.grades = data;
        this.isLoadingGrades = false;
      },
      error: (error) => {
        console.error('Error loading grades:', error);
        this.isLoadingGrades = false;
      }
    });
  }



  toggleGradeForm(): void {
    this.showGradeForm = !this.showGradeForm;
    if (!this.showGradeForm) {
      this.resetGradeForm();
    }
  }

  resetGradeForm(): void {
    this.gradeForm.reset({
      academicYear: new Date().getFullYear()
    });
    this.editingGradeId = null;
    this.successMessage = '';
    this.errorMessage = '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.gradeForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  calculateFinalGrade(): number {
    const ca = this.gradeForm.get('continuousAssessment')?.value || 0;
    const exam = this.gradeForm.get('finalExam')?.value || 0;
    return ca + exam;
  }

  onSubmitGrade(): void {
    if (this.gradeForm.invalid) {
      Object.keys(this.gradeForm.controls).forEach(key => {
        this.gradeForm.get(key)?.markAsTouched();
      });
      return;
    }

    if (!this.student?.id) {
      this.errorMessage = 'Student ID is missing';
      return;
    }

    this.isSubmittingGrade = true;
    this.errorMessage = '';
    this.successMessage = '';

    const gradeData: StudentGradeDTO = {
      ...this.gradeForm.value,
      studentId: this.student.id,
      finalGrade: this.calculateFinalGrade()
    };

    this.gradeService.createGrade(gradeData).subscribe({
      next: (response) => {
        this.successMessage = 'Grade added successfully!';
        this.isSubmittingGrade = false;
        this.resetGradeForm();
        this.showGradeForm = false;
        this.loadGrades(this.student!.id!);

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = 'Error adding grade. Please try again.';
        console.error('Grade error:', error);
        this.isSubmittingGrade = false;
      }
    });
  }

  deleteGrade(gradeId: number): void {
    if (confirm('Are you sure you want to delete this grade?')) {
      this.gradeService.deleteGrade(gradeId).subscribe({
        next: () => {
          this.successMessage = 'Grade deleted successfully!';
          this.loadGrades(this.student!.id!);

          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete grade';
          console.error('Error deleting grade:', error);
        }
      });
    }
  }

  getGradeStatus(finalGrade: number): string {
    if (finalGrade >= 32) return 'Excellent';
    if (finalGrade >= 28) return 'Very Good';
    if (finalGrade >= 24) return 'Good';
    if (finalGrade >= 20) return 'Pass';
    return 'Fail';
  }

  getGradeClass(finalGrade: number): string {
    if (finalGrade >= 32) return 'grade-excellent';
    if (finalGrade >= 28) return 'grade-very-good';
    if (finalGrade >= 24) return 'grade-good';
    if (finalGrade >= 20) return 'grade-pass';
    return 'grade-fail';
  }

  calculateAverageGrade(): number {
    if (this.grades.length === 0) return 0;
    const sum = this.grades.reduce((acc, grade) => acc + grade.finalGrade, 0);
    return sum / this.grades.length;
  }

  confirmDelete(): void {
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
  }

  deleteStudent(): void {
    if (this.student?.id) {
      this.studentService.deleteStudent(this.student.id).subscribe({
        next: () => {
          this.router.navigate(['/students']);
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete student';
          console.error('Error deleting student:', error);
          this.showDeleteModal = false;
        }
      });
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  }


  getStudentCours(id : number ): void {
    this.isLoadingCours = true;
    this.errorMessage = '';
    this.gradeService.getStudentCours(id).subscribe({
      next: (courses) => {
        console.log(courses);
        this.studentCourses = courses;
        this.isLoading = false;

      },
      error: (error) => {
        console.error('Error fetching student courses', error);
        this.errorMessage = 'Failed to load student courses';
        this.isLoading = false;
      }
    });
  }
}
