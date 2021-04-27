import { DocumentReference, FieldValue } from '@google-cloud/firestore';
import { Course } from './Course';

export default interface Group {
  name: string;
  identifier: string;
  description: string;
  courses: Array<DocumentReference<Course>> | Array<Course> | FieldValue;
  courses_count: number;
  keywords: string[] | FieldValue;
  categories: string[] | FieldValue;
}
