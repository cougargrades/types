import { DocumentReference } from '@firebase/firestore-types';
import Course from './Course';
import Instructor from './Instructor';

export default class Section {
  constructor(
    public course: DocumentReference<Course> | string,
    public courseName: string,
    public instructorNames: { firstName: string, lastName: string }[],
    public instructors: DocumentReference<Instructor>[] | string[],
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
  ){}
}
