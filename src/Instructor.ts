import { DocumentReference } from '@firebase/firestore-types';
import { GPA } from './Statistics';

export default interface Instructor {
  firstName: string;
  lastName: string;
  fullName: string;
  departments: { [key in DepartmentCode]: number };
  keywords: string[];
  courses: DocumentReference[] | string[];
  courses_count: number;
  sections: DocumentReference[] | string[];
  sections_count: number;
  GPA: GPA;
}
