import { DocumentReference, FieldValue } from './FirestoreStubs';
import { Course } from './Course';
import { Instructor } from './Instructor';

export interface Section {
  _id: string;
  _path: string;
  courseName: string;
  instructorNames: { firstName: string; lastName: string }[] | FieldValue;
  instructors: Array<DocumentReference<Instructor>> | Array<Instructor> | FieldValue;
  sectionNumber: number;
  term: number;
  termString: string;
  A?: number | undefined;
  B?: number | undefined;
  C?: number | undefined;
  D?: number | undefined;
  F?: number | undefined;
  W?: number | undefined;
  S?: number | undefined;
  NCR?: number | undefined;
  semesterGPA?: number | undefined;
  course?: DocumentReference<Course> | Course | undefined;
}
