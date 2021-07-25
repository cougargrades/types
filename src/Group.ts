import { DocumentReference, FieldValue } from './FirestoreStubs';
import { Course } from './Course';

export interface Group {
  name: string;
  identifier: string;
  description: string;
  courses: Array<DocumentReference<Course>> | Array<Course> | FieldValue;
  keywords: string[] | FieldValue;
  categories: string[] | FieldValue;
}
