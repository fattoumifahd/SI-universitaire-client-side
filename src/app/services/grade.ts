
// src/app/services/grade.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentGradeDTO } from '../models/Student.model';
import { CoursBean } from '../models/Cours.model';

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:9999/studentms/api/student/grade';

  // Get all grades
  getAllGrades(): Observable<StudentGradeDTO[]> {
    return this.http.get<StudentGradeDTO[]>(this.apiUrl);
  }

  // Get grade by ID
  getGradeById(id: number): Observable<StudentGradeDTO> {
    return this.http.get<StudentGradeDTO>(`${this.apiUrl}/${id}`);
  }

  // Get grades by student ID
  getGradesByStudentId(studentId: number): Observable<StudentGradeDTO[]> {
    return this.http.get<StudentGradeDTO[]>(`${this.apiUrl}/student/${studentId}`);
  }

  // Get grades by course ID
  getGradesByCourseId(courseId: number): Observable<StudentGradeDTO[]> {
    return this.http.get<StudentGradeDTO[]>(`${this.apiUrl}/course/${courseId}`);
  }

  // Get grade by student ID and course ID
  getGradeByStudentAndCourse(studentId: number, courseId: number): Observable<StudentGradeDTO> {
    return this.http.get<StudentGradeDTO>(`${this.apiUrl}/student/${studentId}/course/${courseId}`);
  }

  // Create new grade
  createGrade(grade: StudentGradeDTO): Observable<StudentGradeDTO> {
    return this.http.post<StudentGradeDTO>(this.apiUrl, grade, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // Update grade
  updateGrade(id: number, grade: StudentGradeDTO): Observable<StudentGradeDTO> {
    return this.http.put<StudentGradeDTO>(`${this.apiUrl}/${id}`, grade);
  }

  // Delete grade
  deleteGrade(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getStudentCours(id: number ) : Observable<CoursBean[]> {
    return this.http.get<CoursBean[]>(`${this.apiUrl}/${id}/cours`);
  }
}
