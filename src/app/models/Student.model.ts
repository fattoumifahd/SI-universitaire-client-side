export enum FieldsOfStudies {
  COMPUTER_SCIENCE = 'CS',
  LAW = 'LW',
  BUSINESS = 'BS',
  DESING = 'DS'
}


export interface Student {
  id?: number;
  firstName: string;
  lastName: string;
  birthDate: string; // Format: YYYY-MM-DD
  field: FieldsOfStudies;
  currentSemester: number;
  validatedSemesters: number[];
  username: string;
  password?: string;
}

export interface StudentRegistrationDto {
  firstName: string;
  lastName: string;
  birthDate: string;
  field: String;
  username: string;
  hasEquivalence: Boolean
  equivalenceSemster: number
}
export interface StudentGradeDTO {
  id?: number;
  studentId: number;
  courseId: number;
  continuousAssessment: number;
  finalExam: number;
  finalGrade: number;
  academicYear: number;
  semesterNumber: number;
}
