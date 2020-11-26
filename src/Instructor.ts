import { DocumentReference, FieldValue } from '@firebase/firestore-types';
import { GPA } from './GPA';
import { DepartmentCode } from './DepartmentCode';
import { Course } from './Course';
import { Section } from './Section';
import Enrollment from './Enrollment';

export interface Instructor {
  _id: string;
  _path: string;
  firstName: string;
  lastName: string;
  fullName: string;
  departments: { [key in DepartmentCode]?: number };
  firstTaught: number;
  lastTaught: number;
  keywords: string[] | FieldValue;
  courses: Array<DocumentReference<Course>> | Array<Course> | FieldValue;
  sections: Array<DocumentReference<Section>> | Array<Section> | FieldValue;
  GPA: GPA;
  enrollment: Enrollment;
}
