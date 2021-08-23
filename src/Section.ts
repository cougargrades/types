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
  A: number;
  B: number;
  C: number;
  D: number;
  F: number;
  W: number;
  S: number;
  NCR: number;
  semesterGPA: number | null;
  course: DocumentReference<Course> | Course | null;
}
