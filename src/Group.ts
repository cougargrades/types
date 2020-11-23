import { DocumentReference } from '@firebase/firestore-types';
import { Course } from './Course';

export default interface Group {
  name: string;
  identifier: string;
  description: string;
  courses: Array<DocumentReference<Course>> | Array<Course>;
  courses_count: number;
  keywords: string[];
  categories: string[];
}
