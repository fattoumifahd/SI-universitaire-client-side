// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { StudentRegistrationComponent } from './components/student-registration/student-registration';
import { StudentListComponent } from './components/student-list/student-list';
import { StudentDetailComponent } from './components/student-detail/student-detail';
import { StudentUpdateComponent } from './components/student-update/student-update';

export const routes: Routes = [
  { path: '', redirectTo: '/students', pathMatch: 'full' },
  { path: 'students', component: StudentListComponent },
  { path: 'register', component: StudentRegistrationComponent },
  { path: 'student/:id', component: StudentDetailComponent },
  { path: 'student/edit/:id', component: StudentUpdateComponent },
  { path: '**', redirectTo: '/students' },
];
