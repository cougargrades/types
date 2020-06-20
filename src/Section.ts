import { DocumentReference } from '@firebase/firestore-types';

export default interface Section {
  A?: number;
  B?: number;
  C?: number;
  D?: number;
  F?: number;
  Q?: number;
  course: DocumentReference | string;
  courseName: string;
  instructorNames: { firstName: string; lastName: string }[];
  instructors: DocumentReference[] | string[];
  sectionNumber: number;
  semesterGPA?: number;
  term: number;
  termString: string;
}
