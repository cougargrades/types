import { DocumentReference } from '@firebase/firestore-types';
import { GPA } from './Statistics';

export default interface Course {
  department: string;
  catalogNumber: string;
  description: string;
  GPA: GPA;
  sections: DocumentReference[] | string[];
  sectionCount: number;
  instructors: DocumentReference[] | string[];
}
