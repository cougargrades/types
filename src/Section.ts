import { DocumentReference } from '@firebase/firestore-types';
import Course from './Course';
import Instructor from './Instructor';

export default class Section {
  constructor(
    public _id: string,
    public _path: string,
    public courseName: string,
    public instructorNames: { firstName: string; lastName: string }[],
    public instructors: Array<DocumentReference<Instructor>>,
    public sectionNumber: number,
    public term: number,
    public termString: string,
    public A?: number,
    public B?: number,
    public C?: number,
    public D?: number,
    public F?: number,
    public Q?: number,
    public semesterGPA?: number,
    public course?: DocumentReference<Course>,
  ) {}
}
