import { DocumentReference, FieldValue } from '@firebase/firestore-types';
import { Course } from './Course';
import { Instructor } from './Instructor';

export interface Section {
  _id: string;
  _path: string;
  courseName: string;
  instructorNames: { firstName: string; lastName: string }[];
  instructors: Array<DocumentReference<Instructor>> | Array<Instructor> | FieldValue;
  sectionNumber: number;
  term: number;
  termString: string;
  A?: number;
  B?: number;
  C?: number;
  D?: number;
  F?: number;
  Q?: number;
  semesterGPA?: number;
  course?: DocumentReference<Course> | Course;
}
