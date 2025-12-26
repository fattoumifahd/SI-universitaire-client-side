

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/Student.model';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css'
})
export class StudentListComponent implements OnInit {
  private studentService = inject(StudentService);

  students: Student[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  studentToDelete: number | null = null;

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.studentService.getAllStudents().subscribe({
      next: (data) => {
        this.students = data;
        console.log(data);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load students';
        console.error('Error loading students:', error);
        this.isLoading = false;
      }
    });
  }

  confirmDelete(id: number): void {
    this.studentToDelete = id;
  }

  cancelDelete(): void {
    this.studentToDelete = null;
  }

  deleteStudent(id: number): void {
    this.studentService.deleteStudent(id).subscribe({
      next: (response) => {
        this.successMessage = response;
        this.studentToDelete = null;
        this.loadStudents();

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete student';
        console.error('Error deleting student:', error);
        this.studentToDelete = null;
      }
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
}
