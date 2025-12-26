// src/app/services/student.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student, StudentRegistrationDto } from '../models/Student.model';

export interface StudentDto {
  id?: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  field: string;
  currentSemester: number;
  validatedSemesters: number[];
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:9999/studentms/api/student';

  // Get student by ID
  getStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  // Register new student
  registerStudent(dto: StudentRegistrationDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, dto, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // Update student
  updateStudent(id: number, student: StudentDto): Observable<StudentDto> {
    return this.http.put<StudentDto>(`${this.apiUrl}/update/${id}`, student);
  }

  // Delete student
  deleteStudent(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/remove/${id}`, {
      responseType: 'text'
    });
  }

  // Get all students (you'll need to add this endpoint to your backend)
  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }
}
